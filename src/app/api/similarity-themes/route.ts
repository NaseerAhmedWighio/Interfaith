import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    let whereClause: any = {}

    if (!currentUser || currentUser.role === 'user') {
      whereClause = { status: 'published' }
    }

    const themes = await prisma.similarityTheme.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: { teachings: true },
        },
      },
      orderBy: {
        orderIndex: 'asc',
      },
    })

    return NextResponse.json(themes)
  } catch (error) {
    console.error('Error fetching similarity themes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch similarity themes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'similarity_themes', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create similarity themes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, icon, color, slug, orderIndex } = body

    if (!title || !description || !icon || !slug) {
      return NextResponse.json(
        { error: 'Title, description, icon, and slug are required' },
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

    const similarityTheme = await prisma.similarityTheme.create({
      data: {
        title,
        description,
        icon,
        color: color || null,
        slug,
        orderIndex: orderIndex || 0,
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
      },
    })

    return NextResponse.json(similarityTheme, { status: 201 })
  } catch (error) {
    console.error('Error creating similarity theme:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create similarity theme' },
      { status: 500 }
    )
  }
}
