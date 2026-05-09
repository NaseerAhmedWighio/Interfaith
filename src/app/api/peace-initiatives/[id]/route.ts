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

    const initiative = await prisma.peaceInitiative.findUnique({
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

    if (!initiative) {
      return NextResponse.json(
        { error: 'Peace initiative not found' },
        { status: 404 }
      )
    }

    // If not authenticated or not admin/moderator, only show published content
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (initiative.status !== 'published') {
        return NextResponse.json(
          { error: 'Peace initiative not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(initiative)
  } catch (error) {
    console.error('Error fetching peace initiative:', error)
    return NextResponse.json(
      { error: 'Failed to fetch peace initiative' },
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
    const hasPermission = await checkPermission(user.id, 'peace_initiatives', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update peace initiatives' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, impact } = body

    // Get user's role to determine action
    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      // Admin updates directly
      const initiative = await prisma.peaceInitiative.update({
        where: { id },
        data: { title, description, impact, status: 'published', lastModifiedBy: user.id },
        include: { creator: { select: { id: true, fullName: true, email: true } }, modifier: { select: { id: true, fullName: true, email: true } } }
      })
      return NextResponse.json(initiative)
    }

    // Editor/moderator: create pending edit instead of updating directly
    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'peace_initiatives',
        contentId: id,
        changes: { title, description, impact },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating peace initiative:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update peace initiative' },
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
    const hasPermission = await checkPermission(user.id, 'peace_initiatives', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete peace initiatives' },
        { status: 403 }
      )
    }

    await prisma.peaceInitiative.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting peace initiative:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete peace initiative' },
      { status: 500 }
    )
  }
}
