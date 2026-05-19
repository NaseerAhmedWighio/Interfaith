import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionType = searchParams.get('sectionType')

    const where = sectionType ? { sectionType } : {}

    const cards = await prisma.sufiCard.findMany({
      where,
      orderBy: { orderIndex: 'asc' },
    })

    return NextResponse.json(cards)
  } catch (error) {
    console.error('Error fetching sufi cards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sufi cards' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'sufi_cards', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create sufi cards' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { sectionType, title, subtitle, description, quote, icon, color, orderIndex } = body

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

    const card = await prisma.sufiCard.create({
      data: {
        sectionType,
        title,
        subtitle,
        description,
        quote,
        icon,
        color,
        orderIndex: orderIndex ?? 0,
        status: userWithRole?.role === 'admin' ? 'published' : 'pending_moderator',
      },
    })

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error('Error creating sufi card:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create sufi card' },
      { status: 500 }
    )
  }
}
