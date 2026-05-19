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

    const initiatives = await prisma.regionalInitiative.findMany({
      where: whereClause,
      orderBy: {
        orderIndex: 'asc'
      }
    })

    return NextResponse.json(initiatives)
  } catch (error) {
    console.error('Error fetching regional initiatives:', error)
    return NextResponse.json(
      { error: 'Failed to fetch regional initiatives' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'regional_initiatives', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create regional initiatives' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { region, initiatives } = body

    if (!region || !initiatives) {
      return NextResponse.json(
        { error: 'Region and initiatives are required' },
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

    const initiative = await prisma.regionalInitiative.create({
      data: {
        region,
        initiatives,
        status,
      },
    })

    return NextResponse.json(initiative, { status: 201 })
  } catch (error) {
    console.error('Error creating regional initiative:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create regional initiative' },
      { status: 500 }
    )
  }
}
