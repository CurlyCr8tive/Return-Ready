import { clsx } from 'clsx'

type Priority = 'HIGH' | 'MEDIUM' | 'WATCH'

const priorityStyles: Record<Priority, string> = {
  HIGH: 'bg-red-500/10 text-red-400 border border-red-500/20',
  MEDIUM: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  WATCH: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold font-mono tracking-wide',
        priorityStyles[priority] ?? 'bg-white/10 text-textmuted'
      )}
    >
      {priority}
    </span>
  )
}

export function SourceBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/10 text-gold border border-gold/20">
      {label}
    </span>
  )
}
