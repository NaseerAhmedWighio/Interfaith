import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const item = await prisma.aboutLeader.findUnique({ where: { id } })
    if (!item) {
      return NextResponse.json(
        { error: 'About leader not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching about leader:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about leader' },
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

    const existing = await prisma.aboutLeader.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'About leader not found' },
        { status: 404 }
      )
    }

    const item = await prisma.aboutLeader.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        role: body.role ?? existing.role,
        description: body.description ?? existing.description,
        image: body.image !== undefined ? body.image : existing.image,
        orderIndex: body.orderIndex ?? existing.orderIndex,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating about leader:', error)
    return NextResponse.json(
      { error: 'Failed to update about leader' },
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
    const existing = await prisma.aboutLeader.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'About leader not found' },
        { status: 404 }
      )
    }
    await prisma.aboutLeader.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting about leader:', error)
    return NextResponse.json(
      { error: 'Failed to delete about leader' },
      { status: 500 }
    )
  }
}
