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

    const pillars = await prisma.corePillar.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        orderIndex: 'asc'
      }
    })

    return NextResponse.json(pillars)
  } catch (error) {
    console.error('Error fetching core pillars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch core pillars' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'core_pillars', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create core pillars' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, icon, color } = body

    if (!title || !description || !icon || !color) {
      return NextResponse.json(
        { error: 'Title, description, icon, and color are required' },
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

    const pillar = await prisma.corePillar.create({
      data: {
        title,
        description,
        icon,
        color,
        status,
        createdBy: user.id,
        lastModifiedBy: user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      }
    })

    return NextResponse.json(pillar, { status: 201 })
  } catch (error) {
    console.error('Error creating core pillar:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create core pillar' },
      { status: 500 }
    )
  }
}
