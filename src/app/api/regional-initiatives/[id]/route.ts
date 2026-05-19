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

    const initiative = await prisma.regionalInitiative.findUnique({
      where: { id },
    })

    if (!initiative) {
      return NextResponse.json(
        { error: 'Regional initiative not found' },
        { status: 404 }
      )
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (initiative.status !== 'published') {
        return NextResponse.json(
          { error: 'Regional initiative not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(initiative)
  } catch (error) {
    console.error('Error fetching regional initiative:', error)
    return NextResponse.json(
      { error: 'Failed to fetch regional initiative' },
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

    const hasPermission = await checkPermission(user.id, 'regional_initiatives', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update regional initiatives' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { region, initiatives } = body

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const initiative = await prisma.regionalInitiative.update({
        where: { id },
        data: { region, initiatives, status: 'published' },
      })
      return NextResponse.json(initiative)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'regional_initiatives',
        contentId: id,
        changes: { region, initiatives },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating regional initiative:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update regional initiative' },
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

    const hasPermission = await checkPermission(user.id, 'regional_initiatives', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete regional initiatives' },
        { status: 403 }
      )
    }

    await prisma.regionalInitiative.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting regional initiative:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete regional initiative' },
      { status: 500 }
    )
  }
}
