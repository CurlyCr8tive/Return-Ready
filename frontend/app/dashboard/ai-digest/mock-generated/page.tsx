import Link from 'next/link'

export default function AIDigestMockGeneratedPage() {
  return (
    <div className="space-y-4 text-slate-100">
      <h2 className="text-3xl font-semibold text-white">Mock AI Digest Generation</h2>
      <p className="text-sm text-slate-300">This is a mock success page. Real AI digest generation will be wired to Claude web search synthesis.</p>
      <div className="rounded-xl border border-white/15 bg-[#12364c] p-4 text-sm">Mock digest generated for week of 2026-02-16.</div>
      <Link href="/dashboard/ai-digest" className="inline-block rounded-lg bg-cyan-300/25 px-4 py-2 text-sm">Back to AI Digest</Link>
    </div>
  )
}
