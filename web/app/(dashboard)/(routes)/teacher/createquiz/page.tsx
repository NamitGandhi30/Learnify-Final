'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2 } from "lucide-react"
import { useRouter } from 'next/navigation'

type Question = {
  question: string
  options: string[]
  correctAnswer: number
}

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState('')
  const [timeLimit, setTimeLimit] = useState(30) // Default time limit: 30 minutes
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ])
  const router = useRouter()

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: keyof Question, value: string | number) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuestions(updatedQuestions)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: quizTitle, timeLimit, questions }),
      })
      if (response.ok) {
        router.push('/quizzes') // Redirect to quizzes list
      } else {
        throw new Error('Failed to create quiz')
      }
    } catch (error) {
      console.error('Error creating quiz:', error)
      // Show error message to user
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="quizTitle" className="block text-sm font-medium mb-1">Quiz Title</label>
          <Input id="quizTitle" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Enter quiz title" required />
        </div>
        <div>
          <label htmlFor="timeLimit" className="block text-sm font-medium mb-1">Time Limit (minutes)</label>
          <Input id="timeLimit" type="number" value={timeLimit} onChange={(e) => setTimeLimit(parseInt(e.target.value))} placeholder="Enter time limit" required min="1" />
        </div>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="space-y-4 p-4 border rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Question {questionIndex + 1}</h3>
              <Button type="button" variant="destructive" size="icon" onClick={() => removeQuestion(questionIndex)} disabled={questions.length === 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea value={question.question} onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)} placeholder="Enter question" required />
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <Input value={option} onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)} placeholder={`Option ${optionIndex + 1}`} required />
                <input type="radio" name={`correct-answer-${questionIndex}`} checked={question.correctAnswer === optionIndex} onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)} required />
              </div>
            ))}
          </div>
        ))}
        <Button type="button" onClick={addQuestion} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Question
        </Button>
        <Button type="submit" className="w-full">Create Quiz</Button>
      </form>
    </div>
  )
}