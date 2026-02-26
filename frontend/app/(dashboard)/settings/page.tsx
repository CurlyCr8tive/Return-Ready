'use client'

import { useState, useEffect } from 'react'
import { settingsAPI, type Settings } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailStatus, setEmailStatus] = useState<string | null>(null)
  const [savedContext, setSavedContext] = useState(false)
  const [context, setContext] = useState('')

  useEffect(() => {
    settingsAPI.get()
      .then(res => {
        setSettings(res.settings)
        setContext(res.settings.pursuit_context || '')
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const updateSetting = async (key: keyof Settings, value: unknown) => {
    if (!settings) return
    const updated = { ...settings, [key]: value } as Settings
    setSettings(updated)
    try {
      await settingsAPI.update({ [key]: value })
    } catch (err) {
      console.error(err)
    }
  }

  const saveContext = async () => {
    setSaving(true)
    try {
      await settingsAPI.update({ pursuit_context: context })
      setSavedContext(true)
      setTimeout(() => setSavedContext(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const sendTestEmail = async () => {
    setSendingEmail(true)
    setEmailStatus(null)
    try {
      await settingsAPI.sendTestEmail()
      setEmailStatus('Email sent!')
    } catch {
      setEmailStatus('Send failed. Check email settings.')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p className="text-sm text-textmuted">Loading…</p>
  if (!settings) return <p className="text-sm text-red-400">Could not load settings.</p>

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-bold text-textprimary mb-8">Settings</h1>

      {/* Data Sources */}
      <section className="mb-8">
        <h2 className="text-xs font-mono text-gold uppercase tracking-widest mb-4">Data Sources</h2>
        <div className="bg-navylight border border-border rounded-xl divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-textprimary">External AI News</p>
              <p className="text-xs text-textmuted mt-0.5">Claude web search · runs Monday 6am</p>
            </div>
            <Toggle
              checked={settings.external_news_enabled}
              onChange={(v) => updateSetting('external_news_enabled', v)}
            />
          </div>
          <div className="flex items-center justify-between px-5 py-4 opacity-40">
            <div>
              <p className="text-sm font-medium text-textprimary">Slack · #ai channel</p>
              <p className="text-xs text-textmuted mt-0.5">Coming soon — Phase 2</p>
            </div>
            <Toggle checked={false} onChange={() => {}} disabled />
          </div>
        </div>
      </section>

      {/* Email Delivery */}
      <section className="mb-8">
        <h2 className="text-xs font-mono text-gold uppercase tracking-widest mb-4">Email Delivery</h2>
        <div className="bg-navylight border border-border rounded-xl divide-y divide-border">
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-textprimary">Weekly email</p>
              <p className="text-xs text-textmuted mt-0.5">Sends Monday at 8am</p>
            </div>
            <Toggle
              checked={settings.email_enabled}
              onChange={(v) => updateSetting('email_enabled', v)}
            />
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-textprimary">Send day</p>
            </div>
            <select
              aria-label="Email send day"
              value={settings.email_send_day}
              onChange={(e) => updateSetting('email_send_day', e.target.value)}
              className="bg-navy border border-border rounded-lg px-3 py-1.5 text-sm text-textprimary focus:outline-none focus:border-gold/60"
            >
              {['monday','tuesday','wednesday','thursday','friday'].map(d => (
                <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-sm font-medium text-textprimary">Send time</p>
            <input
              type="time"
              aria-label="Email send time"
              value={settings.email_send_time}
              onChange={(e) => updateSetting('email_send_time', e.target.value)}
              className="bg-navy border border-border rounded-lg px-3 py-1.5 text-sm text-textprimary focus:outline-none focus:border-gold/60"
            />
          </div>
          <div className="px-5 py-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={sendTestEmail}
              disabled={sendingEmail}
            >
              {sendingEmail ? 'Sending…' : 'Send Test Email'}
            </Button>
            {emailStatus && (
              <p className="text-xs mt-2 text-textmuted">{emailStatus}</p>
            )}
          </div>
        </div>
      </section>

      {/* Pursuit Context */}
      <section className="mb-8">
        <h2 className="text-xs font-mono text-gold uppercase tracking-widest mb-2">Pursuit Context</h2>
        <p className="text-xs text-textmuted mb-4">
          This informs the &ldquo;Why This Matters for Pursuit&rdquo; section of every digest.
        </p>
        <div className="bg-navylight border border-border rounded-xl p-5">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={6}
            className="w-full bg-navy border border-border rounded-lg px-4 py-3 text-sm text-textprimary placeholder:text-textmuted focus:outline-none focus:border-gold/60 resize-none transition"
            placeholder="Describe Pursuit's mission, programs, and what Joanna should prioritize..."
          />
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={saveContext} disabled={saving}>
              {saving ? 'Saving…' : savedContext ? 'Saved!' : 'Save Context'}
            </Button>
          </div>
        </div>
      </section>

      {/* Account */}
      <section>
        <h2 className="text-xs font-mono text-gold uppercase tracking-widest mb-4">Account</h2>
        <div className="bg-navylight border border-border rounded-xl px-5 py-4">
          <p className="text-sm font-medium text-textprimary">Joanna Patterson</p>
          <p className="text-xs text-textmuted mt-0.5 mb-4">joanna@pursuit.org</p>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </section>
    </div>
  )
}
