'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BrainCircuit } from 'lucide-react'
import { aiDigestAPI, dashboardAPI } from '@/lib/api'
import { mockDigests, mockOverview } from '@/lib/mock-data'

export function Overview() {
  const [overview, setOverview] = useState<{
    latest_biweekly: { generated_at: string } | null
    latest_monthly: { generated_at: string } | null
    report_status: { biweekly_count: number; monthly_count: number }
    people_tracked: number
  } | null>(null)
  const [latestDigestHeadline, setLatestDigestHeadline] = useState('No digest yet')
  const [latestDigestGeneratedAt, setLatestDigestGeneratedAt] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const [overviewRes, digestRes] = await Promise.allSettled([
        dashboardAPI.getOverview(),
        aiDigestAPI.list(),
      ])

      if (overviewRes.status === 'fulfilled') {
        setOverview(overviewRes.value)
      } else {
        setOverview(mockOverview)
      }

      if (digestRes.status === 'fulfilled' && digestRes.value.digests.length > 0) {
        const newest = digestRes.value.digests[0]
        setLatestDigestGeneratedAt(newest.generated_at || null)
        const happened = newest.sections.what_happened_this_week
        if (Array.isArray(happened) && happened.length > 0) {
          setLatestDigestHeadline(String(happened[0]))
        }
      } else {
        setLatestDigestGeneratedAt(mockDigests[0]?.generated_at || null)
        const fallback = mockDigests[0]?.sections.what_happened_this_week
        if (Array.isArray(fallback) && fallback.length > 0) {
          setLatestDigestHeadline(String(fallback[0]))
        }
      }
    }

    load()
  }, [])

  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <h2 className="text-[2.15rem] font-semibold text-white">Overview</h2>
        <p className="mt-2 text-sm text-slate-300">
          Your team&apos;s activity and AI-generated summary at a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Latest Biweekly"
          value={
            overview?.latest_biweekly?.generated_at
              ? new Date(overview.latest_biweekly.generated_at).toLocaleDateString()
              : 'Not generated'
          }
          context="2 new updates since last cycle"
          strong
        />
        <Card
          title="Latest Monthly"
          value={
            overview?.latest_monthly?.generated_at
              ? new Date(overview.latest_monthly.generated_at).toLocaleDateString()
              : 'Not generated'
          }
          context="Monthly synthesis refreshed this period"
        />
        <Card
          title="Reports"
          value={`${overview?.report_status.biweekly_count ?? 0} biweekly / ${
            overview?.report_status.monthly_count ?? 0
          } monthly`}
          context="+1 this week"
        />
        <Card title="People Tracked" value={String(overview?.people_tracked ?? 0)} context="All core owners reporting" />
      </div>

      <div className="dashboard-insight-card rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-100/30 bg-cyan-200/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100">
            <BrainCircuit size={13} />
            AI Insight
          </span>
          <span className="text-xs text-cyan-100/85">
            {latestDigestGeneratedAt ? `Generated ${formatRelativeTime(latestDigestGeneratedAt)}` : 'Generated recently'}
          </span>
        </div>
        <p className="mt-3 text-lg font-semibold leading-snug text-white">{latestDigestHeadline}</p>
        <Link href="/dashboard/ai-digest" className="mt-3 inline-block text-sm font-medium text-cyan-100 underline underline-offset-2 hover:text-white">
          View Full Digest →
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-12">
        <QuickLink href="/dashboard/monthly" label="Open Latest Monthly Report" tone="primary" className="md:col-span-6 xl:col-span-5" />
        <QuickLink href="/dashboard/biweekly" label="Open Biweekly" tone="ghost" className="md:col-span-3" />
        <QuickLink href="/dashboard/by-person" label="Open By Person" tone="ghost" className="md:col-span-3 xl:col-span-2" />
        <QuickLink href="/dashboard/ai-digest" label="Open AI Digest" tone="ghost" className="md:col-span-4 xl:col-span-3" />
        <QuickLink href="/dashboard/settings" label="Open Settings" tone="ghost" className="md:col-span-4 xl:col-span-2" />
      </div>

      <div className="dashboard-card rounded-2xl p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">System Status</p>
        <ul className="mt-3 space-y-1.5 text-sm leading-snug text-slate-100">
          <li>✓ All check-ins sent</li>
          <li>✓ 4 responses received</li>
          <li>⚠ 1 overdue</li>
        </ul>
      </div>
    </div>
  )
}

function Card({
  title,
  value,
  context,
  strong = false,
}: {
  title: string
  value: string
  context: string
  strong?: boolean
}) {
  return (
    <div className={`${strong ? 'dashboard-card-strong' : 'dashboard-card'} rounded-2xl p-4`}>
      <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/95">{title}</p>
      <p className="mt-2 text-[2rem] font-semibold leading-[1.1] text-white">{value}</p>
      <p className="mt-1 text-xs leading-snug text-cyan-100/85">{context}</p>
    </div>
  )
}

function QuickLink({
  href,
  label,
  tone,
  className = '',
}: {
  href: string
  label: string
  tone: 'primary' | 'ghost'
  className?: string
}) {
  return (
    <Link
      href={href}
      className={`${tone === 'primary' ? 'dashboard-button-primary' : 'dashboard-button-ghost'} rounded-xl px-4 py-3 text-sm font-semibold text-cyan-100 ${className}`}
    >
      {label}
    </Link>
  )
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffHours = Math.max(1, Math.round((now - then) / (1000 * 60 * 60)))

  if (diffHours < 24) return `${diffHours} hours ago`
  const diffDays = Math.round(diffHours / 24)
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
}
