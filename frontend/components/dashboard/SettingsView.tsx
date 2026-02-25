'use client'

import { FormEvent, useEffect, useState } from 'react'
import { dashboardAPI, settingsAPI } from '@/lib/api'

export function SettingsView() {
  const [documents, setDocuments] = useState<Array<Record<string, unknown>>>([])
  const [managementEnabled, setManagementEnabled] = useState(false)
  const [form, setForm] = useState({
    owner_name: '',
    source_type: 'google_docs',
    doc_type: 'kpi_doc',
    doc_id: '',
    title: '',
  })

  const load = async () => {
    const [docsRes, mgmtRes] = await Promise.all([
      settingsAPI.listDocuments(),
      settingsAPI.getManagement(),
    ])
    setDocuments(docsRes.documents)
    setManagementEnabled(mgmtRes.management_tier_enabled)
  }

  useEffect(() => {
    load()
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await settingsAPI.upsertDocument({ ...form, active: true, management_tier: false })
    setForm({ owner_name: '', source_type: 'google_docs', doc_type: 'kpi_doc', doc_id: '', title: '' })
    await load()
  }

  const triggerPull = async () => {
    await dashboardAPI.runDataPull()
  }

  const toggleManagement = async () => {
    const next = !managementEnabled
    await settingsAPI.toggleManagement(next)
    setManagementEnabled(next)
  }

  return (
    <section className="space-y-6 text-slate-100">
      <div>
        <h2 className="text-3xl font-semibold text-white">Settings</h2>
        <p className="mt-2 text-sm text-slate-300">Manage connected team docs and optional management tier setup.</p>
      </div>

      <div className="rounded-2xl border border-white/15 bg-[#12364c] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white">Management Tier</p>
            <p className="text-xs text-slate-300">Optional Google OAuth layer for Joanna management docs.</p>
          </div>
          <button className="rounded-lg bg-cyan-300/25 px-3 py-2 text-sm" onClick={toggleManagement}>
            {managementEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/15 bg-[#12364c] p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-white">Connected Documents</p>
          <button className="rounded-lg bg-cyan-300/25 px-3 py-2 text-sm" onClick={triggerPull}>
            Run Weekly Pull Now
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-2 md:grid-cols-5">
          <input
            value={form.owner_name}
            onChange={(e) => setForm((p) => ({ ...p, owner_name: e.target.value }))}
            placeholder="Owner"
            className="rounded-lg border border-white/20 bg-[#0f3145] px-3 py-2 text-sm"
            required
          />
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Title"
            className="rounded-lg border border-white/20 bg-[#0f3145] px-3 py-2 text-sm"
            required
          />
          <input
            value={form.doc_id}
            onChange={(e) => setForm((p) => ({ ...p, doc_id: e.target.value }))}
            placeholder="Google Doc/Sheet ID"
            className="rounded-lg border border-white/20 bg-[#0f3145] px-3 py-2 text-sm"
            required
          />
          <select
            value={form.source_type}
            onChange={(e) => setForm((p) => ({ ...p, source_type: e.target.value }))}
            className="rounded-lg border border-white/20 bg-[#0f3145] px-3 py-2 text-sm"
          >
            <option value="google_docs">Google Doc</option>
            <option value="google_sheets">Google Sheet</option>
          </select>
          <button type="submit" className="rounded-lg bg-cyan-300/25 px-3 py-2 text-sm">
            Save
          </button>
        </form>

        <div className="mt-4 space-y-2">
          {documents.map((doc, idx) => (
            <div key={idx} className="rounded-lg border border-white/10 bg-[#0f3145] px-3 py-2 text-xs text-slate-100">
              {String(doc.owner_name ?? 'Unknown')} | {String(doc.title ?? 'Untitled')} | {String(doc.source_type ?? '')}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
