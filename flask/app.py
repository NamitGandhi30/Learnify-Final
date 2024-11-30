from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import os
import PyPDF2
import json

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq()

SYSTEM_PROMPT = """You are a doubt clearing expert assistant. Your goal is to provide clear, accurate answers in 5 sentences or less, unless specifically asked to expand. Focus on the most important aspects of the question and eliminate any unnecessary information. Be direct and precise in your explanations."""

# Store conversation history in memory
conversation_history = [
    {"role": "system", "content": SYSTEM_PROMPT}
]

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400

        conversation_history.append({"role": "user", "content": user_message})

        chat_completion = client.chat.completions.create(
            messages=conversation_history,
            model="llama3-8b-8192",
            temperature=0.7,
            max_tokens=2048
        )

        assistant_response = chat_completion.choices[0].message.content
        conversation_history.append({"role": "assistant", "content": assistant_response})

        return jsonify({
            'response': assistant_response,
            'history': conversation_history[1:] 
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reset', methods=['POST'])
def reset():
    conversation_history.clear()
    conversation_history.append({"role": "system", "content": SYSTEM_PROMPT})
    return jsonify({'status': 'success'})

def extract_text_from_pdf(pdf_file):
    """Extract text content from uploaded PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        return str(e)

QUIZ_PROMPT = """Generate an MCQ quiz based on the following parameters:
Topic: {topic}
Subtopics: {subtopics}
Additional Content: {content}

Generate {num_questions} multiple choice questions. Each question should have 4 options with only one correct answer.
Ensure questions are varied in difficulty and cover different aspects of the topic.
"""

def process_quiz_response(response_text):
    """
    Process the LLM response text and extract questions data.
    Args:
        response_text (str): Raw response text from LLM
    Returns:
        list: List of parsed question dictionaries
    """
    # Extract JSON string from the response
    # Find the JSON content between triple backticks and curly braces
    try:
        # First try to find content between triple backticks
        start_idx = response_text.find('{')
        end_idx = response_text.rfind('}') + 1
        json_str = response_text[start_idx:end_idx]
        
        # Parse the JSON string
        import json
        parsed_data = json.loads(json_str)
        
        # Extract just the questions array
        questions = parsed_data.get('questions', [])
        
        # Validate each question has required fields
        for question in questions:
            if not all(key in question for key in ['question', 'options', 'answer']):
                raise ValueError("Invalid question format")
            if len(question['options']) != 4:
                raise ValueError("Each question must have exactly 4 options")
                
        return questions
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON response: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error processing quiz response: {str(e)}")

@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    try:
        # Get form data
        data = request.get_json()
        topic = data.get('topic')
        subtopics = data.get('subtopics', '').split(',')
        num_questions = int(data.get('num_questions', 5))
        
        # Handle PDF file if provided
        study_material = ""
        if 'pdf_file' in request.files:
            pdf_file = request.files['pdf_file']
            if pdf_file.filename.endswith('.pdf'):
                study_material = extract_text_from_pdf(pdf_file)

        # print(f'Topic for quiz generation is {topic}, Subtopics are {subtopics}')

        # Generate quiz using LLM
        quiz_completion = client.chat.completions.create(
            messages=[
            {"role": "system", "content": "You are a quiz generation expert. Generate questions in the specified JSON format which is {topic, subtopics, total_questions, questions: [{question, options: [option1, option2, option3, option4], answer}]."},
            {"role": "user", "content": f'Topic for quiz generation is {topic}, Subtopics are {subtopics}' + (f', Additional Content: {study_material}' if study_material else '') }
            ],
            model="llama3-8b-8192",
            temperature=0.7,
            max_tokens=2048
        )

        # Parse the response into structured format
        quiz_data = {
            "topic": topic,
            "subtopics": subtopics,
            "total_questions": num_questions,
            "questions": [],
            # "response": ""
        }

        # Process and structure the response
        # Note: You'll need to ensure the LLM outputs in a parseable format
        response_text = quiz_completion.choices[0].message.content
        # Add response processing logic here to populate quiz_data["questions"]
        # print(type(response_text))
        # quiz_data["response"] = response_text
        quiz_data["questions"] = process_quiz_response(response_text)

        return jsonify(quiz_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)