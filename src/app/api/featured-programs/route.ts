import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    let whereClause = {}

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      whereClause = { status: 'published' }
    }

    const programs = await prisma.featuredProgram.findMany({
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
        orderIndex: 'asc'
      }
    })

    return NextResponse.json(programs)
  } catch (error) {
    console.error('Error fetching featured programs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured programs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'featured_programs', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create featured programs' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, details, testimonialText, testimonialAuthor } = body

    if (!title || !description || !details || !testimonialText || !testimonialAuthor) {
      return NextResponse.json(
        { error: 'Title, description, details, testimonial text, and testimonial author are required' },
        { status: 400 }
      )
    }

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

    const program = await prisma.featuredProgram.create({
      data: {
        title,
        description,
        details,
        testimonialText,
        testimonialAuthor,
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

    return NextResponse.json(program, { status: 201 })
  } catch (error) {
    console.error('Error creating featured program:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create featured program' },
      { status: 500 }
    )
  }
}
