import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const card = await prisma.approachCard.findUnique({ where: { id } })

    if (!card) {
      return NextResponse.json(
        { error: 'Approach card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error('Error fetching approach card:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approach card' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'approach_cards', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update approach cards' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const existing = await prisma.approachCard.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Approach card not found' },
        { status: 404 }
      )
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const card = await prisma.approachCard.update({
        where: { id },
        data: {
          sectionType: body.sectionType ?? existing.sectionType,
          title: body.title ?? existing.title,
          description: body.description !== undefined ? body.description : existing.description,
          features: body.features !== undefined ? body.features : existing.features,
          icon: body.icon !== undefined ? body.icon : existing.icon,
          color: body.color !== undefined ? body.color : existing.color,
          orderIndex: body.orderIndex ?? existing.orderIndex,
        },
      })
      return NextResponse.json(card)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'approach_cards',
        contentId: id,
        changes: {
          sectionType: body.sectionType ?? existing.sectionType,
          title: body.title ?? existing.title,
          description: body.description !== undefined ? body.description : existing.description,
          features: body.features !== undefined ? body.features : existing.features,
          icon: body.icon !== undefined ? body.icon : existing.icon,
          color: body.color !== undefined ? body.color : existing.color,
          orderIndex: body.orderIndex ?? existing.orderIndex,
        },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating approach card:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update approach card' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'approach_cards', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete approach cards' },
        { status: 403 }
      )
    }

    const existing = await prisma.approachCard.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Approach card not found' },
        { status: 404 }
      )
    }

    await prisma.approachCard.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting approach card:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete approach card' },
      { status: 500 }
    )
  }
}
