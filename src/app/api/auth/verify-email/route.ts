import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isTokenExpired } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, otp } = body

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Find user by email and OTP
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        emailVerificationToken: otp,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid OTP code' },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (isTokenExpired(user.emailVerificationExpires)) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Update user - mark email as verified and clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    })

    return NextResponse.json({
      message: 'Email verified successfully. You can now log in.',
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred during email verification' },
      { status: 500 }
    )
  }
}
