'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import s from './login.module.css'

type Mode = 'magic' | 'password' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('magic')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [signupNotice, setSignupNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetNotice, setResetNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSignupNotice(null)

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
    setResetNotice(null)
    setSignupNotice(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  const handleCreateLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSignupNotice(null)
    setResetNotice(null)

    if (password.length < 8) {
      setSignupNotice({ type: 'error', text: 'Password must be at least 8 characters.' })
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setSignupNotice({ type: 'error', text: 'Passwords do not match.' })
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          name: fullName.trim(),
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setSignupNotice({ type: 'error', text: error.message })
      setLoading(false)
      return
    }

    if (data.session) {
      router.push('/')
      return
    }

    setSignupNotice({
      type: 'success',
      text: 'Account created. Check your email to confirm, then sign in.',
    })
    setLoading(false)
  }

  const handleForgotPassword = async () => {
    setError('')
    setResetNotice(null)
    setSignupNotice(null)

    if (!email.trim()) {
      setResetNotice({
        type: 'error',
        text: 'Enter your email address above first.',
      })
      return
    }

    setResetLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setResetNotice({ type: 'error', text: error.message })
    } else {
      setResetNotice({
        type: 'success',
        text: 'Password reset link sent. Check your email.',
      })
    }
    setResetLoading(false)
  }

  return (
    <div className={s.page}>
      {/* Glow blobs */}
      <div className={s.glowLeft} />
      <div className={s.glowRight} />

      {/* Network graph SVG background */}
      <svg className={s.networkSvg} xmlns="http://www.w3.org/2000/svg">
        <g className={s.networkLeftGroup}>
          <line x1="5%" y1="15%" x2="22%" y2="38%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="22%" y1="38%" x2="45%" y2="22%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="22%" y1="38%" x2="35%" y2="62%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="5%" y1="15%" x2="35%" y2="62%" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="10%" y1="80%" x2="35%" y2="62%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="10%" y1="80%" x2="22%" y2="38%" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="3 5" />
          <circle cx="5%" cy="15%" r="3.5" fill="#14b8a6" />
          <circle cx="22%" cy="38%" r="4.5" fill="#14b8a6" />
          <circle cx="45%" cy="22%" r="3" fill="#14b8a6" />
          <circle cx="35%" cy="62%" r="4" fill="#14b8a6" />
          <circle cx="10%" cy="80%" r="3" fill="#14b8a6" />
          <circle cx="22%" cy="38%" r="8" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.4" />
        </g>
        <g className={s.networkRightGroup}>
          <line x1="45%" y1="22%" x2="68%" y2="42%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="68%" y1="42%" x2="90%" y2="28%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="35%" y1="62%" x2="55%" y2="75%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="55%" y1="75%" x2="78%" y2="58%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="78%" y1="58%" x2="90%" y2="28%" stroke="#14b8a6" strokeWidth="0.8" />
          <line x1="45%" y1="22%" x2="55%" y2="75%" stroke="#14b8a6" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="78%" y1="58%" x2="68%" y2="42%" stroke="#14b8a6" strokeWidth="1" />
          <line x1="55%" y1="75%" x2="68%" y2="42%" stroke="#14b8a6" strokeWidth="0.6" strokeDasharray="3 5" />
          <circle cx="68%" cy="42%" r="5" fill="#14b8a6" />
          <circle cx="90%" cy="28%" r="3" fill="#14b8a6" />
          <circle cx="55%" cy="75%" r="3.5" fill="#14b8a6" />
          <circle cx="78%" cy="58%" r="4" fill="#14b8a6" />
          <circle cx="68%" cy="42%" r="10" fill="none" stroke="#14b8a6" strokeWidth="0.5" opacity="0.4" />
        </g>
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
            <h2 className={s.cardTitle}>{mode === 'signup' ? 'Create Login' : 'Sign in'}</h2>
            <p className={s.cardSub}>
              {mode === 'password'
                ? 'Use your existing email and password'
                : mode === 'signup'
                  ? 'Create a secure account for dashboard access'
                  : 'Private dashboard for Joanna Patterson'}
            </p>
          </div>

          {/* Mode tabs */}
          <div className={s.tabs}>
            <button
              type="button"
              onClick={() => { setMode('magic'); setError(''); setSent(false); setResetNotice(null); setSignupNotice(null) }}
              className={`${s.tab} ${mode === 'magic' ? s.tabActive : ''}`}
            >
              Magic Link
            </button>
            <button
              type="button"
              onClick={() => { setMode('password'); setError(''); setSent(false); setResetNotice(null); setSignupNotice(null) }}
              className={`${s.tab} ${mode === 'password' ? s.tabActive : ''}`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); setSent(false); setResetNotice(null); setSignupNotice(null) }}
              className={`${s.tab} ${mode === 'signup' ? s.tabActive : ''}`}
            >
              Create Login
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

          ) : mode === 'password' ? (
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

              <div className={s.passwordAssist}>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading || resetLoading}
                  className={s.forgotBtn}
                >
                  {resetLoading ? 'Sending reset link…' : 'Forgot password?'}
                </button>
                {resetNotice ? (
                  <p
                    className={`${s.resetNote} ${
                      resetNotice.type === 'success' ? s.resetSuccess : s.resetError
                    }`}
                  >
                    {resetNotice.text}
                  </p>
                ) : null}
                <p className={s.authHint}>
                  Need an account?{' '}
                  <button
                    type="button"
                    className={s.inlineAction}
                    onClick={() => { setMode('signup'); setError(''); setResetNotice(null); setSignupNotice(null) }}
                  >
                    Create Login
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* Create login form */
            <form onSubmit={handleCreateLogin} className="space-y-4">
              <div>
                <label className={s.label}>Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Joanna Patterson"
                  required
                  className={s.input}
                />
              </div>
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
              <div>
                <label className={s.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className={s.input}
                />
              </div>
              <div>
                <label className={s.label}>Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className={s.input}
                />
              </div>

              {signupNotice ? (
                <p className={signupNotice.type === 'success' ? s.resetSuccess : s.resetError}>
                  {signupNotice.text}
                </p>
              ) : null}

              {error && <p className={s.error}>{error}</p>}
              <button
                type="submit"
                disabled={loading || !fullName || !email || !password || !confirmPassword}
                className={s.submitBtn}
              >
                {loading ? 'Creating account…' : 'Create Login'}
              </button>

              <p className={s.authHint}>
                Already have an account?{' '}
                <button
                  type="button"
                  className={s.inlineAction}
                  onClick={() => { setMode('password'); setError(''); setResetNotice(null); setSignupNotice(null) }}
                >
                  Sign in with password
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
