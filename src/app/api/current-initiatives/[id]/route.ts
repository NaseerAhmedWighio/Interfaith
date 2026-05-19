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

    const item = await prisma.currentInitiative.findUnique({ where: { id } })

    if (!item) {
      return NextResponse.json(
        { error: 'Current initiative not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching current initiative:', error)
    return NextResponse.json(
      { error: 'Failed to fetch current initiative' },
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

    const hasPermission = await checkPermission(user.id, 'current_initiatives', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update current initiatives' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const existing = await prisma.currentInitiative.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Current initiative not found' },
        { status: 404 }
      )
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const item = await prisma.currentInitiative.update({
        where: { id },
        data: { ...body, status: 'published' },
      })
      return NextResponse.json(item)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'current_initiatives',
        contentId: id,
        changes: body,
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating current initiative:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update current initiative' },
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

    const hasPermission = await checkPermission(user.id, 'current_initiatives', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete current initiatives' },
        { status: 403 }
      )
    }

    const existing = await prisma.currentInitiative.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Current initiative not found' },
        { status: 404 }
      )
    }

    await prisma.currentInitiative.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting current initiative:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete current initiative' },
      { status: 500 }
    )
  }
}
