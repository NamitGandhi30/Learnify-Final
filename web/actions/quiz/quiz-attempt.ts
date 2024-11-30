'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import { QuizAttemptInput, QuestionType } from '@/types/quiz'

export async function submitQuizAttempt(input: QuizAttemptInput) {
  const { quizId, userId, answers, startTime, endTime } = input

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: {
        include: {
          codingProblem: true
        }
      }
    }
  })

  if (!quiz) {
    throw new Error('Quiz not found')
  }

  let score = 0;

  for (const question of quiz.questions) {
    const userAnswer = answers[question.id];
    
    switch (question.type) {
      case QuestionType.MCQ:
        if (userAnswer === question.correctAnswer) {
          score++;
        }
        break;
      case QuestionType.CODING:
        // For simplicity, we're just checking if the output matches
        // In a real application, you'd want to run tests on the submitted code
        if (userAnswer === question.codingProblem?.expectedOutput) {
          score++;
        }
        break;
      case QuestionType.LONG_ANSWER:
        // For long answers, we're not auto-grading
        // You might want to implement a separate grading process for these
        break;
    }
  }

  const attempt = await prisma.attempt.create({
    data: {
      quizId,
      userId,
      score,
      startTime,
      endTime,
      answers: answers,
    }
  })

  return attempt
}