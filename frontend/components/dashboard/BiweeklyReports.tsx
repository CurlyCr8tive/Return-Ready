'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { dashboardAPI, TeamReport } from '@/lib/api'
import { mockBiweeklyReports } from '@/lib/mock-data'

export function BiweeklyReports() {
  const [reports, setReports] = useState<TeamReport[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  useEffect(() => {
    dashboardAPI
      .getBiweekly()
      .then((res) => setReports(res.reports.length ? res.reports : mockBiweeklyReports))
      .catch(() => setReports(mockBiweeklyReports))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="space-y-4 text-slate-100">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold text-white">Biweekly Reports</h2>
          <p className="mt-2 text-sm text-slate-300">Newest first. Expand each report for full sections.</p>
        </div>
        <Link
          href="/dashboard/biweekly/mock-generated"
          className="rounded-xl bg-cyan-300/25 px-4 py-2 text-sm text-white hover:bg-cyan-300/35"
        >
          Generate Now
        </Link>
      </div>

      {loading ? <p className="text-slate-300">Loading...</p> : null}

      <div className="space-y-3">
        {reports.map((report, idx) => (
          <article key={`${report.period_start}-${report.period_end}-${idx}`} className="rounded-2xl border border-white/15 bg-[#12364c]">
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              onClick={() => setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }))}
            >
              <span className="text-sm text-white">
                {report.period_start} to {report.period_end}
              </span>
              <span className="text-xs text-cyan-200">{expanded[idx] ? 'Hide' : 'Expand'}</span>
            </button>

            {expanded[idx] ? (
              <pre className="overflow-x-auto border-t border-white/10 px-4 py-4 text-xs text-slate-100">
                {JSON.stringify(report.sections, null, 2)}
              </pre>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
