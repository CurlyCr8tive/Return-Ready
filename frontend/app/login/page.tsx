// frontend/app/login/page.tsx
// Joanna's magic link login page
// Supabase sends a one-click sign-in email — no password needed.

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-lightgray flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-navy mb-4">
            <span className="text-white font-bold text-lg">RR</span>
          </div>
          <h1 className="text-2xl font-semibold text-navy">Return Ready</h1>
          <p className="text-gray text-sm mt-1">Dashboard Access</p>
        </div>

        <div className="bg-white rounded-xl shadow-card p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-navy mb-2">Check your email</h2>
              <p className="text-gray text-sm">
                We sent a sign-in link to <span className="font-medium text-navy">{email}</span>.
                Click the link to access your dashboard.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-navy mb-1">Sign in</h2>
              <p className="text-gray text-sm mb-6">
                Enter your email and we&apos;ll send you a sign-in link. No password needed.
              </p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="joanna@pursuit.org"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-medgray text-sm focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full py-3 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-blue transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send sign-in link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
