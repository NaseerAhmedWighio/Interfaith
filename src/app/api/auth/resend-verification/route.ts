import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOTP, getOTPExpiry, validateEmail } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account exists with this email, a verification code has been sent.' },
        { status: 200 }
      )
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email is already verified. You can log in.' },
        { status: 400 }
      )
    }

    // Generate new verification OTP
    const emailVerificationToken = generateOTP()
    const emailVerificationExpires = getOTPExpiry() // 15 minutes

    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken,
        emailVerificationExpires,
      },
    })

    // Send verification email
    try {
      await sendVerificationEmail(user.email, emailVerificationToken, user.fullName)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Verification code sent successfully. Please check your inbox.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred while sending verification code' },
      { status: 500 }
    )
  }
}
