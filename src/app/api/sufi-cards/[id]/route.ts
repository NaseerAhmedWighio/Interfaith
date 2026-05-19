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
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'sufi_cards', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update sufi cards' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const existing = await prisma.sufiCard.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Sufi card not found' },
        { status: 404 }
      )
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
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
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'sufi_cards',
        contentId: id,
        changes: {
          sectionType: body.sectionType ?? existing.sectionType,
          title: body.title ?? existing.title,
          subtitle: body.subtitle !== undefined ? body.subtitle : existing.subtitle,
          description: body.description !== undefined ? body.description : existing.description,
          quote: body.quote !== undefined ? body.quote : existing.quote,
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
    console.error('Error updating sufi card:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

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
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'sufi_cards', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete sufi cards' },
        { status: 403 }
      )
    }

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

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete sufi card' },
      { status: 500 }
    )
  }
}
