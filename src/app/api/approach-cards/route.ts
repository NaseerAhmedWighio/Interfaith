import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    const { searchParams } = new URL(request.url)
    const sectionType = searchParams.get('sectionType')

    const whereClause: Record<string, any> = {}
    if (!currentUser || currentUser.role === 'user') {
      whereClause.status = 'published'
    }
    if (sectionType) {
      whereClause.sectionType = sectionType
    }

    const cards = await prisma.approachCard.findMany({
      where: whereClause,
      orderBy: { orderIndex: 'asc' },
    })

    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error fetching approach cards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approach cards' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'approach_cards', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create approach cards' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { sectionType, title, description, features, icon, color, orderIndex } = body

    if (!sectionType || !title) {
      return NextResponse.json(
        { error: 'sectionType and title are required' },
        { status: 400 }
      )
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    const card = await prisma.approachCard.create({
      data: {
        sectionType,
        title,
        description,
        features: features ?? undefined,
        icon,
        color,
        orderIndex: orderIndex ?? 0,
        status: userWithRole?.role === 'admin' ? 'published' : 'pending_moderator',
      },
    })

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error('Error creating approach card:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create approach card' },
      { status: 500 }
    )
  }
}
