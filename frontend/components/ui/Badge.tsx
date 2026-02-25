// frontend/components/ui/Badge.tsx
// Classification and signal badge components
// Used in Priority Inbox to show item classification and signal strength

import { clsx } from 'clsx'

type Classification = 'Decision' | 'Risk' | 'Update' | 'Win' | 'Escalation' | 'Noise'
type Signal = 'HIGH' | 'MEDIUM' | 'LOW' | 'NOISE'

interface BadgeProps {
  label: string
  className?: string
}

const classificationColors: Record<Classification, string> = {
  Decision: 'bg-blue/10 text-blue',
  Risk: 'bg-orange/10 text-orange',
  Update: 'bg-slate-100 text-gray',
  Win: 'bg-accent/10 text-accent',
  Escalation: 'bg-red-100 text-red-600',
  Noise: 'bg-slate-100 text-slate-400',
}

const signalColors: Record<Signal, string> = {
  HIGH: 'bg-red-100 text-red-600',
  MEDIUM: 'bg-orange/10 text-orange',
  LOW: 'bg-slate-100 text-gray',
  NOISE: 'bg-slate-50 text-slate-300',
}

export function ClassificationBadge({ label, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        classificationColors[label as Classification] ?? 'bg-slate-100 text-gray',
        className
      )}
    >
      {label}
    </span>
  )
}

export function SignalBadge({ label, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide uppercase',
        signalColors[label as Signal] ?? 'bg-slate-100 text-gray',
        className
      )}
    >
      {label}
    </span>
  )
}
