import { ReactNode } from "react";

export enum QuestionType {
  MCQ = 'MCQ',
  CODING = 'CODING',
  LONG_ANSWER = 'LONG_ANSWER'
}

export interface Quiz {
  attempt: Attempt;
  description: ReactNode;
  id: string;
  title: string;
  timeLimit: number;
  courseId: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  correctOption: any;
  id: string;
  quizId: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: number;
  codingProblem?: CodingProblem;
  longAnswer?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CodingProblem {
  id: string;
  questionId: string;
  starterCode: string;
  expectedOutput: string;
}

export interface Attempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  startTime: Date;
  endTime: Date;
  answers: Record<string, any>; // This will store MCQ answers, code submissions, and long answers
}

export interface CreateQuizInput {
  title: string;
  timeLimit: number;
  courseId: string;
  questions: Omit<Question, 'id' | 'quizId' | 'createdAt' | 'updatedAt'>[];
}

export interface UpdateQuizInput extends Partial<CreateQuizInput> {
  id: string;
}

export interface QuizAttemptInput {
  quizId: string;
  userId: string;
  answers: Record<string, any>;
  startTime: Date;
  endTime: Date;
}