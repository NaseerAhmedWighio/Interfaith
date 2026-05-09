import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/admin', '/profile']

const authRoutes = ['/login', '/register']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('session_token')?.value

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
}
