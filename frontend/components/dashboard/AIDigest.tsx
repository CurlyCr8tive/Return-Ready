'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { aiDigestAPI, AIDigest as AIDigestType } from '@/lib/api'
import { mockDigests } from '@/lib/mock-data'

type DigestArticle = {
  headline: string
  description: string
  url: string
}

type FundingSnapshot = {
  topRounds: string[]
  sectors: string[]
  marketDirection: string[]
  url: string
}

type DigestMeta = {
  generatedLabel: string
  sourcesAnalyzed: number
  readingTimeMin: number
}

export function AIDigest() {
  const [digests, setDigests] = useState<AIDigestType[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [ready, setReady] = useState(false)

  const load = async () => {
    try {
      const res = await aiDigestAPI.list()
      setDigests(res.digests.length ? res.digests : mockDigests)
    } catch {
      setDigests(mockDigests)
    }
  }

  useEffect(() => {
    load().finally(() => {
      setLoading(false)
      setTimeout(() => setReady(true), 60)
    })
  }, [])

  return (
    <section className="space-y-4 text-slate-100">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold text-white">AI News Digest</h2>
          <p className="mt-2 text-sm text-slate-300">Weekly digest with implications for Pursuit.</p>
        </div>
        <Link
          href="/dashboard/ai-digest/mock-generated"
          className="dashboard-button rounded-xl px-4 py-2 text-sm"
        >
          Generate Now
        </Link>
      </div>

      {loading ? <p className="text-slate-300">Loading...</p> : null}

      <div className="space-y-3">
        {digests.map((digest, idx) => (
          <article
            key={`${digest.week_start}-${idx}`}
            className={`dashboard-card rounded-2xl transition-all duration-500 ease-out ${
              ready ? 'translate-y-0 opacity-100' : 'translate-y-1.5 opacity-0'
            }`}
            style={{ transitionDelay: `${idx * 70}ms` }}
          >
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              onClick={() => setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }))}
            >
              <div>
                <span className="text-sm font-semibold text-white">Week of {digest.week_start}</span>
                <p className="mt-1 text-[11px] leading-snug text-cyan-200/90">
                  {digestMeta(digest).generatedLabel}
                  {' · '}
                  Sources analyzed: {digestMeta(digest).sourcesAnalyzed}
                  {' · '}
                  Est. reading time: {digestMeta(digest).readingTimeMin} min
                </p>
              </div>
              <span className="text-xs text-cyan-200">{(expanded[idx] ?? idx === 0) ? 'Hide' : 'Expand'}</span>
            </button>

            <div
              className={`grid overflow-hidden border-t border-white/10 transition-all duration-300 ease-out ${
                (expanded[idx] ?? idx === 0)
                  ? '[grid-template-rows:1fr] opacity-100'
                  : '[grid-template-rows:0fr] opacity-0'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="space-y-6 px-4 py-4 text-sm text-slate-100">
                  <SectionTitle section="SECTION 1" title="Market Developments" />
                  <MarketDevelopments digest={digest} />

                  <SectionTitle section="SECTION 2" title="Strategic Signals" />
                  <StrategicSignals digest={digest} />

                  <div className="grid items-stretch gap-3 lg:grid-cols-2">
                    <div className="flex h-full flex-col">
                      <SectionTitle section="SECTION 3" title="Implications for Pursuit" />
                      <SecondaryListCard
                        title="What It Means for Pursuit"
                        items={getPursuitImplications(digest, Math.max(3, toList(digest.sections.who_is_hiring_in_ai).length))}
                        className="mt-2 h-full"
                      />
                    </div>
                    <div className="flex h-full flex-col">
                      <SectionTitle section="SECTION 4" title="Hiring Landscape" />
                      <SecondaryListCard
                        title="Who Is Hiring in AI"
                        items={toList(digest.sections.who_is_hiring_in_ai)}
                        className="mt-2 h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function SectionTitle({ section, title }: { section: string; title: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/90">{section}</p>
      <h3 className="text-2xl font-semibold leading-tight text-white">{title}</h3>
    </div>
  )
}

function MarketDevelopments({ digest }: { digest: AIDigestType }) {
  const articles = ensureArticleCount(getArticles(digest), 3)
  const funding = getFundingSnapshot(digest)
  return (
    <div className="grid items-stretch gap-3 lg:grid-cols-2">
      <PrimaryArticleCard article={articles[0]} className="h-full" />
      <PrimaryArticleCard article={articles[1]} className="h-full" />
      <PrimaryArticleCard article={articles[2]} className="h-full" />
      <FundingSnapshotCard snapshot={funding} className="h-full" />
    </div>
  )
}

function StrategicSignals({ digest }: { digest: AIDigestType }) {
  const signals = toList((digest.sections as Record<string, unknown>).market_direction_signals)
  const sectors = getFundingSnapshot(digest).sectors
  const oneRead = getOneThingToRead(digest)
  const companies = toList(digest.sections.companies_to_watch)

  return (
    <article className="relative rounded-xl border border-slate-300/88 bg-[linear-gradient(165deg,#e8eff6_0%,#dbe5ef_56%,#d6e0eb_100%)] p-5 text-slate-900 shadow-[0_16px_30px_rgba(2,13,22,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_38px_rgba(2,13,22,0.34)]">
      <span className="absolute bottom-4 left-0 top-4 w-[2px] rounded-full bg-[#4f94b8]/70" />
      <h4 className="pl-4 text-xl font-semibold text-slate-900">Market Direction & Strategic Signals</h4>

      <div className="mt-4 grid gap-4 pl-4 md:grid-cols-3">
        <SignalList title="Signals about market direction" items={signals.length ? signals : ['Enterprise buyers prioritizing practical AI productivity tools.']} />
        <SignalList title="Sectors attracting capital" items={sectors} />
        <SignalList title="Companies to watch" items={companies} />
      </div>

      <div className="mt-4 border-t border-slate-300/70 pt-3 pl-4">
        <p className="text-sm font-medium text-slate-800">One thing to read</p>
        <p className="mt-1 text-sm font-normal text-slate-700">{oneRead.title}</p>
        {oneRead.url ? (
          <a
            href={oneRead.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            Read full report →
          </a>
        ) : null}
      </div>
    </article>
  )
}

function PrimaryArticleCard({ article, className = '' }: { article: DigestArticle; className?: string }) {
  return (
    <article className={`relative flex h-full flex-col rounded-xl border border-slate-300/95 bg-[radial-gradient(circle_at_88%_12%,rgba(255,255,255,0.42)_0%,transparent_32%),linear-gradient(168deg,#f2f6fb_0%,#e0e8f2_54%,#d7e1ec_100%)] p-5 text-slate-900 shadow-[0_20px_38px_rgba(2,13,22,0.35),inset_0_1px_0_rgba(255,255,255,0.62)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_26px_46px_rgba(2,13,22,0.42),inset_0_1px_0_rgba(255,255,255,0.66)] ${className}`}>
      <span className="absolute bottom-4 left-0 top-4 w-[2px] rounded-full bg-[#4c91b6]/75" />
      <h4 className="pl-4 text-[2rem] font-semibold leading-tight text-slate-900">{article.headline}</h4>
      <p className="mt-3 flex-1 pl-4 text-base font-normal leading-relaxed text-slate-700">{article.description}</p>
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block pl-4 text-sm font-semibold text-blue-700 hover:text-blue-800"
      >
        Read full report →
      </a>
    </article>
  )
}

function FundingSnapshotCard({ snapshot, className = '' }: { snapshot: FundingSnapshot; className?: string }) {
  return (
    <article className={`relative flex h-full flex-col rounded-xl border border-slate-300/95 bg-[radial-gradient(circle_at_88%_12%,rgba(255,255,255,0.42)_0%,transparent_32%),linear-gradient(168deg,#f2f6fb_0%,#e0e8f2_54%,#d7e1ec_100%)] p-5 text-slate-900 shadow-[0_20px_38px_rgba(2,13,22,0.35),inset_0_1px_0_rgba(255,255,255,0.62)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_26px_46px_rgba(2,13,22,0.42),inset_0_1px_0_rgba(255,255,255,0.66)] ${className}`}>
      <span className="absolute bottom-4 left-0 top-4 w-[2px] rounded-full bg-[#4c91b6]/75" />
      <h4 className="pl-4 text-[2rem] font-semibold leading-tight text-slate-900">AI Funding &amp; Investment Snapshot</h4>

      <div className="mt-3 flex-1 space-y-3 pl-4">
        <SignalList title="Top funding rounds this week" items={snapshot.topRounds} dark />
        <SignalList title="Sectors attracting capital" items={snapshot.sectors} dark />
        <SignalList title="Signals about market direction" items={snapshot.marketDirection} dark />
      </div>

      <a
        href={snapshot.url}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-block pl-4 text-sm font-semibold text-blue-700 hover:text-blue-800"
      >
        Read full report →
      </a>
    </article>
  )
}

function SecondaryListCard({
  title,
  items,
  className = '',
}: {
  title: string
  items: string[]
  className?: string
}) {
  return (
    <article className={`relative flex h-full flex-col rounded-xl border border-slate-300/90 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.34)_0%,transparent_34%),linear-gradient(168deg,#edf3f9_0%,#dde7f1_60%,#d3deea_100%)] p-5 text-slate-900 shadow-[0_18px_32px_rgba(2,13,22,0.3),inset_0_1px_0_rgba(255,255,255,0.56)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(2,13,22,0.36),inset_0_1px_0_rgba(255,255,255,0.62)] ${className}`}>
      <span className="absolute bottom-4 left-0 top-4 w-[2px] rounded-full bg-[#5897b8]/55" />
      <h4 className="pl-4 text-[1.8rem] font-semibold text-slate-900">{title}</h4>
      <ul className="mt-3 flex-1 space-y-1.5 pl-4 text-base font-normal leading-relaxed text-slate-700">
        {items.length === 0 ? <li>No updates available this week.</li> : null}
        {items.map((item) => (
          <li key={item} className="list-inside list-disc">
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}

function SignalList({
  title,
  items,
  dark = false,
}: {
  title: string
  items: string[]
  dark?: boolean
}) {
  return (
    <div>
      <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${dark ? 'text-slate-700' : 'text-slate-600'}`}>
        {title}
      </p>
      <ul className={`mt-1.5 space-y-1 ${dark ? 'text-sm text-slate-700' : 'text-sm text-slate-700'}`}>
        {items.length === 0 ? <li>No major updates.</li> : null}
        {items.map((item) => (
          <li key={item} className="list-inside list-disc leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function toList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item))
  }
  if (typeof value === 'string' && value.trim()) {
    return [value]
  }
  return []
}

function getArticles(digest: AIDigestType): DigestArticle[] {
  const topDevelopments = digest.sections.top_developments
  if (Array.isArray(topDevelopments)) {
    const mapped = topDevelopments
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const candidate = item as { headline?: unknown; description?: unknown; url?: unknown }
        if (typeof candidate.headline !== 'string') return null
        return {
          headline: candidate.headline,
          description:
            typeof candidate.description === 'string'
              ? candidate.description
              : 'Summary not available.',
          url:
            typeof candidate.url === 'string' && candidate.url.trim()
              ? candidate.url
              : '#',
        } satisfies DigestArticle
      })
      .filter((item): item is DigestArticle => item !== null)
    if (mapped.length > 0) return mapped
  }

  const happened = toList(digest.sections.what_happened_this_week)
  const links = digest.source_links || []
  return happened.map((line, i) => {
    const shortHeadline = line.length > 70 ? `${line.slice(0, 67)}...` : line
    return {
      headline: shortHeadline,
      description: line,
      url: links[i] || links[0] || '#',
    }
  })
}

function ensureArticleCount(articles: DigestArticle[], count: number): DigestArticle[] {
  const next = [...articles]
  while (next.length < count) {
    const index = next.length + 1
    next.push({
      headline: `Additional market development ${index}`,
      description: 'No summary available for this slot yet. This section will populate from live digest data.',
      url: '#',
    })
  }
  return next.slice(0, count)
}

function getFundingSnapshot(digest: AIDigestType): FundingSnapshot {
  const section = (digest.sections as Record<string, unknown>).funding_snapshot
  if (section && typeof section === 'object') {
    const candidate = section as {
      top_rounds?: unknown
      sectors?: unknown
      market_direction?: unknown
      url?: unknown
    }
    return {
      topRounds: toList(candidate.top_rounds),
      sectors: toList(candidate.sectors),
      marketDirection: toList(candidate.market_direction),
      url: typeof candidate.url === 'string' && candidate.url ? candidate.url : (digest.source_links?.[0] || '#'),
    }
  }

  return {
    topRounds: ['Series C in enterprise AI assistant tooling', 'Growth round in AI data infrastructure'],
    sectors: ['Workforce enablement', 'AI operations platforms', 'Enterprise copilots'],
    marketDirection: ['Capital is concentrating on applied AI with measurable ROI.'],
    url: digest.source_links?.[0] || '#',
  }
}

function getPursuitImplications(digest: AIDigestType, targetLength = 3): string[] {
  const raw = digest.sections.what_it_means_for_pursuit
  const fallbackPool = [
    'Expand AI-readiness support for career services and learner support workflows.',
    'Prioritize use cases with direct impact on job outcomes and coaching velocity.',
    'Track implementation quality with weekly adoption and outcome metrics.',
    'Align staff enablement with tools that reduce operational bottlenecks.',
  ]

  if (Array.isArray(raw)) {
    return normalizeLength(raw.map((item) => String(item)), targetLength, fallbackPool)
  }
  if (typeof raw === 'string' && raw.trim()) {
    return normalizeLength(splitSentences(raw), targetLength, fallbackPool)
  }
  return normalizeLength([], targetLength, fallbackPool)
}

function getOneThingToRead(digest: AIDigestType): { title: string; url: string } {
  const section = digest.sections.one_thing_to_read
  const item = (section && typeof section === 'object' ? section : {}) as { title?: string; url?: string }
  return {
    title: item.title || 'No featured resource this week.',
    url: item.url || '',
  }
}

function digestMeta(digest: AIDigestType): DigestMeta {
  const meta = (digest.sections as Record<string, unknown>).digest_meta
  const generatedLabel = `Generated: ${formatDisplayDate(digest.generated_at || digest.week_end || digest.week_start)}`

  if (meta && typeof meta === 'object') {
    const candidate = meta as { sources_analyzed?: unknown; reading_time_min?: unknown }
    return {
      generatedLabel,
      sourcesAnalyzed:
        typeof candidate.sources_analyzed === 'number'
          ? candidate.sources_analyzed
          : Math.max(8, (digest.source_links?.length || 1) * 6),
      readingTimeMin:
        typeof candidate.reading_time_min === 'number'
          ? candidate.reading_time_min
          : 4,
    }
  }

  return {
    generatedLabel,
    sourcesAnalyzed: Math.max(8, (digest.source_links?.length || 1) * 6),
    readingTimeMin: 4,
  }
}

function formatDisplayDate(iso: string): string {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return iso
  return parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function splitSentences(value: string): string[] {
  const parts = value
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean)
  if (parts.length > 0) return parts
  return [value.trim()].filter(Boolean)
}

function normalizeLength(items: string[], length: number, fallbackPool: string[]): string[] {
  const out = items.slice(0, length)
  let i = 0
  while (out.length < length) {
    out.push(fallbackPool[i % fallbackPool.length])
    i += 1
  }
  return out
}
