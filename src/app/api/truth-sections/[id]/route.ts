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

    const content = await prisma.truthSection.findUnique({
      where: { id },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Truth section not found' },
        { status: 404 }
      )
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (content.status !== 'published') {
        return NextResponse.json(
          { error: 'Truth section not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching truth section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch truth section' },
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

    const hasPermission = await checkPermission(user.id, 'truth_sections', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update truth sections' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { sectionKey, title, content } = body

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const truthSection = await prisma.truthSection.update({
        where: { id },
        data: { sectionKey, title, content, status: 'published' },
      })
      return NextResponse.json(truthSection)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'truth_sections',
        contentId: id,
        changes: { sectionKey, title, content },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating truth section:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update truth section' },
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

    const hasPermission = await checkPermission(user.id, 'truth_sections', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete truth sections' },
        { status: 403 }
      )
    }

    await prisma.truthSection.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting truth section:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete truth section' },
      { status: 500 }
    )
  }
}
