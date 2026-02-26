'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import s from '../login/login.module.css'

export default function ResetPasswordPage() {
  const [checkingSession, setCheckingSession] = useState(true)
  const [hasRecoverySession, setHasRecoverySession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setHasRecoverySession(Boolean(data.session))
      setCheckingSession(false)
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setHasRecoverySession(true)
        setCheckingSession(false)
      }
    })

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotice(null)

    if (password.length < 8) {
      setNotice({ type: 'error', text: 'Password must be at least 8 characters.' })
      return
    }
    if (password !== confirmPassword) {
      setNotice({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setNotice({ type: 'error', text: error.message })
    } else {
      setPassword('')
      setConfirmPassword('')
      setNotice({ type: 'success', text: 'Password updated. You can now sign in.' })
    }
    setLoading(false)
  }

  return (
    <div className={s.page}>
      <div className={s.glowLeft} />
      <div className={s.glowRight} />
      <svg className={s.networkSvg} xmlns="http://www.w3.org/2000/svg">
        <line x1="5%" y1="15%" x2="22%" y2="38%" stroke="#14b8a6" strokeWidth="1" />
        <line x1="22%" y1="38%" x2="45%" y2="22%" stroke="#14b8a6" strokeWidth="1" />
        <line x1="45%" y1="22%" x2="68%" y2="42%" stroke="#14b8a6" strokeWidth="1" />
        <line x1="68%" y1="42%" x2="90%" y2="28%" stroke="#14b8a6" strokeWidth="0.8" />
        <circle cx="22%" cy="38%" r="4.5" fill="#14b8a6" />
        <circle cx="68%" cy="42%" r="5" fill="#14b8a6" />
      </svg>

      <div className={s.content}>
        <div className="mb-8 text-center">
          <div className={s.logoBox}>
            <span className={s.logoText}>CO</span>
          </div>
          <h1 className={s.title}>Reset Password</h1>
          <p className={s.subtitle}>Create a new secure password</p>
        </div>

        <div className={s.card}>
          {checkingSession ? (
            <p className={s.cardSub}>Checking reset link…</p>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {!hasRecoverySession ? (
                <p className={s.resetError}>
                  Recovery session not found. Request a new reset link from the login page.
                </p>
              ) : null}

              <div>
                <label className={s.label}>New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className={s.input}
                  disabled={!hasRecoverySession}
                />
              </div>
              <div>
                <label className={s.label}>Confirm new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className={s.input}
                  disabled={!hasRecoverySession}
                />
              </div>

              {notice ? (
                <p className={notice.type === 'success' ? s.resetSuccess : s.resetError}>
                  {notice.text}
                </p>
              ) : null}

              <button
                type="submit"
                className={s.submitBtn}
                disabled={loading || !hasRecoverySession || !password || !confirmPassword}
              >
                {loading ? 'Updating…' : 'Update Password'}
              </button>

              <p className={s.authHint}>
                <Link href="/login" className={s.inlineAction}>
                  Back to Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
