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

    const goal = await prisma.impactGoal.findUnique({
      where: { id },
    })

    if (!goal) {
      return NextResponse.json(
        { error: 'Impact goal not found' },
        { status: 404 }
      )
    }

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      if (goal.status !== 'published') {
        return NextResponse.json(
          { error: 'Impact goal not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(goal)
  } catch (error) {
    console.error('Error fetching impact goal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch impact goal' },
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

    const hasPermission = await checkPermission(user.id, 'impact_goals', 'update')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to update impact goals' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { number, label } = body

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (userWithRole?.role === 'admin') {
      const goal = await prisma.impactGoal.update({
        where: { id },
        data: { number, label, status: 'published' },
      })
      return NextResponse.json(goal)
    }

    const pendingEdit = await prisma.pendingEdit.create({
      data: {
        contentType: 'impact_goals',
        contentId: id,
        changes: { number, label },
        status: userWithRole?.role === 'editor' ? 'pending_moderator' : 'pending_admin',
        createdBy: user.id,
      }
    })

    return NextResponse.json({ message: 'Edit submitted for review', pendingEdit })
  } catch (error) {
    console.error('Error updating impact goal:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update impact goal' },
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

    const hasPermission = await checkPermission(user.id, 'impact_goals', 'delete')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to delete impact goals' },
        { status: 403 }
      )
    }

    await prisma.impactGoal.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting impact goal:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete impact goal' },
      { status: 500 }
    )
  }
}
