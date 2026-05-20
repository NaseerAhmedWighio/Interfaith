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

    const sacredTexts = await prisma.sacredText.findMany({
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

    return NextResponse.json(sacredTexts)
  } catch (error) {
    console.error('Error fetching sacred texts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sacred texts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    // Check create permission
    const hasPermission = await checkPermission(user.id, 'sacred_texts', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create sacred texts' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, source, textContent, traditionId, theme } = body

    if (!title || !source || !textContent) {
      return NextResponse.json(
        { error: 'Title, source, and text content are required' },
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

    const sacredText = await prisma.sacredText.create({
      data: {
        title,
        source,
        textContent,
        traditionId: traditionId || null,
        theme: theme || 'peace',
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

    return NextResponse.json(sacredText, { status: 201 })
  } catch (error) {
    console.error('Error creating sacred text:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create sacred text' },
      { status: 500 }
    )
  }
}
