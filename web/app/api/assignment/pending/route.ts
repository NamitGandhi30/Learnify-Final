import { NextResponse } from 'next/server'
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // First, let's check if there are any assignments at all
    const totalAssignments = await db.assignment.count()
    console.log("Total assignments in database:", totalAssignments)

    // Check assignments for this user
    const userAssignments = await db.assignment.findMany({
      where: {
        OR: [
          {
            submissions: {
              some: {
                studentId: userId
              }
            }
          },
          {
            submissions: {
              none: {
                studentId: userId
              }
            }
          }
        ]
      }
    })
    console.log("Total assignments accessible to user:", userAssignments.length)

    // Now try the original query with logging
    const pendingAssignments = await db.assignment.findMany({
      where: {
        submissions: {
          none: {
            studentId: userId
          }
        },
        dueDate: {
          gte: new Date()
        }
      },
      include: {
        course: {
          select: {
            title: true
          }
        },
        submissions: true  // Include this temporarily for debugging
      },
      orderBy: {
        dueDate: 'asc'
      }
    })

    console.log("Pending assignments found:", pendingAssignments.length)
    console.log("Current date:", new Date().toISOString())
    console.log("First few assignments (if any):", 
      pendingAssignments.slice(0, 2).map(a => ({
        id: a.id,
        dueDate: a.dueDate,
        hasSubmissions: a.submissions.length > 0
      }))
    )

    return NextResponse.json({
      success: true,
      totalAssignments,
      pendingCount: pendingAssignments.length,
      pendingAssignments
    })
  } catch (error) {
    console.error("[PENDING_ASSIGNMENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}