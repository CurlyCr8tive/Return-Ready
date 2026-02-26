interface StatCardProps {
  label: string
  value: string | number
  sub?: string
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-navylight border border-border rounded-xl p-5">
      <p className="text-xs font-mono text-textmuted uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-semibold text-textprimary">{value}</p>
      {sub && <p className="text-xs text-textmuted mt-1">{sub}</p>}
    </div>
  )
}
