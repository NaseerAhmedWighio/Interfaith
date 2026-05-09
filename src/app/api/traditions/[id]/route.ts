import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const currentUser = await getCurrentUser()

    const tradition = await prisma.tradition.findUnique({
      where: { id }
    })

    if (!tradition) {
      return NextResponse.json(
        { error: 'Tradition not found' },
        { status: 404 }
      )
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (tradition.status !== 'published') {
        return NextResponse.json(
          { error: 'Tradition not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(tradition)
  } catch (error) {
    console.error('Error fetching tradition:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tradition' },
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

    const hasPermission = await checkPermission(user.id, 'traditions', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update traditions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, coreValues } = body

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const tradition = await prisma.tradition.update({
        where: { id },
        data: { name, description, coreValues, status: 'published' }
      })
      return NextResponse.json(tradition)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'traditions',
        contentId: id,
        changes: { name, description, coreValues },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating tradition:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update tradition' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'traditions', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete traditions' },
        { status: 403 }
      )
    }

    await prisma.tradition.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tradition:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete tradition' },
      { status: 500 }
    )
  }
}
