'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-gold tracking-wide">
            Connection OS
          </h1>
          <p className="mt-2 text-sm text-textmuted font-mono">
            Your weekly AI intelligence briefing
          </p>
        </div>

        {/* Card */}
        <div className="bg-navylight border border-border rounded-xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-textprimary mb-2">Check your email</h2>
              <p className="text-sm text-textmuted">
                We sent a sign-in link to{' '}
                <span className="text-textprimary font-medium">{email}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-textprimary mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joanna@pursuit.org"
                  required
                  className="w-full bg-navy border border-border rounded-lg px-4 py-3 text-sm text-textprimary placeholder:text-textmuted focus:outline-none focus:border-gold/60 transition"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gold text-navy font-semibold text-sm py-3 rounded-lg hover:bg-gold/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-textmuted">
          Private dashboard for Joanna Patterson
        </p>
      </div>
    </div>
  )
}
