import type { Digest } from '@/lib/api'

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: 'text-red-400',
  MEDIUM: 'text-yellow-400',
  WATCH: 'text-blue-400',
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
            <h3 className="mt-1 mb-2 font-display text-base font-semibold leading-snug text-textprimary sm:text-lg">
              {dev.headline}
            </h3>
            <p className="text-sm text-textmuted leading-relaxed mb-2">{dev.synthesis}</p>
            <p className="text-sm text-textprimary/80 leading-relaxed mb-3">{dev.why_it_matters}</p>
            {dev.url ? (
              <a
                href={dev.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${dev.source} (opens in new tab)`}
                className="inline-flex min-h-[40px] items-center rounded-md px-2 -ml-2 text-xs text-gold transition hover:bg-gold/10 hover:underline"
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
  if (data?.placeholder) {
    return (
      <section>
        <h2 className="text-xs font-mono font-semibold text-gold tracking-widest uppercase mb-4 pb-3 border-b border-border">
          What the Pursuit Team Is Discussing
        </h2>
        <p className="text-sm text-textmuted italic">{data.message}</p>
      </section>
    )
  }
  return null
}

export function ImplicationsSection({ items }: { items: Digest['pursuit_implications'] }) {
  return (
    <section className="rounded-xl border border-gold/20 bg-gold/5 p-4 sm:p-5 md:p-6">
      <h2 className="mb-4 text-xs font-mono font-semibold uppercase tracking-widest text-gold sm:mb-5">
        Why This Matters for Pursuit
      </h2>
      <div className="space-y-5">
        {items.map((imp, i) => (
          <div key={i} className="pl-4 border-l-2 border-gold">
            <span className={`text-xs font-mono font-semibold ${PRIORITY_COLORS[imp.priority] ?? 'text-textmuted'} mb-1 block`}>
              {imp.priority}
            </span>
            <p className="text-sm font-medium text-textprimary mb-1 leading-snug">{imp.implication}</p>
            <p className="text-xs text-textmuted leading-relaxed">{imp.reasoning}</p>
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
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-semibold text-textprimary leading-snug">{co.name}</p>
                {co.url && (
                  <span className="text-gold text-xs flex-shrink-0 opacity-60 group-hover:opacity-100 transition mt-0.5" aria-hidden="true">↗</span>
                )}
              </div>
              <p className="text-xs text-textmuted mb-2">{co.what_they_do}</p>
              <p className="text-xs text-gold font-medium">{co.why_watch_now}</p>
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
      <p className="text-sm text-textmuted leading-relaxed mb-4">{data.summary}</p>
      <div className="space-y-2">
        {data.key_insights.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-textprimary/80">
            <span className="text-gold mt-0.5 flex-shrink-0" aria-hidden="true">—</span>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.insight} (opens in new tab)`}
                className="inline-flex min-h-[40px] items-center rounded-md px-1 -ml-1 transition hover:text-gold hover:underline"
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
      <p className="text-xs font-mono text-gold font-semibold tracking-widest uppercase mb-4" aria-hidden="true">
        One Thing to Read
      </p>
      <h2 className="mb-2 font-display text-lg font-semibold leading-snug text-textprimary sm:text-xl">
        {data.title}
      </h2>
      <p className="text-xs text-textmuted font-mono mb-1">
        {data.publication} <span aria-hidden="true">·</span> {data.format} <span aria-hidden="true">·</span> {data.read_time}
      </p>
      <p className="mb-4 text-sm text-textmuted sm:mb-5">{data.why_joanna}</p>
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
