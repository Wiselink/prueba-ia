import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('token')?.value
    try {
      if (!token) throw new Error('no token')
      jwt.verify(token, process.env.JWT_SECRET!)
      return NextResponse.next()
    } catch (e) {
      return NextResponse.redirect(new URL('/api/unauthorized', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
