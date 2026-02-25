import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

export type StaffMember = {
  id: string
  name: string
  email: string
  created_at: string
}

export type FormSubmission = {
  id: string
  staff_email: string
  staff_name: string
  month: string
  year: number
  q1_important: string
  q2_decisions: string
  q3_risks: string
  q4_wins: string
  q5_external: string
  q6_team_health: string
  q7_first_week: string
  submitted_at: string
}

export type MonthlyReport = {
  id: string
  month: string
  year: number
  month_summary: string
  key_decisions: string
  risks_open_items: string
  wins_progress: string
  first_week_focus: string
  full_report_json: Record<string, string>
  submission_count: number
  generated_at: string
}

export type FormSendLog = {
  id: string
  staff_email: string
  month: string
  token: string
  sent_at: string
  submitted: boolean
  submitted_at: string | null
}

export type BotHistory = {
  id: string
  staff_email: string
  staff_name: string
  bot_type: string
  question: string
  answer: string
  sources: Array<{ source: string; chunk_index: number; score: number }>
  created_at: string
}
