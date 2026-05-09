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

    const shareableQuote = await prisma.shareableQuote.findUnique({
      where: { id },
      include: {
        sacredText: {
          include: {
            tradition: true
          }
        },
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

    if (!shareableQuote) {
      return NextResponse.json(
        { error: 'Shareable quote not found' },
        { status: 404 }
      )
    }

    // If not authenticated or not admin/moderator, only show published content
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (shareableQuote.status !== 'published') {
        return NextResponse.json(
          { error: 'Shareable quote not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(shareableQuote)
  } catch (error) {
    console.error('Error fetching shareable quote:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shareable quote' },
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
    const hasPermission = await checkPermission(user.id, 'shareable_quotes', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update shareable quotes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { quoteText, backgroundStyle, sacredTextId } = body

    // Get user's role to determine action
    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      // Admin updates directly
      const shareableQuote = await prisma.shareableQuote.update({
        where: { id },
        data: { quoteText, backgroundStyle, sacredTextId, status: 'published', lastModifiedBy: user.id },
        include: { sacredText: { include: { tradition: true } }, creator: { select: { id: true, fullName: true, email: true } }, modifier: { select: { id: true, fullName: true, email: true } } }
      })
      return NextResponse.json(shareableQuote)
    }

    // Editor/moderator: create pending edit instead of updating directly
    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'shareable_quotes',
        contentId: id,
        changes: { quoteText, backgroundStyle, sacredTextId },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating shareable quote:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update shareable quote' },
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
    const hasPermission = await checkPermission(user.id, 'shareable_quotes', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete shareable quotes' },
        { status: 403 }
      )
    }

    await prisma.shareableQuote.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting shareable quote:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete shareable quote' },
      { status: 500 }
    )
  }
}
