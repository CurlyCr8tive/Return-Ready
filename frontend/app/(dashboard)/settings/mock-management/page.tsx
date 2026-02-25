import Link from 'next/link'

export default function SettingsMockManagementPage() {
  return (
    <div className="space-y-4 text-slate-100">
      <h2 className="text-3xl font-semibold text-white">Mock Management Tier Toggle</h2>
      <p className="text-sm text-slate-300">This simulates enabling/disabling Joanna's optional management tier.</p>
      <div className="rounded-xl border border-white/15 bg-[#12364c] p-4 text-sm">Mock result: Management tier is now enabled.</div>
      <Link href="/dashboard/settings" className="inline-block rounded-lg bg-cyan-300/25 px-4 py-2 text-sm">Back to Settings</Link>
    </div>
  )
}
