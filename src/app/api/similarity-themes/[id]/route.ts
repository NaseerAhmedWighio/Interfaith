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

    const similarityTheme = await prisma.similarityTheme.findUnique({
      where: { id },
      include: {
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

    if (!similarityTheme) {
      return NextResponse.json(
        { error: 'Similarity theme not found' },
        { status: 404 }
      )
    }

    // If not authenticated or not admin/moderator, only show published content
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (similarityTheme.status !== 'published') {
        return NextResponse.json(
          { error: 'Similarity theme not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(similarityTheme)
  } catch (error) {
    console.error('Error fetching similarity theme:', error)
    return NextResponse.json(
      { error: 'Failed to fetch similarity theme' },
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
    const hasPermission = await checkPermission(user.id, 'similarity_themes', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update similarity themes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, icon, slug, orderIndex } = body

    // Get user's role to determine action
    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      // Admin updates directly
      const similarityTheme = await prisma.similarityTheme.update({
        where: { id },
        data: { title, description, icon, slug, orderIndex, status: 'published', lastModifiedBy: user.id },
        include: { creator: { select: { id: true, fullName: true, email: true } }, modifier: { select: { id: true, fullName: true, email: true } } }
      })
      return NextResponse.json(similarityTheme)
    }

    // Editor/moderator: create pending edit instead of updating directly
    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'similarity_themes',
        contentId: id,
        changes: { title, description, icon, slug, orderIndex },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating similarity theme:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update similarity theme' },
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
    const hasPermission = await checkPermission(user.id, 'similarity_themes', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete similarity themes' },
        { status: 403 }
      )
    }

    await prisma.similarityTheme.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting similarity theme:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete similarity theme' },
      { status: 500 }
    )
  }
}
