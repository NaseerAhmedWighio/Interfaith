import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, validateEmail, validatePassword, generateOTP, getOTPExpiry } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName } = body

    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
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

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password does not meet requirements', details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Generate email verification OTP
    const emailVerificationToken = generateOTP()
    const emailVerificationExpires = getOTPExpiry() // 15 minutes

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        emailVerificationToken,
        emailVerificationExpires,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        emailVerified: true,
        createdAt: true,
      },
    })

    // Send verification OTP email
    try {
      const { sendVerificationEmail } = await import('@/lib/email')
      await sendVerificationEmail(user.email, emailVerificationToken, fullName)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail registration if email fails - user can request resend
    }

    return NextResponse.json(
      {
        message: 'Registration successful. Please check your email for the verification code.',
        user,
        requiresVerification: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}
