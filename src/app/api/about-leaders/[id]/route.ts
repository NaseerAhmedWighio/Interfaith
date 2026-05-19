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
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'about_leaders', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update about leaders' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const existing = await prisma.aboutLeader.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'About leader not found' },
        { status: 404 }
      )
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
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
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'about_leaders',
        contentId: id,
        changes: {
          name: body.name ?? existing.name,
          role: body.role ?? existing.role,
          description: body.description ?? existing.description,
          image: body.image !== undefined ? body.image : existing.image,
          orderIndex: body.orderIndex ?? existing.orderIndex,
        },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating about leader:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

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
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'about_leaders', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete about leaders' },
        { status: 403 }
      )
    }

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

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete about leader' },
      { status: 500 }
    )
  }
}
