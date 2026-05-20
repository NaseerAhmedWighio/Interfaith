import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    let whereClause = {}

    if (!currentUser || currentUser.role === 'user') {
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

    const hasPermission = await checkPermission(user.id, 'about_content', 'create')
    if (!hasPermission) {
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

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    const aboutContent = await prisma.aboutContent.create({
      data: {
        sectionKey,
        title,
        content,
        status: userWithRole?.role === 'admin' ? 'published' : 'pending_moderator',
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
