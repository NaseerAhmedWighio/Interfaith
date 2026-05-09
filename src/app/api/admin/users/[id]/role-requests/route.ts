import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { hasRole } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    // Check if user is admin
    const isAdmin = await hasRole(user.id, ['admin'])
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // Get role requests for the user
    const roleRequests = await prisma.roleRequest.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        requestedRole: true,
        reason: true,
        status: true,
        adminNotes: true,
        createdAt: true,
        reviewedAt: true,
        reviewer: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ roleRequests })
  } catch (error) {
    console.error('Get user role requests error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred while fetching role requests' },
      { status: 500 }
    )
  }
}
