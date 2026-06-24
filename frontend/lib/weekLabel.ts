const ALL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/**
 * Maps a week number to a calendar label.
 * When weekStartIso is provided the month is derived from the actual date.
 * Falls back to a week-count offset from March when no date is available.
 */
export function getWeekLabel(weekNumber: number, weekStartIso?: string) {
  if (weekStartIso) {
    const d = new Date(`${weekStartIso}T00:00:00Z`)
    if (!Number.isNaN(d.getTime())) {
      return {
        monthWeek: Math.ceil(d.getUTCDate() / 7),
        monthName: ALL_MONTHS[d.getUTCMonth()],
        overallWeek: weekNumber,
      }
    }
  }
  // Fallback: offset from March (leave start month), no upper cap
  const leaveMonths = [
    'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ]
  const week = Math.max(weekNumber, 1)
  const monthIndex = Math.floor((week - 1) / 4)
  const monthWeek = ((week - 1) % 4) + 1
  return {
    monthWeek,
    monthName: leaveMonths[Math.min(monthIndex, leaveMonths.length - 1)],
    overallWeek: week,
  }
}

function toUtcDate(input: string): Date | null {
  if (!input || input === '—') return null
  const parsed = new Date(`${input}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

export function getOverallWeekFromStartDate(
  weekStart: string | undefined,
  leaveStartIso = process.env.NEXT_PUBLIC_LEAVE_START_DATE || '2026-03-16'
): number | null {
  if (!weekStart) return null
  const leaveStart = toUtcDate(leaveStartIso)
  const weekStartDate = toUtcDate(weekStart)
  if (!leaveStart || !weekStartDate) return null

  const msPerDay = 1000 * 60 * 60 * 24
  const diffDays = Math.floor((weekStartDate.getTime() - leaveStart.getTime()) / msPerDay)
  const overallWeek = Math.floor(diffDays / 7) + 1
  return Math.max(overallWeek, 1)
}

export function getWeekLabelForDigest(weekNumber: number, weekStart?: string) {
  const derived = getOverallWeekFromStartDate(weekStart)
  return getWeekLabel(derived ?? weekNumber, weekStart)
}
