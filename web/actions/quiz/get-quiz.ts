'use server'

import { prisma } from '@/lib/prisma'

export async function getQuiz(id: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
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

export async function getQuizzesByCourse(courseId: string) {
  const quizzes = await prisma.quiz.findMany({
    where: { courseId },
    include: {
      questions: {
        include: {
          codingProblem: true
        }
      }
    }
  })

  return quizzes
}