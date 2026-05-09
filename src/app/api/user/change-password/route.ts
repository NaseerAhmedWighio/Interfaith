import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validatePassword, verifyPassword } from '@/lib/auth'
import { requireAuth, deleteAllUserSessions, createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth()

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    // Fetch user with password hash
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, passwordHash: true, email: true, fullName: true, role: true },
    })

    if (!userWithPassword) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(
      currentPassword,
      userWithPassword.passwordHash
    )

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'New password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check that new password is different from current
    const isSamePassword = await verifyPassword(newPassword, userWithPassword.passwordHash)
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
      },
    })

    // Invalidate all existing sessions for security
    await deleteAllUserSessions(user.id)

    // Create a new session for the current request
    const newSession = await createSession(
      user.id,
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    )

    // Set the new session cookie
    const response = NextResponse.json({
      message: 'Password changed successfully',
    })

    response.cookies.set('session_token', newSession.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Change password error:', error)

    // Check if it's an auth error
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred while changing password' },
      { status: 500 }
    )
  }
}
