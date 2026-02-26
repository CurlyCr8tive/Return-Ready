import Link from 'next/link'
import type { DigestListItem } from '@/lib/api'
import { WeekBadge } from '@/components/ui/WeekBadge'

interface DigestCardProps {
  digest: DigestListItem
  hero?: boolean
}

export function DigestCard({ digest, hero = false }: DigestCardProps) {
  const dateRange = `${digest.week_start} – ${digest.week_end}`

  if (hero) {
    return (
      <div className="bg-navylight border border-border rounded-xl p-6 md:p-8">
        <div className="mb-3">
          <WeekBadge weekNumber={digest.week_number} showOverall />
          <span className="text-xs font-mono text-textmuted"> · {dateRange}</span>
        </div>
        <p className="text-textprimary text-base md:text-lg leading-relaxed mb-6">
          {digest.week_summary || 'Digest generating…'}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-textmuted font-mono">
            <span>{digest.external_source_count} sources</span>
            {!digest.is_read && (
              <span className="px-2 py-0.5 bg-gold/10 text-gold rounded-full">New</span>
            )}
          </div>
          <Link
            href={`/digest/${digest.id}`}
            className="text-sm font-medium text-gold hover:text-gold/80 transition"
          >
            Read Full Digest <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Link
      href={`/digest/${digest.id}`}
      className="block bg-navylight border border-border rounded-lg p-4 hover:border-gold/30 transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <WeekBadge weekNumber={digest.week_number} />
            <span className="text-xs font-mono text-textmuted"> · {digest.week_start}</span>
          </div>
          <p className="text-sm text-textprimary line-clamp-2">
            {digest.week_summary || 'No summary'}
          </p>
        </div>
        {!digest.is_read && (
          <span
            className="flex-shrink-0 w-2 h-2 rounded-full bg-gold mt-1.5"
            aria-label="Unread"
            role="status"
          />
        )}
      </div>
    </Link>
  )
}
