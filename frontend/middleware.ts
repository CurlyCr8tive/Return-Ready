// frontend/middleware.ts
// Route protection middleware for Return Ready (Joanna private dashboard)
// - /dashboard/* requires authenticated Supabase session.

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getAllowedEmails(): string[] {
  const raw = process.env.DASHBOARD_ALLOWED_EMAILS || ''
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Protect Joanna's dashboard
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname.startsWith('/dashboard') && session) {
    const allowedEmails = getAllowedEmails()
    if (allowedEmails.length > 0) {
      const userEmail = (session.user.email || '').toLowerCase()
      if (!allowedEmails.includes(userEmail)) {
        const url = new URL('/login', req.url)
        url.searchParams.set('error', 'not_allowed')
        return NextResponse.redirect(url)
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
