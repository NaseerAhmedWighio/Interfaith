import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { hasRole } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    // Check if user is admin
    const isAdmin = await hasRole(user.id, ['admin'])
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // Get status filter from query params (default to all)
    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status')

    // Handle null status values as 'pending'
    let whereClause: Record<string, unknown> = {}
    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        whereClause = {
          OR: [
            { status: 'pending' },
            { status: null },
          ],
        }
      } else {
        whereClause = { status: statusFilter }
      }
    }

    // Get all role requests (filtered by status if provided)
    const roleRequests = await prisma.roleRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            createdAt: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ roleRequests })
  } catch (error) {
    console.error('Get role requests error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
