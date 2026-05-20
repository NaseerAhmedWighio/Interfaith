import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    let whereClause = {}
    if (!currentUser || currentUser.role === 'user') {
      whereClause = { status: 'published' }
    }

    const traditions = await prisma.tradition.findMany({
      where: whereClause,
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(traditions)
  } catch (error) {
    console.error('Error fetching traditions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch traditions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'traditions', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create traditions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, coreValues } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
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

    const tradition = await prisma.tradition.create({
      data: {
        name,
        description,
        coreValues: coreValues || [],
        status,
      }
    })

    return NextResponse.json(tradition, { status: 201 })
  } catch (error) {
    console.error('Error creating tradition:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create tradition' },
      { status: 500 }
    )
  }
}
