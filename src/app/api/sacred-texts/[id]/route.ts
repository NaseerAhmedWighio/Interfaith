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

    const sacredText = await prisma.sacredText.findUnique({
      where: { id },
      include: {
        tradition: true,
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        modifier: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      }
    })

    if (!sacredText) {
      return NextResponse.json(
        { error: 'Sacred text not found' },
        { status: 404 }
      )
    }

    // If not authenticated or not admin/moderator, only show published content
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (sacredText.status !== 'published') {
        return NextResponse.json(
          { error: 'Sacred text not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(sacredText)
  } catch (error) {
    console.error('Error fetching sacred text:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sacred text' },
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

    // Check update permission
    const hasPermission = await checkPermission(user.id, 'sacred_texts', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update sacred texts' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, source, textContent, traditionId } = body

    // Get user's role to determine action
    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      // Admin updates directly
      const sacredText = await prisma.sacredText.update({
        where: { id },
        data: { title, source, textContent, traditionId, status: 'published', lastModifiedBy: user.id },
        include: { tradition: true, creator: { select: { id: true, fullName: true, email: true } }, modifier: { select: { id: true, fullName: true, email: true } } }
      })
      return NextResponse.json(sacredText)
    }

    // Editor/moderator: create pending edit instead of updating directly
    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'sacred_texts',
        contentId: id,
        changes: { title, source, textContent, traditionId },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating sacred text:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update sacred text' },
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

    // Check delete permission
    const hasPermission = await checkPermission(user.id, 'sacred_texts', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete sacred texts' },
        { status: 403 }
      )
    }

    await prisma.sacredText.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sacred text:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete sacred text' },
      { status: 500 }
    )
  }
}
