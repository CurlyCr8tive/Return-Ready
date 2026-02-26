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
      <div className="rounded-xl border border-border bg-navylight p-4 sm:p-6 md:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <WeekBadge weekNumber={digest.week_number} weekStart={digest.week_start} showOverall />
          <span className="text-xs font-mono text-textmuted"> · {dateRange}</span>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-textprimary sm:mb-6 sm:text-base md:text-lg">
          {digest.week_summary || 'Digest generating…'}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-textmuted">
            <span>{digest.external_source_count} sources</span>
            {!digest.is_read && (
              <span className="px-2 py-0.5 bg-gold/10 text-gold rounded-full">New</span>
            )}
          </div>
          <Link
            href={`/digest/${digest.id}`}
            className="inline-flex min-h-[44px] items-center rounded-md px-2 text-sm font-medium text-gold transition hover:bg-gold/10 hover:text-gold/80"
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
      className="block rounded-lg border border-border bg-navylight p-3.5 transition hover:border-gold/30 sm:p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <WeekBadge weekNumber={digest.week_number} weekStart={digest.week_start} />
            <span className="text-xs font-mono text-textmuted"> · {digest.week_start}</span>
          </div>
          <p className="text-base text-textprimary line-clamp-2">
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
