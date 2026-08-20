import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthed = !!req.auth

  // Always reachable, regardless of sign-in state: NextAuth's own routes and
  // the one-time account-creation API.
  if (pathname.startsWith('/api/auth') || pathname === '/api/setup') return

  const isPublicPage = pathname === '/login' || pathname === '/setup'

  // Don't show the sign-in/setup pages to someone who's already signed in.
  if (isAuthed && isPublicPage) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }

  if (!isAuthed && !isPublicPage) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = new URL('/login', req.nextUrl)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
