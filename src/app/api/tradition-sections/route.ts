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

    const content = await prisma.traditionSection.findMany({
      where: whereClause,
      orderBy: {
        sectionKey: 'asc'
      }
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching tradition sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tradition sections' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'tradition_sections', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create tradition sections' },
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

    const traditionSection = await prisma.traditionSection.create({
      data: {
        sectionKey,
        title,
        content,
        status,
      },
    })

    return NextResponse.json(traditionSection, { status: 201 })
  } catch (error) {
    console.error('Error creating tradition section:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create tradition section' },
      { status: 500 }
    )
  }
}
