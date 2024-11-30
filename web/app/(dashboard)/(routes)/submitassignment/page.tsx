'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Loader2 } from "lucide-react"

interface Assignment {
  id: string
  title: string
}

export default function SubmitAssignment() {
  const [file, setFile] = useState<File | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<string>('')
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/assignments/pending')
        if (response.ok) {
          const data = await response.json()
          setAssignments(data)
        } else {
          console.error('Failed to fetch assignments')
          setAlert({ type: 'error', message: 'Failed to load assignments. Please try again.' })
        }
      } catch (error) {
        console.error('Error fetching assignments:', error)
        setAlert({ type: 'error', message: 'Error loading assignments. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append('file', file as Blob)
    formData.append('assignmentId', selectedAssignment)

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setAlert({ type: 'success', message: 'Assignment submitted successfully' })
        setFile(null)
        setSelectedAssignment('')
      } else {
        const errorData = await response.json()
        setAlert({ type: 'error', message: errorData.message || 'Failed to submit assignment' })
      }
    } catch (error) {
      console.error('Error submitting assignment:', error)
      setAlert({ type: 'error', message: 'Error submitting assignment. Please try again.' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Assignment</h1>
      {/* {alert && (
        <Alert variant={alert.type === 'success' ? 'default' : 'destructive'} className="mb-6">
          {alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )} */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="assignment" className="block text-sm font-medium mb-1">Select Assignment</label>
          <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an assignment" />
            </SelectTrigger>
            <SelectContent>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-assignments" disabled>No pending assignments</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium mb-1">Upload File</label>
          <div className="flex items-center space-x-2">
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="flex-grow"
              required
            />
            <Button type="button" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          {file && <p className="mt-2 text-sm text-muted-foreground">Selected file: {file.name}</p>}
        </div>
        <div>
          <label htmlFor="comments" className="block text-sm font-medium mb-1">Additional Comments (optional)</label>
          <Textarea id="comments" name="comments" placeholder="Enter any additional comments" />
        </div>
        <Button type="submit" className="w-full" disabled={!selectedAssignment || !file}>Submit Assignment</Button>
      </form>
    </div>
  )
}