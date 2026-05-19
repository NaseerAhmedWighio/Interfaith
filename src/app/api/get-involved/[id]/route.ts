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

    const entry = await prisma.getInvolved.findUnique({
      where: { id },
    })

    if (!entry) {
      return NextResponse.json(
        { error: 'Get involved entry not found' },
        { status: 404 }
      )
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (entry.status !== 'published') {
        return NextResponse.json(
          { error: 'Get involved entry not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error fetching get involved entry:', error)
    return NextResponse.json(
      { error: 'Failed to fetch get involved entry' },
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

    const hasPermission = await checkPermission(user.id, 'get_involved', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update get involved entries' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description } = body

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const entry = await prisma.getInvolved.update({
        where: { id },
        data: { title, description, status: 'published' },
      })
      return NextResponse.json(entry)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'get_involved',
        contentId: id,
        changes: { title, description },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating get involved entry:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update get involved entry' },
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

    const hasPermission = await checkPermission(user.id, 'get_involved', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete get involved entries' },
        { status: 403 }
      )
    }

    await prisma.getInvolved.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting get involved entry:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete get involved entry' },
      { status: 500 }
    )
  }
}
