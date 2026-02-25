import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const JOANNA_EMAIL = process.env.JOANNA_EMAIL ?? ''

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const email = data.user.email ?? ''
      const destination = email === JOANNA_EMAIL ? '/dashboard' : '/staff'
      return NextResponse.redirect(new URL(destination, requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/staff', requestUrl.origin))
}
