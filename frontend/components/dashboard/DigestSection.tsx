import type { Digest } from '@/lib/api'

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: 'text-red-400',
  MEDIUM: 'text-yellow-400',
  WATCH: 'text-blue-400',
}

export function DevelopmentsSection({ items }: { items: Digest['ai_developments'] }) {
  return (
    <section>
      <h2 className="text-xs font-mono font-semibold text-gold tracking-widest uppercase mb-5 pb-3 border-b border-border">
        What Happened in AI This Week
      </h2>
      <div className="space-y-6">
        {items.map((dev, i) => (
          <div key={i} className="border-b border-border pb-6 last:border-0 last:pb-0">
            <span className="text-xs font-mono text-textmuted" aria-hidden="true">{i + 1}</span>
            <h3 className="font-display text-lg font-semibold text-textprimary mt-1 mb-2 leading-snug">
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
                className="text-xs text-gold hover:underline"
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
    <section className="bg-gold/5 border border-gold/20 rounded-xl p-6">
      <h2 className="text-xs font-mono font-semibold text-gold tracking-widest uppercase mb-5">
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
      <h2 className="text-xs font-mono font-semibold text-gold tracking-widest uppercase mb-5 pb-3 border-b border-border">
        Companies to Watch
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="group bg-navylight border border-border rounded-lg p-4 hover:border-gold/40 transition block"
            >
              {inner}
            </a>
          ) : (
            <div key={i} className="bg-navylight border border-border rounded-lg p-4">
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
      <h2 className="text-xs font-mono font-semibold text-gold tracking-widest uppercase mb-4 pb-3 border-b border-border">
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
                className="hover:text-gold hover:underline transition"
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
    <section className="bg-navy border border-border rounded-xl p-6">
      <p className="text-xs font-mono text-gold font-semibold tracking-widest uppercase mb-4" aria-hidden="true">
        One Thing to Read
      </p>
      <h2 className="font-display text-xl font-semibold text-textprimary mb-2 leading-snug">
        {data.title}
      </h2>
      <p className="text-xs text-textmuted font-mono mb-1">
        {data.publication} <span aria-hidden="true">·</span> {data.format} <span aria-hidden="true">·</span> {data.read_time}
      </p>
      <p className="text-sm text-textmuted mb-5">{data.why_joanna}</p>
      {data.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Read ${data.title} (opens in new tab)`}
          className="inline-block bg-gold text-navy text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gold/90 transition"
        >
          Read Now <span aria-hidden="true">→</span>
        </a>
      )}
    </section>
  )
}
