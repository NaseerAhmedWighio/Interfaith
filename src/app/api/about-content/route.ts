import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    let whereClause = {}

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      whereClause = { status: 'published' }
    }

    const content = await prisma.aboutContent.findMany({
      where: whereClause,
      orderBy: {
        orderIndex: 'asc'
      }
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching about content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You do not have permission to create about content' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { sectionKey, title, content } = body

    if (!sectionKey || !title || !content) {
      return NextResponse.json(
        { error: 'Section key, title, and content are required' },
        { status: 400 }
      )
    }

    const aboutContent = await prisma.aboutContent.create({
      data: {
        sectionKey,
        title,
        content,
        status: 'published',
      }
    })

    return NextResponse.json(aboutContent, { status: 201 })
  } catch (error) {
    console.error('Error creating about content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create about content' },
      { status: 500 }
    )
  }
}