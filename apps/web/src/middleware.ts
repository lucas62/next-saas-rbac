import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next()

  if (pathname.startsWith('/org')) {
    const [, , slug] = pathname.split('/')

    if (!slug) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    response.cookies.set('org', slug)
  } else {
    if (request.cookies.has('org')) {
      response.cookies.delete('org')
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     * Ignore /api routes
     * _next/static and _next/image are static files and should not be matched
     * favicon.ico is a static file and should not be matched
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
