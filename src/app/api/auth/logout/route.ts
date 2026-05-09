import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie, deleteSession, clearSessionCookie } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const token = await getSessionCookie()

    if (token) {
      await deleteSession(token)
      await clearSessionCookie()
    }

    return NextResponse.json({ message: 'Logout successful' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}
