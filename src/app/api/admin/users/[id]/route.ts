import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/session'
import { hasRole } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    // Check if user is admin or accessing their own profile
    const isAdmin = await hasRole(user.id, ['admin'])
    if (!isAdmin && user.id !== id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get user details
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        permissions: true,
      },
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user: targetUser })
  } catch (error) {
    console.error('Get user error:', error)

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    // Check if user is admin
    const isAdmin = await hasRole(user.id, ['admin'])
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { role, isActive } = body

    // Validate role
    if (role && !['user', 'volunteer', 'editor', 'moderator', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(typeof isActive === 'boolean' && { isActive }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    })

    return NextResponse.json({
      message: 'User updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Update user error:', error)

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred while updating user' },
      { status: 500 }
    )
  }
}
