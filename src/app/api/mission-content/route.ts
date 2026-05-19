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

    const content = await prisma.missionContent.findMany({
      where: whereClause,
      orderBy: {
        sectionKey: 'asc'
      }
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching mission content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mission content' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'mission_content', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create mission content' },
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

    let status = 'published'
    if (userWithRole?.role === 'editor') {
      status = 'pending_moderator'
    } else if (userWithRole?.role === 'moderator') {
      status = 'pending_admin'
    }

    const missionContent = await prisma.missionContent.create({
      data: {
        sectionKey,
        title,
        content,
        status,
      },
    })

    return NextResponse.json(missionContent, { status: 201 })
  } catch (error) {
    console.error('Error creating mission content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create mission content' },
      { status: 500 }
    )
  }
}
