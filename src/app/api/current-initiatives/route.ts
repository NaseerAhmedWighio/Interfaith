import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    const items = await prisma.currentInitiative.findMany({ orderBy: { orderIndex: 'asc' } })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch current initiatives' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'current_initiatives', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create current initiatives' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    const item = await prisma.currentInitiative.create({
      data: {
        ...body,
        status: userWithRole?.role === 'admin' ? 'published' : 'pending_moderator',
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating current initiative:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json({ error: 'Failed to create current initiative' }, { status: 500 })
  }
}
