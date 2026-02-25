'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { settingsAPI } from '@/lib/api'
import { mockDocuments } from '@/lib/mock-data'

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
    try {
      const [docsRes, mgmtRes] = await Promise.all([
        settingsAPI.listDocuments(),
        settingsAPI.getManagement(),
      ])
      setDocuments(docsRes.documents.length ? docsRes.documents : mockDocuments)
      setManagementEnabled(mgmtRes.management_tier_enabled)
    } catch {
      setDocuments(mockDocuments)
      setManagementEnabled(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setForm({ owner_name: '', source_type: 'google_docs', doc_type: 'kpi_doc', doc_id: '', title: '' })
  }

  return (
    <section className="space-y-6 text-slate-100">
      <div>
        <h2 className="text-3xl font-semibold text-white">Settings</h2>
        <p className="mt-2 text-sm text-slate-300">Manage connected team docs and optional management tier setup.</p>
      </div>

      <div className="dashboard-card rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-white">Management Tier</p>
            <p className="text-xs text-slate-300">Optional Google OAuth layer for Joanna management docs.</p>
          </div>
          <Link href="/dashboard/settings/mock-management" className="dashboard-button rounded-lg px-3 py-2 text-sm">
            {managementEnabled ? 'Disable' : 'Enable'}
          </Link>
        </div>
      </div>

      <div className="dashboard-card rounded-2xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-white">Connected Documents</p>
          <Link href="/dashboard/settings/mock-pull" className="dashboard-button rounded-lg px-3 py-2 text-sm">
            Run Weekly Pull Now
          </Link>
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
          <Link href="/dashboard/settings/mock-save" className="dashboard-button rounded-lg px-3 py-2 text-center text-sm">
            Save
          </Link>
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
