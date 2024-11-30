import { NextResponse } from 'next/server'
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"

export async function GET(
  req: Request,
  { params }: { params: { assignmentId: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Verify the user is a teacher
    const userProfile = await db.profile.findUnique({
      where: {
        userId: userId
      }
    })

    if (!userProfile || userProfile.role !== 'TEACHER') {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const submissions = await db.submission.findMany({
      where: {
        assignmentId: params.assignmentId
      },
      include: {
        assignment: true
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error("[SUBMISSIONS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}