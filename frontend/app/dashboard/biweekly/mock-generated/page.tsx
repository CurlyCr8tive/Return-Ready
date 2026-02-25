import Link from 'next/link'

export default function BiweeklyMockGeneratedPage() {
  return (
    <div className="space-y-4 text-slate-100">
      <h2 className="text-3xl font-semibold text-white">Mock Biweekly Generation</h2>
      <p className="text-sm text-slate-300">This is a mock success page. Real biweekly generation will be wired to Claude + Supabase.</p>
      <div className="rounded-xl border border-white/15 bg-[#12364c] p-4 text-sm">Mock report generated for period: 2026-02-08 to 2026-02-21.</div>
      <Link href="/dashboard/biweekly" className="inline-block rounded-lg bg-cyan-300/25 px-4 py-2 text-sm">Back to Biweekly Reports</Link>
    </div>
  )
}
