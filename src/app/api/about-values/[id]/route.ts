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
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'about_values', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update about values' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const existing = await prisma.aboutValue.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'About value not found' },
        { status: 404 }
      )
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
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
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'about_values',
        contentId: id,
        changes: {
          title: body.title ?? existing.title,
          description: body.description ?? existing.description,
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
    console.error('Error updating about value:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

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
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'about_values', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete about values' },
        { status: 403 }
      )
    }

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

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete about value' },
      { status: 500 }
    )
  }
}
