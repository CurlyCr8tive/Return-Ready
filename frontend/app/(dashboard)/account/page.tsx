'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'

function nameFromEmail(email: string) {
  const local = email.split('@')[0] || ''
  if (!local) return 'Account User'
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [initialName, setInitialName] = useState('')
  const [initialEmail, setInitialEmail] = useState('')
  const [lastSignIn, setLastSignIn] = useState<string | null>(null)

  const [savingProfile, setSavingProfile] = useState(false)
  const [profileStatus, setProfileStatus] = useState<string | null>(null)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null)

  const [sendingReset, setSendingReset] = useState(false)
  const [resetStatus, setResetStatus] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser()
      if (!mounted) return
      if (error || !data.user) {
        router.push('/login')
        return
      }

      const user = data.user
      const fullName =
        (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name) ||
        (typeof user.user_metadata?.name === 'string' && user.user_metadata.name) ||
        nameFromEmail(user.email || '')

      const nextEmail = user.email || ''
      setName(fullName)
      setEmail(nextEmail)
      setInitialName(fullName)
      setInitialEmail(nextEmail)
      setLastSignIn(
        user.last_sign_in_at
          ? new Date(user.last_sign_in_at).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })
          : null
      )
      setLoading(false)
    }

    loadUser()
    return () => {
      mounted = false
    }
  }, [router])

  const isProfileDirty = useMemo(
    () => name.trim() !== initialName.trim() || email.trim() !== initialEmail.trim(),
    [name, email, initialName, initialEmail]
  )

  const saveProfile = async () => {
    setProfileStatus(null)
    if (!isProfileDirty) {
      setProfileStatus('No changes to save.')
      return
    }

    setSavingProfile(true)
    try {
      const payload: {
        data?: { full_name: string; name: string }
        email?: string
      } = {}

      if (name.trim() !== initialName.trim()) {
        payload.data = { full_name: name.trim(), name: name.trim() }
      }

      if (email.trim() !== initialEmail.trim()) {
        payload.email = email.trim()
      }

      const { error } = await supabase.auth.updateUser(payload)
      if (error) {
        setProfileStatus(error.message)
        return
      }

      setInitialName(name.trim())
      setInitialEmail(email.trim())
      setProfileStatus(
        payload.email
          ? 'Profile updated. Confirm your new email from your inbox.'
          : 'Profile information updated.'
      )
    } finally {
      setSavingProfile(false)
    }
  }

  const changePassword = async () => {
    setPasswordStatus(null)
    if (newPassword.length < 8) {
      setPasswordStatus('Password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus('Passwords do not match.')
      return
    }

    setSavingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setPasswordStatus(error.message)
        return
      }
      setNewPassword('')
      setConfirmPassword('')
      setPasswordStatus('Password updated successfully.')
    } finally {
      setSavingPassword(false)
    }
  }

  const sendReset = async () => {
    setResetStatus(null)
    if (!email.trim()) {
      setResetStatus('No email found for this account.')
      return
    }

    setSendingReset(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) {
        setResetStatus(error.message)
        return
      }
      setResetStatus('Reset link sent. Check your inbox.')
    } finally {
      setSendingReset(false)
    }
  }

  if (loading) return <p className="text-sm text-textmuted">Loading account…</p>

  return (
    <div className="max-w-2xl">
      <h1 className="mb-1 font-display text-2xl font-bold text-textprimary">Account</h1>
      <p className="mb-8 text-sm text-textmuted">Manage your profile, login credentials, and account security.</p>

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-mono uppercase tracking-widest text-gold">Profile Information</h2>
        <div className="rounded-xl border border-border bg-navylight p-5">
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-mono text-textmuted">Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-navy px-3 py-2 text-sm text-textprimary focus:border-gold/60 focus:outline-none"
                autoComplete="name"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-mono text-textmuted">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-navy px-3 py-2 text-sm text-textprimary focus:border-gold/60 focus:outline-none"
                autoComplete="email"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={saveProfile} disabled={savingProfile}>
              {savingProfile ? 'Saving…' : 'Save Profile'}
            </Button>
            {profileStatus ? <p className="text-xs text-textmuted">{profileStatus}</p> : null}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xs font-mono uppercase tracking-widest text-gold">Password & Security</h2>
        <div className="rounded-xl border border-border bg-navylight p-5">
          <div className="mb-5 rounded-lg border border-border bg-navy/70 px-4 py-3">
            <p className="text-sm font-medium text-textprimary">Account activity</p>
            <p className="mt-1 text-xs text-textmuted">
              Last sign in: {lastSignIn || 'Not available'}
            </p>
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-mono text-textmuted">New password</span>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-navy px-3 py-2 text-sm text-textprimary focus:border-gold/60 focus:outline-none"
                autoComplete="new-password"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-mono text-textmuted">Confirm password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-navy px-3 py-2 text-sm text-textprimary focus:border-gold/60 focus:outline-none"
                autoComplete="new-password"
              />
            </label>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Button onClick={changePassword} disabled={savingPassword}>
              {savingPassword ? 'Updating…' : 'Change Password'}
            </Button>
            <Button variant="secondary" onClick={sendReset} disabled={sendingReset}>
              {sendingReset ? 'Sending…' : 'Send Reset Link'}
            </Button>
          </div>

          {passwordStatus ? <p className="mb-2 text-xs text-textmuted">{passwordStatus}</p> : null}
          {resetStatus ? <p className="text-xs text-textmuted">{resetStatus}</p> : null}
        </div>
      </section>
    </div>
  )
}
