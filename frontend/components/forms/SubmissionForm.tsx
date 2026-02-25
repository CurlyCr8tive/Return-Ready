'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { formsAPI } from '@/lib/api'

const QUESTIONS = [
  {
    id: 'q1_important',
    label: 'What were the most important things that happened this month?',
    placeholder: 'Key events, milestones, major developments...',
  },
  {
    id: 'q2_decisions',
    label: 'What decisions were made, or still need to be made?',
    placeholder: 'Decisions taken, pending approvals, items on hold...',
  },
  {
    id: 'q3_risks',
    label: 'What risks or problems should Joanna know about?',
    placeholder: 'Issues, blockers, concerns, anything that needs attention...',
  },
  {
    id: 'q4_wins',
    label: 'What wins or positive developments happened this month?',
    placeholder: 'Team wins, project successes, positive feedback...',
  },
  {
    id: 'q5_external',
    label: 'Any external relationships, clients, or partners to flag?',
    placeholder: 'Client updates, partner conversations, vendor issues...',
  },
  {
    id: 'q6_team_health',
    label: 'How is the team doing? Any morale, culture, or HR items?',
    placeholder: 'Team dynamics, workload balance, anything people-related...',
  },
  {
    id: 'q7_first_week',
    label: "What's the most important thing for Joanna to address in her first week back?",
    placeholder: 'Top priority action, decision, or conversation she should have...',
  },
]

type FormData = {
  q1_important: string
  q2_decisions: string
  q3_risks: string
  q4_wins: string
  q5_external: string
  q6_team_health: string
  q7_first_week: string
}

const EMPTY: FormData = {
  q1_important: '',
  q2_decisions: '',
  q3_risks: '',
  q4_wins: '',
  q5_external: '',
  q6_team_health: '',
  q7_first_week: '',
}

export function SubmissionForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [formData, setFormData] = useState<FormData>(EMPTY)
  const [staffName, setStaffName] = useState('')
  const [month, setMonth] = useState('')
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'already_submitted' | 'submitted'>('loading')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      return
    }

    formsAPI.validate(token).then((res) => {
      if (!res.valid) {
        setStatus('invalid')
        return
      }
      if (res.already_submitted) {
        setStatus('already_submitted')
        return
      }
      setStaffName(res.staff_name)
      setMonth(res.month)
      setStatus('valid')
    }).catch(() => setStatus('invalid'))
  }, [token])

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {}
    for (const q of QUESTIONS) {
      const val = formData[q.id as keyof FormData]
      if (!val || val.trim().length < 10) {
        newErrors[q.id as keyof FormData] = 'Please provide at least 10 characters.'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await formsAPI.submit({ token, staff_name: staffName, ...formData })
      setStatus('submitted')
    } catch {
      alert('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading') {
    return <p className="text-gray text-center py-12">Validating your link...</p>
  }

  if (status === 'invalid') {
    return (
      <div className="text-center py-12">
        <p className="text-xl font-semibold text-navy mb-2">This link has expired</p>
        <p className="text-gray text-sm">Please contact Joanna&apos;s team for a new form link.</p>
      </div>
    )
  }

  if (status === 'already_submitted') {
    return (
      <div className="text-center py-12">
        <p className="text-xl font-semibold text-navy mb-2">Already submitted</p>
        <p className="text-gray text-sm">
          You&apos;ve already sent your update for {month}. Thank you!
        </p>
      </div>
    )
  }

  if (status === 'submitted') {
    return (
      <div className="text-center py-12">
        <p className="text-xl font-semibold text-navy mb-2">
          Thank you, {staffName}.
        </p>
        <p className="text-gray">Joanna will see this when she&apos;s back.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-navy">
          {month.charAt(0).toUpperCase() + month.slice(1)} Update
        </h1>
        <p className="text-gray mt-1 text-sm">
          Hi {staffName} — please fill in your monthly update for Joanna.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {QUESTIONS.map((q, idx) => (
          <div key={q.id}>
            <label className="block text-sm font-medium text-navy mb-2">
              <span className="text-gray mr-2">{idx + 1}.</span>
              {q.label}
            </label>
            <textarea
              value={formData[q.id as keyof FormData]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
              placeholder={q.placeholder}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border text-sm text-gray-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue resize-none ${
                errors[q.id as keyof FormData]
                  ? 'border-red-400'
                  : 'border-slate-200'
              }`}
            />
            {errors[q.id as keyof FormData] && (
              <p className="text-xs text-red-500 mt-1">{errors[q.id as keyof FormData]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue text-white rounded-lg font-medium text-sm disabled:opacity-50 hover:bg-navy transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Update'}
        </button>
      </form>
    </div>
  )
}
