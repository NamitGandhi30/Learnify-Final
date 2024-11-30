'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

type Question = {
  id: string
  text: string
  options: string[]
}

type Quiz = {
  id: string
  title: string
  timeLimit: number
  questions: Question[]
}

export default function QuizAttempt({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await fetch(`/api/quizzes/${quizId}`)
      const data = await response.json()
      setQuiz(data)
      setTimeLeft(data.timeLimit * 60) // Convert minutes to seconds
    }
    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (quiz) {
      submitQuiz()
    }
  }, [timeLeft, quiz])

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex })
  }

  const submitQuiz = async () => {
    try {
      const response = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, answers }),
      })
      if (response.ok) {
        const result = await response.json()
        router.push(`/results/${result.id}`)
      } else {
        throw new Error('Failed to submit quiz')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      // Show error message to user
    }
  }

  if (!quiz) return <div>Loading...</div>

  const question = quiz.questions[currentQuestion]

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <div className="mb-4">Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Question {currentQuestion + 1} of {quiz.questions.length}</h2>
        <p className="mb-4">{question.text}</p>
        <RadioGroup value={answers[question.id]?.toString()} onValueChange={(value) => handleAnswer(question.id, parseInt(value))}>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="flex justify-between">
        <Button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0}>
          Previous
        </Button>
        {currentQuestion < quiz.questions.length - 1 ? (
          <Button onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}>
            Next
          </Button>
        ) : (
          <Button onClick={submitQuiz}>Submit Quiz</Button>
        )}
      </div>
    </div>
  )
}