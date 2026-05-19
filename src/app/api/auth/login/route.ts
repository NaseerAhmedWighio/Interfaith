import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, validateLoginInput, sanitizeInput } from '@/lib/auth'
import { createSession, setSessionCookie } from '@/lib/session'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'

    const rateCheck = checkRateLimit(`login:${ip}`, 5, 60_000)
    if (!rateCheck.allowed) {
      const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000)
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${retryAfter} seconds.` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    const body = await request.json()
    const email = typeof body.email === 'string' ? sanitizeInput(body.email) : ''
    const password = typeof body.password === 'string' ? body.password : ''

    const validation = validateLoginInput(email, password)
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      )
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before logging in.' },
        { status: 403 }
      )
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    const session = await createSession(user.id, ipAddress, userAgent)
    await setSessionCookie(session.token)

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
