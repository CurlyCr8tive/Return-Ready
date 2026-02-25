'use client'

import { useEffect, useState } from 'react'
import { formsAPI } from '@/lib/api'
import type { FormSubmission } from '@/lib/supabase'

const MONTHS = ['march', 'april', 'may']
const MONTH_LABELS: Record<string, string> = { march: 'March', april: 'April', may: 'May' }

const QUESTIONS: { key: keyof FormSubmission; label: string }[] = [
  { key: 'q1_important', label: 'Most important things this month' },
  { key: 'q2_decisions', label: 'Decisions made or still needed' },
  { key: 'q3_risks', label: 'Risks or problems' },
  { key: 'q4_wins', label: 'Wins & positive developments' },
  { key: 'q5_external', label: 'External relationships & clients' },
  { key: 'q6_team_health', label: 'Team health & morale' },
  { key: 'q7_first_week', label: "Priority for Joanna's first week back" },
]

export function StaffSubmissions() {
  const [selectedMonth, setSelectedMonth] = useState('march')
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStaff, setSelectedStaff] = useState<string>('all')

  useEffect(() => {
    setLoading(true)
    setSelectedStaff('all')
    formsAPI.getSubmissions(selectedMonth).then((res) => {
      setSubmissions((res as { submissions: FormSubmission[] }).submissions ?? [])
      setLoading(false)
    }).catch(() => {
      setSubmissions([])
      setLoading(false)
    })
  }, [selectedMonth])

  const staffOptions = Array.from(new Set(submissions.map((s) => s.staff_email)))

  const filtered = selectedStaff === 'all'
    ? submissions
    : submissions.filter((s) => s.staff_email === selectedStaff)

  return (
    <div>
      <h1 className="text-3xl font-semibold text-navy mb-2">Staff Submissions</h1>
      <p className="text-gray mb-8">Monthly updates from your team.</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {MONTHS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMonth(m)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                selectedMonth === m ? 'bg-navy text-white' : 'text-gray hover:bg-slate-100'
              }`}
            >
              {MONTH_LABELS[m]}
            </button>
          ))}
        </div>

        {staffOptions.length > 1 && (
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-gray focus:outline-none focus:ring-2 focus:ring-blue"
          >
            <option value="all">All staff</option>
            {staffOptions.map((email) => {
              const name = submissions.find((s) => s.staff_email === email)?.staff_name ?? email
              return (
                <option key={email} value={email}>
                  {name}
                </option>
              )
            })}
          </select>
        )}
      </div>

      {loading ? (
        <p className="text-gray">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-gray">
            No submissions yet for {MONTH_LABELS[selectedMonth]}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((sub) => (
            <div key={sub.id} className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-navy">{sub.staff_name}</p>
                  <p className="text-sm text-gray">{sub.staff_email}</p>
                </div>
                <p className="text-sm text-gray">
                  {new Date(sub.submitted_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="space-y-4">
                {QUESTIONS.map(({ key, label }) => {
                  const answer = sub[key] as string
                  if (!answer) return null
                  return (
                    <div key={key}>
                      <p className="text-xs font-semibold text-gray uppercase tracking-wide mb-1.5">
                        {label}
                      </p>
                      <p className="text-sm text-gray-900 leading-relaxed">{answer}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
