import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await prisma.aboutValue.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json(
        { error: 'About value not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching about value:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about value' },
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

    const existing = await prisma.aboutValue.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'About value not found' },
        { status: 404 }
      )
    }

    const item = await prisma.aboutValue.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description,
        icon: body.icon !== undefined ? body.icon : existing.icon,
        color: body.color !== undefined ? body.color : existing.color,
        orderIndex: body.orderIndex ?? existing.orderIndex,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating about value:', error)
    return NextResponse.json(
      { error: 'Failed to update about value' },
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
    const existing = await prisma.aboutValue.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'About value not found' },
        { status: 404 }
      )
    }
    await prisma.aboutValue.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting about value:', error)
    return NextResponse.json(
      { error: 'Failed to delete about value' },
      { status: 500 }
    )
  }
}
