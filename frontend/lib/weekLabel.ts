/**
 * Maps an overall leave week number (1–12) to a calendar label.
 * Weeks 1–4  → March
 * Weeks 5–8  → April
 * Weeks 9–12 → May
 */
export function getWeekLabel(weekNumber: number) {
  const months = ['March', 'April', 'May']
  const clamped = Math.min(Math.max(weekNumber, 1), 12)
  const monthIndex = Math.floor((clamped - 1) / 4)
  const monthWeek = ((clamped - 1) % 4) + 1
  const monthName = months[Math.min(monthIndex, 2)]
  return { monthWeek, monthName, overallWeek: clamped }
}

function toUtcDate(input: string): Date | null {
  if (!input || input === '—') return null
  const parsed = new Date(`${input}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed
}

export function getOverallWeekFromStartDate(
  weekStart: string | undefined,
  leaveStartIso = process.env.NEXT_PUBLIC_LEAVE_START_DATE || '2026-03-01'
): number | null {
  if (!weekStart) return null
  const leaveStart = toUtcDate(leaveStartIso)
  const weekStartDate = toUtcDate(weekStart)
  if (!leaveStart || !weekStartDate) return null

  const msPerDay = 1000 * 60 * 60 * 24
  const diffDays = Math.floor((weekStartDate.getTime() - leaveStart.getTime()) / msPerDay)
  const overallWeek = Math.floor(diffDays / 7) + 1
  return Math.min(Math.max(overallWeek, 1), 12)
}

export function getWeekLabelForDigest(weekNumber: number, weekStart?: string) {
  const derived = getOverallWeekFromStartDate(weekStart)
  return getWeekLabel(derived ?? weekNumber)
}
