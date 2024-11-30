'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, Send } from "lucide-react";

export default function QuizPage() {
    const [step, setStep] = useState('generate');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [title, setTitle] = useState('');
    const [subtopics, setSubtopics] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfContent, setPdfContent] = useState('');

    const [quizData, setQuizData] = useState<any>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [score, setScore] = useState<number | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                setPdfFile(file);
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const text = e.target?.result;
                    setPdfContent(typeof text === 'string' ? text : '');
                };
                reader.readAsText(file);
                setError('');
            } else {
                setError('Please upload a PDF file');
                setPdfFile(null);
                setPdfContent('');
            }
        }
    };

    const handleGenerate = async () => {
        if (!title.trim()) {
            setError('Please enter a quiz title');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const subtopicsArray = subtopics
                ? subtopics.split(',').map(s => s.trim()).filter(Boolean)
                : [];

            const payload = {
                topic: title,
                subtopics: subtopicsArray.join(','),
                num_questions: 5,
                pdf_file: pdfContent
            };

            const response = await fetch('http://localhost:5000/api/generate-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Server error: ${response.status}`);
            }

            const data = await response.json();

            if (data.response) {
                setQuizData(data);
                setStep('taking');
            } else if (data.questions && Array.isArray(data.questions)) {
                setQuizData(data);
                setStep('taking');
            } else {
                throw new Error('Invalid quiz data received');
            }

        } catch (err: any) {
            console.error('Quiz generation error:', err);
            setError(err.message || 'Failed to generate quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answerIndex: number) => {
        if (!quizData?.questions) return;

        const newAnswers = [...answers, answerIndex];
        setAnswers(newAnswers);

        if (currentQuestion + 1 < quizData.questions.length) {
            setCurrentQuestion(curr => curr + 1);
        } else {
            const correctAnswers = newAnswers.reduce((acc, ans, idx) =>
                acc + (ans === quizData.questions[idx].answer ? 1 : 0), 0
            );
            setScore((correctAnswers / quizData.questions.length) * 100);
        }
    };

    const resetQuiz = () => {
        setStep('generate');
        setQuizData(null);
        setCurrentQuestion(0);
        setAnswers([]);
        setScore(null);
        setTitle('');
        setSubtopics('');
        setPdfFile(null);
        setPdfContent('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl">Quiz Generator</CardTitle>
                    <CardDescription className="text-blue-100">
                        Generate a custom quiz by providing a title, subtopics, and optional study material
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-6">
                    {step === 'generate' ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-gray-700">Quiz Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter quiz topic (e.g., Python Programming)"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subtopics" className="text-sm font-medium text-gray-700">Subtopics (comma-separated)</Label>
                                <Textarea
                                    id="subtopics"
                                    placeholder="Enter subtopics (e.g., syntax, functions, classes)"
                                    value={subtopics}
                                    onChange={(e) => setSubtopics(e.target.value)}
                                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pdf" className="text-sm font-medium text-gray-700">Study Material (Optional PDF)</Label>
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => document.getElementById('pdf')?.click()}
                                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Upload PDF
                                    </Button>
                                    {pdfFile && <span className="text-sm text-gray-500">{pdfFile.name}</span>}
                                </div>
                                <input
                                    id="pdf"
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleGenerate}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Generating Quiz...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Generate Quiz
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {score === null ? (
                                <>
                                    <div className="text-xl font-semibold text-blue-600">
                                        Question {currentQuestion + 1} of {quizData?.questions.length}
                                    </div>
                                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                                        <p className="text-lg mb-4 text-gray-800">{quizData?.questions[currentQuestion].question}</p>
                                        <div className="space-y-2">
                                            {quizData?.questions[currentQuestion].options.map((option: string, idx: number) => (
                                                <Button
                                                    key={idx}
                                                    variant="outline"
                                                    className="w-full justify-start text-left hover:bg-blue-100 hover:text-blue-700"
                                                    onClick={() => handleAnswer(idx)}
                                                >
                                                    {option}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center space-y-4">
                                    <h3 className="text-2xl font-bold text-blue-600">Quiz Complete!</h3>
                                    <p className="text-xl">Your Score: {score.toFixed(1)}%</p>
                                    <Button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-700 text-white">Start New Quiz</Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}