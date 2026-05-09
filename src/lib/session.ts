import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { generateSessionToken, getSessionExpiry } from './auth'

const SESSION_COOKIE_NAME = 'session_token'
const SESSION_EXPIRY_DAYS = 7

export interface SessionUser {
  id: string
  email: string
  fullName: string
  role: string
  emailVerified: boolean
  profileImage?: string
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const token = generateSessionToken()
  const expiresAt = getSessionExpiry(SESSION_EXPIRY_DAYS)

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    },
  })

  // Update last login
  await prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  })

  return session
}

/**
 * Get session by token
 */
export async function getSession(token: string) {
  if (!token) {
    return null
  }

  try {
    // First, try to find the session without include
    const session = await prisma.session.findUnique({
      where: { token },
    })

    if (!session) {
      return null
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      await deleteSession(token)
      return null
    }

    // Then fetch the user separately
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        emailVerified: true,
        isActive: true,
        profileImage: true,
      },
    })

    if (!user) {
      return null
    }

    // Check if user is active
    if (!user.isActive) {
      return null
    }

    return {
      ...session,
      user,
    }
  } catch (error) {
    console.error('Error getting session:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      token: token ? token.substring(0, 10) + '...' : 'missing',
    })
    return null
  }
}

/**
 * Delete a session
 */
export async function deleteSession(token: string) {
  try {
    await prisma.session.delete({
      where: { token },
    })
  } catch (error) {
    console.error('Error deleting session:', error)
  }
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: string) {
  try {
    await prisma.session.deleteMany({
      where: { userId },
    })
  } catch (error) {
    console.error('Error deleting user sessions:', error)
  }
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60, // 7 days in seconds
    path: '/',
  })
}

/**
 * Get session cookie
 */
export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const token = await getSessionCookie()
    if (!token) {
      return null
    }

    const session = await getSession(token)
    if (!session) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      fullName: session.user.fullName,
      role: session.user.role ?? 'user',
      emailVerified: session.user.emailVerified ?? false,
      profileImage: session.user.profileImage ?? undefined,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

/**
 * Clean up expired sessions (should be run periodically)
 */
export async function cleanExpiredSessions() {
  try {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })
  } catch (error) {
    console.error('Error cleaning expired sessions:', error)
  }
}
