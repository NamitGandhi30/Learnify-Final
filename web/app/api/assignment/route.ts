import { NextResponse } from 'next/server'
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { title, description, dueDate, courseId } = await req.json()

    const assignment = await db.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        courseId,
      },
    })

    return NextResponse.json(assignment)
  } catch (error) {
    console.error("[ASSIGNMENTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}