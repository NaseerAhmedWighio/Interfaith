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

    const entries = await prisma.wisdomToAction.findMany({
      where: whereClause,
      orderBy: {
        title: 'asc'
      }
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching wisdom to action entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wisdom to action entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'wisdom_to_action', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create wisdom to action entries' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
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

    const entry = await prisma.wisdomToAction.create({
      data: {
        title,
        content,
        status,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error creating wisdom to action entry:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create wisdom to action entry' },
      { status: 500 }
    )
  }
}
