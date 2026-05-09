import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validatePassword, isTokenExpired } from '@/lib/auth'
import { deleteAllUserSessions } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Find user by reset token
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (isTokenExpired(user.passwordResetExpires)) {
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Hash new password
    const passwordHash = await hashPassword(password)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    })

    // Invalidate all existing sessions for security
    await deleteAllUserSessions(user.id)

    return NextResponse.json({
      message: 'Password reset successful. Please log in with your new password.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'An error occurred during password reset' },
      { status: 500 }
    )
  }
}
