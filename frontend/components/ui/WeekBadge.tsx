import { getWeekLabel } from '@/lib/weekLabel'

interface WeekBadgeProps {
  weekNumber: number
  showOverall?: boolean // include "of 12" in the main label (for hero/detail views)
  className?: string
}

export function WeekBadge({ weekNumber, showOverall = false, className = '' }: WeekBadgeProps) {
  const { monthWeek, monthName, overallWeek } = getWeekLabel(weekNumber)

  return (
    <span className={`relative group/week inline-flex items-center cursor-default ${className}`}>
      <span className="text-xs font-mono text-textmuted">
        {showOverall
          ? `Week ${monthWeek} of 12 · ${monthName}`
          : `Week ${monthWeek} · ${monthName}`}
      </span>
      {/* Popup tooltip */}
      <span className="absolute bottom-full left-0 mb-1.5 px-2 py-1 bg-navy border border-border rounded-md text-xs font-mono text-textmuted whitespace-nowrap opacity-0 group-hover/week:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
        Week {overallWeek} of 12
      </span>
    </span>
  )
}
