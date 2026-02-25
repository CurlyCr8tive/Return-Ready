'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { aiDigestAPI, dashboardAPI } from '@/lib/api'

export function Overview() {
  const [overview, setOverview] = useState<{
    latest_biweekly: { generated_at: string } | null
    latest_monthly: { generated_at: string } | null
    report_status: { biweekly_count: number; monthly_count: number }
    people_tracked: number
  } | null>(null)
  const [latestDigestHeadline, setLatestDigestHeadline] = useState('No digest yet')

  useEffect(() => {
    async function load() {
      const [overviewRes, digestRes] = await Promise.allSettled([
        dashboardAPI.getOverview(),
        aiDigestAPI.list(),
      ])

      if (overviewRes.status === 'fulfilled') {
        setOverview(overviewRes.value)
      }

      if (digestRes.status === 'fulfilled' && digestRes.value.digests.length > 0) {
        const newest = digestRes.value.digests[0]
        const happened = newest.sections.what_happened_this_week
        if (Array.isArray(happened) && happened.length > 0) {
          setLatestDigestHeadline(String(happened[0]))
        }
      }
    }

    load()
  }, [])

  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <h2 className="text-3xl font-semibold text-white">Overview</h2>
        <p className="mt-2 text-sm text-slate-300">
          Latest team synthesis, AI digest headline, and report status in one view.
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
        />
        <Card
          title="Latest Monthly"
          value={
            overview?.latest_monthly?.generated_at
              ? new Date(overview.latest_monthly.generated_at).toLocaleDateString()
              : 'Not generated'
          }
        />
        <Card
          title="Reports"
          value={`${overview?.report_status.biweekly_count ?? 0} biweekly / ${
            overview?.report_status.monthly_count ?? 0
          } monthly`}
        />
        <Card title="People Tracked" value={String(overview?.people_tracked ?? 0)} />
      </div>

      <div className="rounded-2xl border border-cyan-100/20 bg-[#0f3449] p-5">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">Latest AI Digest Headline</p>
        <p className="mt-2 text-base text-white">{latestDigestHeadline}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <QuickLink href="/dashboard/biweekly" label="Open Biweekly Reports" />
        <QuickLink href="/dashboard/monthly" label="Open Monthly Reports" />
        <QuickLink href="/dashboard/by-person" label="Open By Person" />
        <QuickLink href="/dashboard/ai-digest" label="Open AI Digest" />
        <QuickLink href="/dashboard/settings" label="Open Settings" />
      </div>
    </div>
  )
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-[#12374d] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/95">{title}</p>
      <p className="mt-2 text-xl text-white">{value}</p>
    </div>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-white/15 bg-[#113248] px-4 py-3 text-sm text-cyan-100 transition hover:bg-[#17445f]"
    >
      {label}
    </Link>
  )
}
