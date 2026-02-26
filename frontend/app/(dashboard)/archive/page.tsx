'use client'

import { useState, useEffect } from 'react'
import { digestAPI, type DigestListItem } from '@/lib/api'
import { ArchiveRow } from '@/components/dashboard/ArchiveRow'

export default function ArchivePage() {
  const [digests, setDigests] = useState<DigestListItem[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    digestAPI.getAll()
      .then(res => setDigests(res.digests))
      .catch(() => setDigests([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = digests.filter(d => {
    if (filter === 'unread') return !d.is_read
    if (filter === 'read') return d.is_read
    return true
  })

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-textprimary mb-1">All Digests</h1>
      <p className="text-sm text-textmuted mb-6">12 weeks of AI intelligence</p>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6" role="group" aria-label="Filter digests">
        {(['all', 'unread', 'read'] as const).map(f => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f ? 'true' : 'false'}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              filter === f
                ? 'bg-gold text-navy'
                : 'bg-navylight text-textmuted border border-border hover:text-textprimary'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-textmuted">Loading…</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(d => (
            <ArchiveRow key={d.id} digest={d} />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-textmuted py-4">No {filter} digests.</p>
          )}
        </div>
      )}
    </div>
  )
}
