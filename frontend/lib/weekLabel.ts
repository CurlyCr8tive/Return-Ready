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
