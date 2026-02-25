// frontend/app/login/page.tsx
// Joanna's magic link login page
// Supabase sends a one-click sign-in email — no password needed.

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [mode, setMode] = useState<'magic' | 'password'>('magic')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSent(false)

    if (mode === 'password') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
      } else {
        window.location.href = '/dashboard'
      }
      setLoading(false)
      return
    }

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
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_15%_30%,rgba(30,213,214,0.18)_0%,transparent_34%),radial-gradient(circle_at_82%_76%,rgba(131,93,214,0.18)_0%,transparent_32%),linear-gradient(160deg,#040b17_0%,#02070f_70%,#01050d_100%)] px-4 py-10">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 1200 900"
        preserveAspectRatio="none"
      >
        <g stroke="#2cd6cf" strokeWidth="3" fill="none" opacity="0.28">
          <path d="M-20 300 L120 190 L270 260 L350 420 L210 540 L40 480 Z" />
          <path d="M270 260 L210 540" />
          <path d="M120 190 L350 420" />
          <path d="M830 350 L980 260 L1120 320 L1160 520 L1000 600 L860 510 Z" />
          <path d="M980 260 L1000 600" />
          <path d="M860 510 L1120 320" />
        </g>
        <g fill="#45dbd2" opacity="0.65">
          <circle cx="120" cy="190" r="9" />
          <circle cx="270" cy="260" r="9" />
          <circle cx="350" cy="420" r="9" />
          <circle cx="210" cy="540" r="9" />
          <circle cx="40" cy="480" r="9" />
          <circle cx="830" cy="350" r="9" />
          <circle cx="980" cy="260" r="9" />
          <circle cx="1120" cy="320" r="9" />
          <circle cx="1160" cy="520" r="9" />
          <circle cx="1000" cy="600" r="9" />
          <circle cx="860" cy="510" r="9" />
        </g>
      </svg>

      <div className="pointer-events-none absolute -left-20 top-52 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-32 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(160deg,#2b86e5_0%,#1f5fb4_100%)] shadow-[0_10px_24px_rgba(31,95,180,0.4)]">
            <span className="text-lg font-bold text-white">RR</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Return Ready</h1>
          <p className="mt-2 text-sm text-white/70">Dashboard Access</p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-[linear-gradient(150deg,rgba(41,113,202,0.9)_0%,rgba(28,83,156,0.9)_52%,rgba(19,57,112,0.92)_100%)] p-8 shadow-[0_24px_60px_rgba(8,24,52,0.5)] backdrop-blur-md">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                <svg className="h-6 w-6 text-cyan-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-2 text-lg font-semibold text-white">Check your email</h2>
              <p className="text-sm text-cyan-50/90">
                We sent a sign-in link to <span className="font-medium text-white">{email}</span>.
              </p>
            </div>
          ) : (
            <>
              <h2 className="mb-1 text-lg font-semibold text-white">Sign in</h2>
              <p className="mb-6 text-sm text-cyan-50/85">
                Use your email and password or request a magic link.
              </p>
              <div className="mb-5 grid grid-cols-2 rounded-lg border border-white/20 bg-[#0f2952]/45 p-1">
                <button
                  type="button"
                  onClick={() => setMode('magic')}
                  className={`rounded-md px-3 py-2 text-sm transition ${
                    mode === 'magic' ? 'bg-white/20 text-white' : 'text-cyan-100/80 hover:bg-white/10'
                  }`}
                >
                  Magic Link
                </button>
                <button
                  type="button"
                  onClick={() => setMode('password')}
                  className={`rounded-md px-3 py-2 text-sm transition ${
                    mode === 'password' ? 'bg-white/20 text-white' : 'text-cyan-100/80 hover:bg-white/10'
                  }`}
                >
                  Email + Password
                </button>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-cyan-50">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="joanna@pursuit.org"
                    required
                    className="w-full rounded-lg border border-cyan-100/25 bg-[#0f2952]/55 px-4 py-3 text-sm text-white placeholder:text-cyan-100/50 focus:outline-none focus:ring-2 focus:ring-cyan-200/45"
                  />
                </div>
                {mode === 'password' ? (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-cyan-50">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      required
                      className="w-full rounded-lg border border-cyan-100/25 bg-[#0f2952]/55 px-4 py-3 text-sm text-white placeholder:text-cyan-100/50 focus:outline-none focus:ring-2 focus:ring-cyan-200/45"
                    />
                  </div>
                ) : null}
                {error ? <p className="text-sm text-red-200">{error}</p> : null}
                <button
                  type="submit"
                  disabled={loading || !email || (mode === 'password' && !password)}
                  className="w-full rounded-lg bg-white/15 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
                >
                  {loading ? 'Please wait...' : mode === 'magic' ? 'Send sign-in link' : 'Sign in with password'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-white/55">
          Private platform for Joanna&apos;s team.
        </p>
      </div>
    </div>
  )
}
