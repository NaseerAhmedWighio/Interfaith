import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateOTP, getOTPExpiry, validateRegistrationInput, sanitizeInput } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'

    const rateCheck = checkRateLimit(`register:${ip}`, 5, 60_000)
    if (!rateCheck.allowed) {
      const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000)
      return NextResponse.json(
        { error: `Too many registration attempts. Try again in ${retryAfter} seconds.` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    const body = await request.json()
    const email = typeof body.email === 'string' ? sanitizeInput(body.email) : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const fullName = typeof body.fullName === 'string' ? sanitizeInput(body.fullName) : ''

    const validation = validateRegistrationInput(email, password, fullName)
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const emailVerificationToken = generateOTP()
    const emailVerificationExpires = getOTPExpiry()

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

    try {
      const { sendVerificationEmail } = await import('@/lib/email')
      await sendVerificationEmail(user.email, emailVerificationToken, fullName)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
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
