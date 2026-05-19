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

    const entries = await prisma.getInvolved.findMany({
      where: whereClause,
      orderBy: {
        orderIndex: 'asc'
      }
    })

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching get involved entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch get involved entries' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'get_involved', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create get involved entries' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
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

    const entry = await prisma.getInvolved.create({
      data: {
        title,
        description,
        status,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Error creating get involved entry:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create get involved entry' },
      { status: 500 }
    )
  }
}
