import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    const items = await prisma.aboutValue.findMany({
      orderBy: { orderIndex: 'asc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching about values:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about values' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'about_values', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create about values' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, icon, color, orderIndex } = body

    if (!title || !description) {
      return NextResponse.json(
        { error: 'title and description are required' },
        { status: 400 }
      )
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    const item = await prisma.aboutValue.create({
      data: {
        title,
        description,
        icon,
        color,
        orderIndex: orderIndex ?? 0,
        status: userWithRole?.role === 'admin' ? 'published' : 'pending_moderator',
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating about value:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create about value' },
      { status: 500 }
    )
  }
}
