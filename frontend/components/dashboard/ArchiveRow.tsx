import Link from 'next/link'
import { Lock } from 'lucide-react'
import type { DigestListItem } from '@/lib/api'

interface ArchiveRowProps {
  digest: DigestListItem
  future?: boolean
}

export function ArchiveRow({ digest, future = false }: ArchiveRowProps) {
  if (future) {
    return (
      <div className="flex items-center justify-between px-5 py-4 bg-navylight/50 border border-border rounded-lg opacity-40">
        <div>
          <p className="text-xs font-mono text-textmuted mb-0.5">Week {digest.week_number}</p>
          <p className="text-sm text-textmuted">{digest.week_start}</p>
        </div>
        <Lock size={14} className="text-textmuted" />
      </div>
    )
  }

  return (
    <Link
      href={`/digest/${digest.id}`}
      className="flex items-center justify-between px-5 py-4 bg-navylight border border-border rounded-lg hover:border-gold/30 transition group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <p className="text-xs font-mono text-textmuted">Week {digest.week_number}</p>
          <span className="text-xs text-textmuted">·</span>
          <p className="text-xs font-mono text-textmuted">{digest.week_start}</p>
          {!digest.is_read && (
            <span className="px-1.5 py-0.5 text-xs bg-gold/10 text-gold rounded font-mono">New</span>
          )}
        </div>
        <p className="text-sm text-textprimary line-clamp-1 pr-4">
          {digest.week_summary || 'No summary'}
        </p>
      </div>
      <div className="flex-shrink-0 flex items-center gap-3 ml-4">
        <span className="text-xs text-textmuted">{digest.external_source_count} sources</span>
        <span className="text-textmuted group-hover:text-gold transition text-sm">→</span>
      </div>
    </Link>
  )
}
