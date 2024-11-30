'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Loader2, TrashIcon, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface ChatResponse {
    response: string
    history: Message[]
    error?: string
}

export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        if (!inputMessage.trim() || isLoading) return

        setIsLoading(true)

        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: ChatResponse = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            setMessages(data.history)

        } catch (error) {
            const errorMessage: Message = {
                role: 'assistant',
                content: error instanceof Error
                    ? `Error: ${error.message}`
                    : 'Sorry, I encountered an error. Please try again.'
            }

            setMessages(prev => [...prev, errorMessage])
        } finally {
            setInputMessage('')
            setIsLoading(false)
        }
    }

    const handleReset = async () => {
        try {
            await fetch('http://localhost:5000/api/reset', {
                method: 'POST'
            })
            setMessages([])
        } catch (error) {
            console.error('Error resetting conversation:', error)
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="rounded-full w-20 h-20 bg-blue-500 hover:bg-blue-600 shadow-lg"
                            aria-label="Open chat"
                        >
                            <MessageCircle className="h-10 w-10" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                    >
                        <Card className="w-[30rem] h-[40rem] shadow-xl bg-blue-50 flex flex-col">
                            <CardHeader className="bg-blue-500 text-white">
                                <CardTitle className="flex justify-between items-center">
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5" />
                                        Chat Assistant
                                    </span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleReset}
                                            className="h-8 w-8 hover:bg-blue-400"
                                            aria-label="Reset conversation"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsOpen(false)}
                                            className="h-8 w-8 hover:bg-blue-400"
                                            aria-label="Close chat"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-0 flex-grow">
                                <ScrollArea className="h-[30rem] p-4">
                                    <div className="space-y-4">
                                        {messages.map((message, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user'
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-white text-blue-900 border border-blue-200'
                                                        }`}
                                                >
                                                    {message.content}
                                                </div>
                                            </motion.div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="rounded-lg px-4 py-2 bg-white border border-blue-200">
                                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>
                            </CardContent>

                            <CardFooter className="bg-white border-t border-blue-100 p-4">
                                <form onSubmit={handleSubmit} className="w-full">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={inputMessage}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setInputMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="flex-1 border-blue-200 focus:ring-blue-500"
                                            aria-label="Message input"
                                            disabled={isLoading}
                                        />
                                        <Button
                                            type="submit"
                                            size="icon"
                                            disabled={isLoading}
                                            aria-label="Send message"
                                            className="bg-blue-500 hover:bg-blue-600"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}