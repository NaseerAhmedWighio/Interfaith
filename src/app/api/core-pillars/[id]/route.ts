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

    const pillar = await prisma.corePillar.findUnique({
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

    if (!pillar) {
      return NextResponse.json(
        { error: 'Core pillar not found' },
        { status: 404 }
      )
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (pillar.status !== 'published') {
        return NextResponse.json(
          { error: 'Core pillar not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(pillar)
  } catch (error) {
    console.error('Error fetching core pillar:', error)
    return NextResponse.json(
      { error: 'Failed to fetch core pillar' },
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

    const hasPermission = await checkPermission(user.id, 'core_pillars', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update core pillars' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, icon, color } = body

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const pillar = await prisma.corePillar.update({
        where: { id },
        data: { title, description, icon, color, status: 'published', lastModifiedBy: user.id },
        include: { creator: { select: { id: true, fullName: true, email: true } }, modifier: { select: { id: true, fullName: true, email: true } } }
      })
      return NextResponse.json(pillar)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'core_pillars',
        contentId: id,
        changes: { title, description, icon, color },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating core pillar:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update core pillar' },
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

    const hasPermission = await checkPermission(user.id, 'core_pillars', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete core pillars' },
        { status: 403 }
      )
    }

    await prisma.corePillar.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting core pillar:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete core pillar' },
      { status: 500 }
    )
  }
}
