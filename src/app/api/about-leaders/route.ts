import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    const whereClause: Record<string, any> = {}
    if (!currentUser || currentUser.role === 'user') {
      whereClause.status = 'published'
    }

    const items = await prisma.aboutLeader.findMany({
      where: whereClause,
      orderBy: { orderIndex: 'asc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching about leaders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about leaders' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'about_leaders', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create about leaders' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, role, description, image, orderIndex } = body

    if (!name || !role || !description) {
      return NextResponse.json(
        { error: 'name, role, and description are required' },
        { status: 400 }
      )
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    const item = await prisma.aboutLeader.create({
      data: {
        name,
        role,
        description,
        image,
        orderIndex: orderIndex ?? 0,
        status: userWithRole?.role === 'admin' ? 'published' : 'pending_moderator',
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating about leader:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create about leader' },
      { status: 500 }
    )
  }
}
