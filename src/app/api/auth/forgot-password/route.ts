import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken, getTokenExpiry } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with this email, a password reset link has been sent.',
      })
    }

    // Generate password reset token
    const passwordResetToken = generateToken()
    const passwordResetExpires = getTokenExpiry(1) // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    })

    // Send password reset email
    try {
      const { sendPasswordResetEmail } = await import('@/lib/email')
      await sendPasswordResetEmail(user.email, passwordResetToken, user.fullName)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Still return success to prevent email enumeration
    }

    return NextResponse.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
