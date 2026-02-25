'use client'

import { useEffect, useState } from 'react'
import { botAPI } from '@/lib/api'
import type { BotHistory as BotHistoryEntry } from '@/lib/supabase'

type StaffGroup = {
  staff_email: string
  staff_name: string
  total_questions: number
  last_question_at: string | null
  conversations: BotHistoryEntry[]
}

export function BotHistory() {
  const [staff, setStaff] = useState<StaffGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    botAPI.getAllHistory().then((res) => {
      setStaff((res as { staff: StaffGroup[] }).staff)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const toggle = (email: string) => {
    setExpanded((prev) => ({ ...prev, [email]: !prev[email] }))
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-semibold text-navy mb-2">Bot History</h1>
        <p className="text-gray">Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-navy mb-2">Bot History</h1>
      <p className="text-gray mb-8">Staff questions answered by the Team Bot while you&apos;re away.</p>

      {staff.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-gray">No bot activity yet. Staff questions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {staff.map((member) => (
            <div key={member.staff_email} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => toggle(member.staff_email)}
                className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-navy">{member.staff_name}</p>
                  <p className="text-sm text-gray mt-0.5">
                    {member.total_questions} question{member.total_questions !== 1 ? 's' : ''}
                    {member.last_question_at
                      ? ` · Last: ${new Date(member.last_question_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`
                      : ''}
                  </p>
                </div>
                <span className="text-gray text-sm">{expanded[member.staff_email] ? '▲' : '▼'}</span>
              </button>

              {expanded[member.staff_email] && (
                <div className="border-t border-slate-200 px-6 py-5 space-y-6">
                  {member.conversations.map((entry) => (
                    <div key={entry.id}>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs text-gray">
                          {new Date(entry.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      {/* Question */}
                      <div className="flex justify-end mb-3">
                        <div className="max-w-[80%] bg-blue text-white rounded-xl px-4 py-3 text-sm">
                          {entry.question}
                        </div>
                      </div>

                      {/* Answer */}
                      <div className="flex justify-start mb-2">
                        <div className="max-w-[80%] bg-slate-100 text-gray-900 rounded-xl px-4 py-3 text-sm">
                          {entry.answer}
                        </div>
                      </div>

                      {/* Sources */}
                      {entry.sources && entry.sources.length > 0 && (
                        <div className="ml-1 mt-1">
                          <p className="text-xs text-gray mb-1">Sources:</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.sources.map((src, i) => (
                              <span
                                key={i}
                                className="text-xs bg-lightblue text-navy px-2 py-0.5 rounded"
                              >
                                {src.source || `Chunk ${src.chunk_index}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
