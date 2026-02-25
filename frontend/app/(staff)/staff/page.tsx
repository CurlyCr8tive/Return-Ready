// frontend/app/(staff)/page.tsx
// Staff portal landing — Google OAuth login if not authenticated,
// personalized landing with form status + bot link if authenticated.

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const CURRENT_MONTH = 'march' // update each month or pull from config

export default function StaffLandingPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [oauthLoading, setOauthLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleGoogleLogin = async () => {
    setOauthLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not authenticated — show Google login
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-navy mb-3">Welcome to Return Ready</h1>
          <p className="text-gray text-base max-w-md">
            Joanna is on parental leave. Sign in with your Gmail to submit your monthly update
            and ask the Joanna Bot questions.
          </p>
        </div>
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={oauthLoading}
          className="inline-flex items-center gap-3 px-6 py-3.5 bg-white border border-medgray rounded-xl text-sm font-semibold text-gray-700 hover:bg-lightgray transition-colors shadow-card disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {oauthLoading ? 'Redirecting...' : 'Continue with Gmail'}
        </button>
      </div>
    )
  }

  // Authenticated — show personalized landing
  const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'there'
  const monthDisplay = CURRENT_MONTH.charAt(0).toUpperCase() + CURRENT_MONTH.slice(1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-navy">Hi, {firstName}</h1>
          <p className="text-gray text-sm mt-1">Joanna appreciates your updates while she&apos;s out.</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-gray hover:text-navy transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Monthly Form Card */}
      <div className="bg-white rounded-xl shadow-card border border-medgray p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-blue uppercase tracking-wide mb-1">{monthDisplay} Update</p>
            <h2 className="text-lg font-semibold text-navy mb-2">Submit Your Monthly Update</h2>
            <p className="text-gray text-sm max-w-md">
              Share what happened this month — decisions, risks, wins, and what Joanna needs to know for her first week back.
              Takes about 5 minutes.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <Link
            href={`/staff/form?month=${CURRENT_MONTH}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-blue transition-colors"
          >
            Submit {monthDisplay} Update →
          </Link>
        </div>
      </div>

      {/* Team Bot Card */}
      <div className="bg-white rounded-xl shadow-card border border-medgray p-6">
        <div>
          <p className="text-xs font-medium text-accent uppercase tracking-wide mb-1">Always Available</p>
          <h2 className="text-lg font-semibold text-navy mb-2">Ask the Joanna Bot</h2>
          <p className="text-gray text-sm max-w-md">
            Have an operational question? The Joanna Bot answers from her leave handoff document —
            in her voice, with specific guidance.
          </p>
        </div>
        <div className="mt-5">
          <Link
            href="/staff/bot"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-navy text-navy rounded-lg text-sm font-semibold hover:bg-lightblue transition-colors"
          >
            Ask the Joanna Bot →
          </Link>
        </div>
      </div>
    </div>
  )
}
