import type { Digest } from '@/lib/api'

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: 'text-red-400',
  MEDIUM: 'text-yellow-400',
  WATCH: 'text-blue-400',
}

function normalizeSlackItems(data: Digest['slack_highlights']): string[] {
  if (!data) return []

  if (Array.isArray(data)) {
    return data.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
  }

  if (data.placeholder) return []

  return [
    ...(Array.isArray(data.items) ? data.items : []),
    ...(typeof data.message === 'string' ? [data.message] : []),
  ].filter((value) => value && !/coming soon/i.test(value))
}

export function DevelopmentsSection({ items }: { items: Digest['ai_developments'] }) {
  return (
    <section>
      <h2 className="mb-4 border-b border-border pb-3 text-xs font-mono font-semibold uppercase tracking-widest text-gold sm:mb-5">
        What Happened in AI This Week
      </h2>
      <div className="space-y-5 sm:space-y-6">
        {items.map((dev, i) => (
          <div key={i} className="border-b border-border pb-5 last:border-0 last:pb-0 sm:pb-6">
            <span className="text-xs font-mono text-textmuted" aria-hidden="true">{i + 1}</span>
            <h3 className="mt-1 mb-2 font-display text-lg font-semibold leading-snug text-textprimary sm:text-xl">
              {dev.headline}
            </h3>
            <p className="mb-2 text-base leading-relaxed text-textmuted">{dev.synthesis}</p>
            <p className="mb-3 text-base leading-relaxed text-textprimary/85">{dev.why_it_matters}</p>
            {dev.url ? (
              <a
                href={dev.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${dev.source} (opens in new tab)`}
                className="inline-flex min-h-[40px] items-center -ml-2 rounded-md px-2 text-xs text-gold transition hover:bg-gold/10 hover:underline"
              >
                {dev.source}
              </a>
            ) : (
              <span className="text-xs text-textmuted">{dev.source}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export function SlackSection({ data }: { data: Digest['slack_highlights'] }) {
  const items = normalizeSlackItems(data)
  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 border-b border-border pb-3 text-xs font-mono font-semibold uppercase tracking-widest text-gold sm:mb-5">
        What the Pursuit Team Is Discussing
      </h2>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="mt-1 text-gold" aria-hidden="true">•</span>
            <p className="text-base leading-relaxed text-textmuted">{item}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ImplicationsSection({ items }: { items: Digest['pursuit_implications'] }) {
  return (
    <section className="rounded-xl border border-gold/20 bg-gold/5 p-4 sm:p-5 md:p-6">
      <h2 className="mb-4 text-xs font-mono font-semibold uppercase tracking-widest text-gold sm:mb-5">
        Why This Matters for Pursuit
      </h2>
      <div className="space-y-5">
        {items.map((imp, i) => (
          <div key={i} className="border-l-2 border-gold pl-4">
            <span className={`mb-1 block text-xs font-mono font-semibold ${PRIORITY_COLORS[imp.priority] ?? 'text-textmuted'}`}>
              {imp.priority}
            </span>
            <p className="mb-1 text-base font-medium leading-snug text-textprimary sm:text-lg">{imp.implication}</p>
            <p className="text-sm leading-relaxed text-textmuted sm:text-base">{imp.reasoning}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function CompaniesSection({ items }: { items: Digest['companies_to_watch'] }) {
  return (
    <section>
      <h2 className="mb-4 border-b border-border pb-3 text-xs font-mono font-semibold uppercase tracking-widest text-gold sm:mb-5">
        Companies to Watch
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {items.map((co, i) => {
          const inner = (
            <>
              <div className="mb-1 flex items-start justify-between gap-2">
                <p className="text-base font-semibold leading-snug text-textprimary">{co.name}</p>
                {co.url && (
                  <span className="mt-0.5 flex-shrink-0 text-xs text-gold opacity-60 transition group-hover:opacity-100" aria-hidden="true">↗</span>
                )}
              </div>
              {co.industry && (
                <span className="mb-2 inline-block rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-xs font-medium text-teal-400">
                  {co.industry}
                </span>
              )}
              <p className="mb-2 text-sm text-textmuted">{co.what_they_do}</p>
              <p className="text-sm font-medium text-gold">{co.why_watch_now}</p>
            </>
          )

          return co.url ? (
            <a
              key={i}
              href={co.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${co.name} — ${co.what_they_do} (opens in new tab)`}
              className="group block rounded-lg border border-border bg-navylight p-3.5 transition hover:border-gold/40 sm:p-4"
            >
              {inner}
            </a>
          ) : (
            <div key={i} className="rounded-lg border border-border bg-navylight p-3.5 sm:p-4">
              {inner}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function JobsSection({ data }: { data: Digest['jobs_and_hiring'] }) {
  return (
    <section>
      <h2 className="mb-4 border-b border-border pb-3 text-xs font-mono font-semibold uppercase tracking-widest text-gold">
        Jobs &amp; Skills in Demand
      </h2>
      <p className="mb-4 text-base leading-relaxed text-textmuted sm:text-lg">{data.summary}</p>
      <div className="space-y-2">
        {data.key_insights.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-base text-textprimary/85 sm:text-lg">
            <span className="mt-0.5 flex-shrink-0 text-gold" aria-hidden="true">—</span>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.insight} (opens in new tab)`}
                className="inline-flex min-h-[40px] items-center -ml-1 rounded-md px-1 transition hover:text-gold hover:underline"
              >
                {item.insight}
              </a>
            ) : (
              item.insight
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export function FeaturedSection({ data }: { data: Digest['featured_resource'] }) {
  return (
    <section className="rounded-xl border border-border bg-navy p-4 sm:p-5 md:p-6">
      <p className="mb-4 text-xs font-mono font-semibold uppercase tracking-widest text-gold" aria-hidden="true">
        One Thing to Read
      </p>
      <h2 className="mb-2 font-display text-lg font-semibold leading-snug text-textprimary sm:text-xl">
        {data.title}
      </h2>
      <p className="mb-1 text-xs font-mono text-textmuted">
        {data.publication} <span aria-hidden="true">·</span> {data.format} <span aria-hidden="true">·</span> {data.read_time}
      </p>
      <p className="mb-4 text-base text-textmuted sm:mb-5 sm:text-lg">{data.why_joanna}</p>
      {data.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Read ${data.title} (opens in new tab)`}
          className="inline-flex min-h-[44px] items-center rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold/90"
        >
          Read Now <span aria-hidden="true">→</span>
        </a>
      )}
    </section>
  )
}
