import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    let whereClause = {}

    // If not authenticated or not admin/moderator, only show published content
    if (!currentUser || currentUser.role === 'user') {
      whereClause = { status: 'published' }
    }

    const initiatives = await prisma.peaceInitiative.findMany({
      where: whereClause,
      include: {
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

    return NextResponse.json(initiatives)
  } catch (error) {
    console.error('Error fetching peace initiatives:', error)
    return NextResponse.json(
      { error: 'Failed to fetch peace initiatives' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    // Check create permission
    const hasPermission = await checkPermission(user.id, 'peace_initiatives', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create peace initiatives' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, impact } = body

    if (!title || !description || !impact) {
      return NextResponse.json(
        { error: 'Title, description, and impact are required' },
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

    const initiative = await prisma.peaceInitiative.create({
      data: {
        title,
        description,
        impact,
        status,
        createdBy: user.id,
        lastModifiedBy: user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      }
    })

    return NextResponse.json(initiative, { status: 201 })
  } catch (error) {
    console.error('Error creating peace initiative:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create peace initiative' },
      { status: 500 }
    )
  }
}
