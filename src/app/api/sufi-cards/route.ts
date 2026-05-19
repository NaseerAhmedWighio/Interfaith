import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
    const body = await request.json()
    const { sectionType, title, subtitle, description, quote, icon, color, orderIndex } = body

    if (!sectionType || !title) {
      return NextResponse.json(
        { error: 'sectionType and title are required' },
        { status: 400 }
      )
    }

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
      },
    })

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error('Error creating sufi card:', error)
    return NextResponse.json(
      { error: 'Failed to create sufi card' },
      { status: 500 }
    )
  }
}
