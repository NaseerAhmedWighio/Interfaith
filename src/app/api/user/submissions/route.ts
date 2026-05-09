import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/user/submissions
 *
 * Returns all submissions linked to the authenticated user:
 * - Movement membership
 * - Newsletter subscription
 * - Assessment results
 */
export async function GET() {
  try {
    const user = await requireAuth()

    // Fetch all user submissions in parallel
    const [movementMember, newsletter, assessments] = await Promise.all([
      prisma.movementMember.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.newsletterSubscriber.findFirst({
        where: { userId: user.id },
        orderBy: { subscribedAt: 'desc' },
      }),
      prisma.assessmentResult.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10, // Last 10 assessments
      }),
    ])

    return NextResponse.json({
      movementMember,
      newsletter,
      assessments,
    })
  } catch (error) {
    console.error('Error fetching user submissions:', error)
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}
