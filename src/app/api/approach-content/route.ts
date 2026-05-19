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

    const content = await prisma.approachContent.findMany({
      where: whereClause,
      orderBy: {
        orderIndex: 'asc'
      }
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching approach content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approach content' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'approach_content', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create approach content' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { sectionKey, title, content, orderIndex } = body

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

    let status = 'published'
    if (userWithRole?.role === 'editor') {
      status = 'pending_moderator'
    } else if (userWithRole?.role === 'moderator') {
      status = 'pending_admin'
    }

    const approachContent = await prisma.approachContent.create({
      data: {
        sectionKey,
        title,
        content,
        orderIndex: orderIndex ?? 0,
        status,
      },
    })

    return NextResponse.json(approachContent, { status: 201 })
  } catch (error) {
    console.error('Error creating approach content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create approach content' },
      { status: 500 }
    )
  }
}
