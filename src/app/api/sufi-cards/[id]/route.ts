import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const card = await prisma.sufiCard.findUnique({ where: { id } })

    if (!card) {
      return NextResponse.json(
        { error: 'Sufi card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error('Error fetching sufi card:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sufi card' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.sufiCard.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Sufi card not found' },
        { status: 404 }
      )
    }

    const card = await prisma.sufiCard.update({
      where: { id },
      data: {
        sectionType: body.sectionType ?? existing.sectionType,
        title: body.title ?? existing.title,
        subtitle: body.subtitle !== undefined ? body.subtitle : existing.subtitle,
        description: body.description !== undefined ? body.description : existing.description,
        quote: body.quote !== undefined ? body.quote : existing.quote,
        icon: body.icon !== undefined ? body.icon : existing.icon,
        color: body.color !== undefined ? body.color : existing.color,
        orderIndex: body.orderIndex ?? existing.orderIndex,
      },
    })

    return NextResponse.json(card)
  } catch (error) {
    console.error('Error updating sufi card:', error)
    return NextResponse.json(
      { error: 'Failed to update sufi card' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.sufiCard.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Sufi card not found' },
        { status: 404 }
      )
    }

    await prisma.sufiCard.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sufi card:', error)
    return NextResponse.json(
      { error: 'Failed to delete sufi card' },
      { status: 500 }
    )
  }
}
