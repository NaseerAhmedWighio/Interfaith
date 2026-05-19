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

    const content = await prisma.sufiContent.findUnique({
      where: { id },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Sufi content not found' },
        { status: 404 }
      )
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (content.status !== 'published') {
        return NextResponse.json(
          { error: 'Sufi content not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching sufi content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sufi content' },
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

    const hasPermission = await checkPermission(user.id, 'sufi_content', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update sufi content' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { sectionKey, title, content, orderIndex } = body

    const updateData: Record<string, unknown> = {}
    if (sectionKey !== undefined) updateData.sectionKey = sectionKey
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex
    updateData.status = 'published'

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const sufiContent = await prisma.sufiContent.update({
        where: { id },
        data: updateData,
      })
      return NextResponse.json(sufiContent)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'sufi_content',
        contentId: id,
        changes: { sectionKey, title, content, orderIndex },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating sufi content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update sufi content' },
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

    const hasPermission = await checkPermission(user.id, 'sufi_content', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete sufi content' },
        { status: 403 }
      )
    }

    await prisma.sufiContent.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sufi content:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete sufi content' },
      { status: 500 }
    )
  }
}
