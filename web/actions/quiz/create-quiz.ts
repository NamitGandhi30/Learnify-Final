'use server'

import { db } from '@/lib/db'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import { CreateQuizInput, QuestionType } from '@/types/quiz'

export async function createQuiz(input: CreateQuizInput) {
  const { title, timeLimit, courseId, questions } = input

  const quiz = await prisma.quiz.create({
    data: {
      title,
      timeLimit,
      courseId,
      questions: {
        create: questions.map(q => ({
          text: q.text,
          type: q.type,
          options: q.type === QuestionType.MCQ ? q.options : undefined,
          correctAnswer: q.type === QuestionType.MCQ ? q.correctAnswer : undefined,
          longAnswer: q.type === QuestionType.LONG_ANSWER ? q.longAnswer : undefined,
          codingProblem: q.type === QuestionType.CODING
            ? {
                create: {
                  starterCode: q.codingProblem!.starterCode,
                  expectedOutput: q.codingProblem!.expectedOutput
                }
              }
            : undefined
        }))
      }
    },
    include: {
      questions: {
        include: {
          codingProblem: true
        }
      }
    }
  })

  return quiz
}