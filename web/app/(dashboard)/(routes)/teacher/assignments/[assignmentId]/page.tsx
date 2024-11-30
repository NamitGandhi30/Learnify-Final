'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from "lucide-react"

interface Submission {
  id: string
  studentName: string
  fileUrl: string
  comments?: string
  submittedAt: string
}

export default function AssignmentSubmissions({ params }: { params: { assignmentId: string } }) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`/api/assignments/${params.assignmentId}/submissions`)
        if (response.ok) {
          const data = await response.json()
          setSubmissions(data)
        }
      } catch (error) {
        console.error('Error fetching submissions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubmissions()
  }, [params.assignmentId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Assignment Submissions</h1>
      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="p-4 border rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{submission.studentName}</h3>
                <p className="text-sm text-muted-foreground">
                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                </p>
                {submission.comments && (
                  <p className="mt-2 text-sm">{submission.comments}</p>
                )}
              </div>
              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Submission
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}