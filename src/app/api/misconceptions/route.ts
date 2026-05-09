import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    let whereClause = {}

    // If not authenticated or not admin/moderator, only show published content
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      whereClause = { status: 'published' }
    }

    const misconceptions = await prisma.misconception.findMany({
      where: whereClause,
      include: {
        tradition: true,
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(misconceptions)
  } catch (error) {
    console.error('Error fetching misconceptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch misconceptions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    // Check create permission
    const hasPermission = await checkPermission(user.id, 'misconceptions', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create misconceptions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { traditionId, misconception, truth, category } = body

    if (!traditionId || !misconception || !truth) {
      return NextResponse.json(
        { error: 'Tradition, misconception, and truth are required' },
        { status: 400 }
      )
    }

    // Get user's role to determine status
    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    let status = 'published'
    if (userWithRole?.role === 'editor') {
      status = 'pending_moderator'
    } else if (userWithRole?.role === 'moderator') {
      status = 'pending_admin'
    }

    const newMisconception = await prisma.misconception.create({
      data: {
        traditionId,
        misconception,
        truth,
        category: category || 'general',
        status,
        createdBy: user.id,
        lastModifiedBy: user.id,
      },
      include: {
        tradition: true,
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      }
    })

    return NextResponse.json(newMisconception, { status: 201 })
  } catch (error) {
    console.error('Error creating misconception:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create misconception' },
      { status: 500 }
    )
  }
}
