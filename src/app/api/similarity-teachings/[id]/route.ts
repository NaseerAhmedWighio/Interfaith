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

    const teaching = await prisma.similarityTeaching.findUnique({
      where: { id },
      include: {
        tradition: { select: { id: true, name: true } },
      },
    })

    if (!teaching) {
      return NextResponse.json({ error: 'Similarity teaching not found' }, { status: 404 })
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (teaching.status !== 'published') {
        return NextResponse.json({ error: 'Similarity teaching not found' }, { status: 404 })
      }
    }

    return NextResponse.json(teaching)
  } catch (error) {
    console.error('Error fetching similarity teaching:', error)
    return NextResponse.json({ error: 'Failed to fetch similarity teaching' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'similarity_teachings', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update similarity teachings' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { traditionId, teaching, source, context, orderIndex } = body

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const updated = await prisma.similarityTeaching.update({
        where: { id },
        data: { traditionId, teaching, source, context: context || null, orderIndex, lastModifiedBy: user.id },
        include: { tradition: { select: { id: true, name: true } } },
      })
      return NextResponse.json(updated)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'similarity_teachings',
        contentId: id,
        changes: { traditionId, teaching, source, context, orderIndex },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      },
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating similarity teaching:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update similarity teaching' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const hasPermission = await checkPermission(user.id, 'similarity_teachings', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete similarity teachings' },
        { status: 403 }
      )
    }

    await prisma.similarityTeaching.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting similarity teaching:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete similarity teaching' }, { status: 500 })
  }
}
