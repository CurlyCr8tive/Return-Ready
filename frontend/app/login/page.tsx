'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import s from './login.module.css'

type Mode = 'magic' | 'password'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('magic')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className={s.page}>
      {/* Glow blobs */}
      <div className={s.glowLeft} />
      <div className={s.glowRight} />

      {/* Network graph SVG background */}
      <svg className={s.networkSvg} xmlns="http://www.w3.org/2000/svg">
        <line x1="5%" y1="15%" x2="22%" y2="38%" stroke="#14b8a6" strokeWidth="1" />
        <line x1="22%" y1="38%" x2="45%" y2="22%" stroke="#14b8a6" strokeWidth="1" />
        <line x1="45%" y1="22%" x2="68%" y2="42%" stroke="#14b8a6" strokeWidth="1" />
        <line x1="68%" y1="42%" x2="90%" y2="28%" stroke="#14b8a6" strokeWidth="0.8" />
        <line x1="22%" y1="38%" x2="35%" y2="62%" stroke="#14b8a6" strokeWidth="0.8" />
        <line x1="35%" y1="62%" x2="55%" y2="75%" stroke="#14b8a6" strokeWidth="1" />
        <line x1="55%" y1="75%" x2="78%" y2="58%" stroke="#14b8a6" strokeWidth="0.8" />
        <line x1="78%" y1="58%" x2="90%" y2="28%" stroke="#14b8a6" strokeWidth="0.8" />
        <line x1="5%" y1="15%" x2="35%" y2="62%" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="4 6" />
        <line x1="45%" y1="22%" x2="55%" y2="75%" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="4 6" />
        <line x1="10%" y1="80%" x2="35%" y2="62%" stroke="#14b8a6" strokeWidth="0.8" />
        <line x1="10%" y1="80%" x2="22%" y2="38%" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="3 5" />
        <line x1="78%" y1="58%" x2="68%" y2="42%" stroke="#14b8a6" strokeWidth="1" />
        <line x1="55%" y1="75%" x2="68%" y2="42%" stroke="#14b8a6" strokeWidth="0.6" strokeDasharray="3 5" />
        <circle cx="5%" cy="15%" r="3.5" fill="#14b8a6" />
        <circle cx="22%" cy="38%" r="4.5" fill="#14b8a6" />
        <circle cx="45%" cy="22%" r="3" fill="#14b8a6" />
        <circle cx="68%" cy="42%" r="5" fill="#14b8a6" />
        <circle cx="90%" cy="28%" r="3" fill="#14b8a6" />
        <circle cx="35%" cy="62%" r="4" fill="#14b8a6" />
        <circle cx="55%" cy="75%" r="3.5" fill="#14b8a6" />
        <circle cx="78%" cy="58%" r="4" fill="#14b8a6" />
        <circle cx="10%" cy="80%" r="3" fill="#14b8a6" />
        <circle cx="22%" cy="38%" r="8" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.4" />
        <circle cx="68%" cy="42%" r="10" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.4" />
      </svg>

      {/* Content */}
      <div className={s.content}>

        {/* Logo + Wordmark */}
        <div className="text-center mb-8">
          <div className={s.logoBox}>
            <span className={s.logoText}>CO</span>
          </div>
          <h1 className={s.title}>Connection OS</h1>
          <p className={s.subtitle}>Dashboard Access</p>
        </div>

        {/* Card */}
        <div className={s.card}>
          <div className="mb-6">
            <h2 className={s.cardTitle}>Sign in</h2>
            <p className={s.cardSub}>
              {mode === 'password'
                ? 'Tester access · Connection OS'
                : 'Private dashboard for Joanna Patterson'}
            </p>
          </div>

          {/* Mode tabs */}
          <div className={s.tabs}>
            <button
              type="button"
              onClick={() => { setMode('magic'); setError(''); setSent(false) }}
              className={`${s.tab} ${mode === 'magic' ? s.tabActive : ''}`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => { setMode('password'); setError(''); setSent(false) }}
              className={`${s.tab} ${mode === 'password' ? s.tabActive : ''}`}
            >
              Password
            </button>
          </div>

          {/* Magic link — success state */}
          {mode === 'magic' && sent ? (
            <div className="text-center py-2">
              <div className={s.successIcon}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className={s.successTitle}>Check your email</h2>
              <p className={s.successText}>
                We sent a sign-in link to{' '}
                <span className={s.successEmail}>{email}</span>
              </p>
              <button type="button" onClick={() => setSent(false)} className={s.backBtn}>
                ← Use a different email
              </button>
            </div>

          ) : mode === 'magic' ? (
            /* Magic link form */
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className={s.label}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joanna@pursuit.org"
                  required
                  className={s.input}
                />
              </div>
              {error && <p className={s.error}>{error}</p>}
              <button type="submit" disabled={loading || !email} className={s.submitBtn}>
                {loading ? 'Sending…' : 'Send Magic Link'}
              </button>
            </form>

          ) : (
            /* Password form */
            <form onSubmit={handlePassword} className="space-y-4">
              <div>
                <label className={s.label}>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tester@pursuit.org"
                  required
                  className={s.input}
                />
              </div>
              <div>
                <label className={s.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={s.input}
                />
              </div>
              {error && <p className={s.error}>{error}</p>}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className={s.submitBtn}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
