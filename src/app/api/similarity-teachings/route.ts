import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, getCurrentUser } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const themeId = searchParams.get('themeId')
    const currentUser = await getCurrentUser()

    let whereClause: any = {}
    if (themeId) whereClause.themeId = themeId

    if (!currentUser || currentUser.role === 'user') {
      whereClause.status = 'published'
    }

    const teachings = await prisma.similarityTeaching.findMany({
      where: whereClause,
      include: {
        tradition: {
          select: { id: true, name: true },
        },
      },
      orderBy: { orderIndex: 'asc' },
    })

    return NextResponse.json(teachings)
  } catch (error) {
    console.error('Error fetching similarity teachings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch similarity teachings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()

    const hasPermission = await checkPermission(user.id, 'similarity_teachings', 'create')
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'You do not have permission to create similarity teachings' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { themeId, traditionId, teaching, source, context, orderIndex } = body

    if (!themeId || !traditionId || !teaching || !source) {
      return NextResponse.json(
        { error: 'themeId, traditionId, teaching, and source are required' },
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

    const teachingRecord = await prisma.similarityTeaching.create({
      data: {
        themeId,
        traditionId,
        teaching,
        source,
        context: context || null,
        orderIndex: orderIndex ?? 0,
        status,
        createdBy: user.id,
        lastModifiedBy: user.id,
      },
      include: {
        tradition: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(teachingRecord, { status: 201 })
  } catch (error) {
    console.error('Error creating similarity teaching:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create similarity teaching' }, { status: 500 })
  }
}
