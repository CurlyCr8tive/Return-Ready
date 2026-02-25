import Link from 'next/link'

export default function SettingsMockSavePage() {
  return (
    <div className="space-y-4 text-slate-100">
      <h2 className="text-3xl font-semibold text-white">Mock Document Save</h2>
      <p className="text-sm text-slate-300">This simulates saving a connected staff document.</p>
      <div className="rounded-xl border border-white/15 bg-[#12364c] p-4 text-sm">Mock result: Document saved and included in weekly pull.</div>
      <Link href="/dashboard/settings" className="inline-block rounded-lg bg-cyan-300/25 px-4 py-2 text-sm">Back to Settings</Link>
    </div>
  )
}
