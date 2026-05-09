import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUser()

    let whereClause = {}

    // If not authenticated or not admin/moderator, only show published content
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      whereClause = { status: 'published' }
    }

    const teachings = await prisma.teaching.findMany({
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

    return NextResponse.json(teachings)
  } catch (error) {
    console.error('Error fetching teachings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teachings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    // Check create permission
    const hasPermission = await checkPermission(user.id, 'teachings', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create teachings' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content, source, traditionId, category } = body

    if (!title || !content || !source) {
      return NextResponse.json(
        { error: 'Title, content, and source are required' },
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

    const teaching = await prisma.teaching.create({
      data: {
        title,
        content,
        source,
        traditionId: traditionId || null,
        category: category || 'peace',
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

    return NextResponse.json(teaching, { status: 201 })
  } catch (error) {
    console.error('Error creating teaching:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create teaching' },
      { status: 500 }
    )
  }
}
