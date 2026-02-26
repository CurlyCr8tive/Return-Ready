import Link from 'next/link'
import { Lock } from 'lucide-react'
import type { DigestListItem } from '@/lib/api'
import { WeekBadge } from '@/components/ui/WeekBadge'

interface ArchiveRowProps {
  digest: DigestListItem
  future?: boolean
}

export function ArchiveRow({ digest, future = false }: ArchiveRowProps) {
  if (future) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-navylight/50 px-4 py-3.5 opacity-40 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div>
          <WeekBadge weekNumber={digest.week_number} weekStart={digest.week_start} className="mb-0.5" />
          <p className="text-sm text-textmuted">{digest.week_start}</p>
        </div>
        <Lock size={14} className="text-textmuted" aria-hidden="true" />
      </div>
    )
  }

  return (
    <Link
      href={`/digest/${digest.id}`}
      className="group flex flex-col gap-2 rounded-lg border border-border bg-navylight px-4 py-3.5 transition hover:border-gold/30 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
    >
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3">
          <WeekBadge weekNumber={digest.week_number} weekStart={digest.week_start} />
          <span className="text-xs text-textmuted" aria-hidden="true">·</span>
          <p className="text-xs font-mono text-textmuted">{digest.week_start}</p>
          {!digest.is_read && (
            <span className="px-1.5 py-0.5 text-xs bg-gold/10 text-gold rounded font-mono">New</span>
          )}
        </div>
        <p className="line-clamp-2 pr-0 text-base text-textprimary sm:line-clamp-1 sm:pr-4">
          {digest.week_summary || 'No summary'}
        </p>
      </div>
      <div className="ml-0 flex w-full flex-shrink-0 items-center justify-between gap-3 sm:ml-4 sm:w-auto sm:justify-start">
        <span className="text-xs text-textmuted sm:whitespace-nowrap">{digest.external_source_count} sources</span>
        <span className="text-textmuted group-hover:text-gold transition text-sm" aria-hidden="true">→</span>
      </div>
    </Link>
  )
}
