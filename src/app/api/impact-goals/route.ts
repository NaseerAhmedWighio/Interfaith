import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    let whereClause = {}

    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'moderator')) {
      whereClause = { status: 'published' }
    }

    const goals = await prisma.impactGoal.findMany({
      where: whereClause,
      orderBy: {
        orderIndex: 'asc'
      }
    })

    return NextResponse.json(goals)
  } catch (error) {
    console.error('Error fetching impact goals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch impact goals' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'impact_goals', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create impact goals' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { number, label } = body

    if (!number || !label) {
      return NextResponse.json(
        { error: 'Number and label are required' },
        { status: 400 }
      )
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    let status = 'published'
    if (userWithRole?.role === 'editor') {
      status = 'pending_moderator'
    } else if (userWithRole?.role === 'moderator') {
      status = 'pending_admin'
    }

    const goal = await prisma.impactGoal.create({
      data: {
        number,
        label,
        status,
      },
    })

    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Error creating impact goal:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create impact goal' },
      { status: 500 }
    )
  }
}
