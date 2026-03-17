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
  const [slackToken, setSlackToken] = useState('')
  const [slackChannel, setSlackChannel] = useState('C06UJHN147J')
  const [slackStatus, setSlackStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [slackError, setSlackError] = useState<string | null>(null)

  useEffect(() => {
    settingsAPI.get()
      .then(res => {
        setSettings(res.settings)
        setContext(res.settings.pursuit_context || '')
        if (res.settings.slack_channel) setSlackChannel(res.settings.slack_channel)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const testAndConnectSlack = async () => {
    setSlackStatus('testing')
    setSlackError(null)
    try {
      const result = await settingsAPI.testSlack({ token: slackToken, channel_id: slackChannel })
      if (result.success) {
        setSlackStatus('success')
        setSettings(s => s ? { ...s, slack_connected: true, slack_channel: slackChannel } : s)
        setSlackToken('')
      } else {
        setSlackStatus('error')
        setSlackError(result.error || 'Connection failed')
      }
    } catch {
      setSlackStatus('error')
      setSlackError('Could not reach server')
    }
  }

  const disconnectSlack = async () => {
    await settingsAPI.update({ slack_connected: false, slack_token: '' })
    setSettings(s => s ? { ...s, slack_connected: false } : s)
    setSlackToken('')
    setSlackStatus('idle')
    setSlackError(null)
  }

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
    <div>
      <h1 className="font-display text-2xl font-bold text-textprimary mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── Left column ── */}
        <div className="space-y-8">

          {/* Data Sources */}
          <section>
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
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-textprimary">Slack · #ai channel</p>
                  <p className="text-xs text-textmuted mt-0.5">
                    {settings.slack_connected ? 'Connected' : 'Not connected — configure →'}
                  </p>
                </div>
                <Toggle
                  checked={settings.slack_connected}
                  onChange={(v) => { if (!v) disconnectSlack() }}
                  disabled={!settings.slack_connected}
                />
              </div>
            </div>
          </section>

          {/* Email Delivery */}
          <section>
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
                <Button variant="secondary" size="sm" onClick={sendTestEmail} disabled={sendingEmail}>
                  {sendingEmail ? 'Sending…' : 'Send Test Email'}
                </Button>
                {emailStatus && <p className="text-xs mt-2 text-textmuted">{emailStatus}</p>}
              </div>
            </div>
          </section>

          {/* Pursuit Context */}
          <section>
            <h2 className="text-xs font-mono text-gold uppercase tracking-widest mb-2">Pursuit Context</h2>
            <p className="text-xs text-textmuted mb-4">
              This informs the &ldquo;Why This Matters for Pursuit&rdquo; section of every digest.
            </p>
            <div className="bg-navylight border border-border rounded-xl p-5">
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={6}
                aria-label="Pursuit context — describes Pursuit's mission and priorities for the AI digest"
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
              <Button variant="secondary" size="sm" onClick={handleLogout}>Log Out</Button>
            </div>
          </section>

        </div>

        {/* ── Right column — Slack Integration ── */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xs font-mono text-gold uppercase tracking-widest mb-4">Slack Integration</h2>
            <div className="bg-navylight border border-border rounded-xl p-5 space-y-5">

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${settings.slack_connected ? 'bg-green-400' : 'bg-textmuted'}`} />
                <span className="text-sm text-textprimary font-medium">
                  {settings.slack_connected ? 'Connected to #ai' : 'Not connected'}
                </span>
              </div>

              {!settings.slack_connected && (
                <>
                  <p className="text-xs text-textmuted leading-relaxed">
                    Paste your Slack bot token and confirm the channel ID below. The token stays private to your profile and is never shared.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-textmuted mb-1.5">Bot Token</label>
                      <input
                        type="password"
                        value={slackToken}
                        onChange={(e) => setSlackToken(e.target.value)}
                        placeholder="xoxb-..."
                        className="w-full bg-navy border border-border rounded-lg px-3 py-2.5 text-sm text-textprimary placeholder:text-textmuted focus:outline-none focus:border-gold/60 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-textmuted mb-1.5">Channel ID</label>
                      <input
                        type="text"
                        value={slackChannel}
                        onChange={(e) => setSlackChannel(e.target.value)}
                        placeholder="C06UJHN147J"
                        className="w-full bg-navy border border-border rounded-lg px-3 py-2.5 text-sm text-textprimary placeholder:text-textmuted focus:outline-none focus:border-gold/60 transition"
                      />
                      <p className="text-xs text-textmuted mt-1">Pre-filled with the Pursuit #ai channel ID.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      onClick={testAndConnectSlack}
                      disabled={!slackToken || slackStatus === 'testing'}
                    >
                      {slackStatus === 'testing' ? 'Testing…' : 'Test & Connect'}
                    </Button>
                    {slackStatus === 'error' && (
                      <p className="text-xs text-red-400">{slackError}</p>
                    )}
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-medium text-textmuted mb-1">Before connecting</p>
                    <p className="text-xs text-textmuted leading-relaxed">
                      Make sure the Slack bot has been invited to the <span className="text-textprimary">#ai</span> channel. Ask Jac to generate a new bot token — the previous one-time secret link expired.
                    </p>
                  </div>
                </>
              )}

              {settings.slack_connected && (
                <>
                  <p className="text-xs text-textmuted leading-relaxed">
                    Slack highlights from <span className="text-textprimary">#ai</span> will be pulled into each weekly digest. The channel ID on file is <span className="text-textprimary font-mono">{settings.slack_channel}</span>.
                  </p>
                  {settings.slack_last_synced && (
                    <p className="text-xs text-textmuted">
                      Last synced: {new Date(settings.slack_last_synced).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                  <button
                    onClick={disconnectSlack}
                    className="text-xs text-textmuted hover:text-red-400 transition"
                  >
                    Disconnect
                  </button>
                </>
              )}

            </div>
          </section>
        </div>

      </div>
    </div>
  )
}
