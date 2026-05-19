import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionType = searchParams.get('sectionType')

    const where = sectionType ? { sectionType } : {}

    const cards = await prisma.approachCard.findMany({
      where,
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
    const body = await request.json()
    const { sectionType, title, description, features, icon, color, orderIndex } = body

    if (!sectionType || !title) {
      return NextResponse.json(
        { error: 'sectionType and title are required' },
        { status: 400 }
      )
    }

    const card = await prisma.approachCard.create({
      data: {
        sectionType,
        title,
        description,
        features: features ?? undefined,
        icon,
        color,
        orderIndex: orderIndex ?? 0,
      },
    })

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    console.error('Error creating approach card:', error)
    return NextResponse.json(
      { error: 'Failed to create approach card' },
      { status: 500 }
    )
  }
}
