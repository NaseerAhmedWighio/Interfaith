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

    const program = await prisma.featuredProgram.findUnique({
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

    if (!program) {
      return NextResponse.json(
        { error: 'Featured program not found' },
        { status: 404 }
      )
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (program.status !== 'published') {
        return NextResponse.json(
          { error: 'Featured program not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(program)
  } catch (error) {
    console.error('Error fetching featured program:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured program' },
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

    const hasPermission = await checkPermission(user.id, 'featured_programs', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update featured programs' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, details, testimonialText, testimonialAuthor } = body

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const program = await prisma.featuredProgram.update({
        where: { id },
        data: { title, description, details, testimonialText, testimonialAuthor, status: 'published', lastModifiedBy: user.id },
        include: { creator: { select: { id: true, fullName: true, email: true } }, modifier: { select: { id: true, fullName: true, email: true } } }
      })
      return NextResponse.json(program)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'featured_programs',
        contentId: id,
        changes: { title, description, details, testimonialText, testimonialAuthor },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating featured program:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update featured program' },
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

    const hasPermission = await checkPermission(user.id, 'featured_programs', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete featured programs' },
        { status: 403 }
      )
    }

    await prisma.featuredProgram.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting featured program:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete featured program' },
      { status: 500 }
    )
  }
}
