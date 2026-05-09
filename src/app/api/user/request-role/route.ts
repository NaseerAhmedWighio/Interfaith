import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { requestedRole, reason } = body

    // Validate input
    if (!requestedRole || !['editor', 'moderator', 'admin'].includes(requestedRole)) {
      return NextResponse.json(
        { error: 'Invalid role requested. Only editor, moderator, and admin roles can be requested.' },
        { status: 400 }
      )
    }

    // Check if user already has this role or higher
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const roleHierarchy = ['user', 'editor', 'moderator', 'admin']
    const currentRoleIndex = roleHierarchy.indexOf(currentUser.role ?? 'user')
    const requestedRoleIndex = roleHierarchy.indexOf(requestedRole)

    if (currentRoleIndex >= requestedRoleIndex) {
      return NextResponse.json(
        { error: 'You already have this role or a higher role' },
        { status: 400 }
      )
    }

    // Check if there's already a pending request
    const existingRequest = await prisma.roleRequest.findFirst({
      where: {
        userId: user.id,
        status: 'pending',
      },
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending role request' },
        { status: 400 }
      )
    }

    // Create role request
    const roleRequest = await prisma.roleRequest.create({
      data: {
        userId: user.id,
        requestedRole,
        reason,
      },
    })

    return NextResponse.json({
      message: 'Role request submitted successfully. An admin will review it soon.',
      roleRequest: {
        id: roleRequest.id,
        requestedRole: roleRequest.requestedRole,
        status: roleRequest.status,
        createdAt: roleRequest.createdAt,
      },
    })
  } catch (error) {
    console.error('Role request error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred while submitting role request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    // Get user's role requests
    const roleRequests = await prisma.roleRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        requestedRole: true,
        reason: true,
        status: true,
        adminNotes: true,
        createdAt: true,
        reviewedAt: true,
      },
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
