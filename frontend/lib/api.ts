const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

async function fetchAPI<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
    cache: 'no-store',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API ${response.status}: ${text}`)
  }

  return response.json() as Promise<T>
}

export type TeamReport = {
  id?: string
  period_start: string
  period_end: string
  report_type: 'biweekly' | 'monthly'
  month?: number
  year?: number
  sections: Record<string, unknown>
  generated_at: string
}

export type PersonSummary = {
  person: string
  kpi_trend: Array<{ week_start: string; kpi_name: string; kpi_value: string | number | null }>
  flags: Array<{ week_start: string; flag: string }>
  reported_items: Array<{ week_start: string; notes: string }>
}

export type AIDigest = {
  id?: string
  week_start: string
  week_end: string
  sections: Record<string, unknown>
  source_links: string[]
  generated_at: string
}

export const dashboardAPI = {
  getOverview: () => fetchAPI<{
    latest_biweekly: TeamReport | null
    latest_monthly: TeamReport | null
    report_status: { biweekly_count: number; monthly_count: number }
    people_tracked: number
  }>('/team-intel/overview'),

  getBiweekly: () => fetchAPI<{ reports: TeamReport[] }>('/team-intel/biweekly'),
  generateBiweekly: () =>
    fetchAPI<TeamReport>('/team-intel/biweekly/generate', { method: 'POST' }),

  getMonthly: () => fetchAPI<{ reports: TeamReport[] }>('/team-intel/monthly'),
  generateMonthly: () =>
    fetchAPI<TeamReport>('/team-intel/monthly/generate', { method: 'POST' }),

  getByPerson: () => fetchAPI<{ people: PersonSummary[] }>('/team-intel/by-person'),

  runDataPull: () => fetchAPI<Record<string, unknown>>('/team-intel/pull/run', { method: 'POST' }),
}

export const aiDigestAPI = {
  list: () => fetchAPI<{ digests: AIDigest[] }>('/ai-digest/'),
  generate: () => fetchAPI<AIDigest>('/ai-digest/generate', { method: 'POST' }),
}

export const settingsAPI = {
  listDocuments: () =>
    fetchAPI<{ documents: Array<Record<string, unknown>> }>('/settings/documents'),

  upsertDocument: (payload: {
    owner_name: string
    source_type: string
    doc_type: string
    doc_id: string
    title: string
    active?: boolean
    management_tier?: boolean
  }) =>
    fetchAPI<{ document: Record<string, unknown> }>('/settings/documents', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getManagement: () =>
    fetchAPI<{ management_tier_enabled: boolean; management_google_connected: boolean }>(
      '/settings/management'
    ),

  toggleManagement: (enabled: boolean) =>
    fetchAPI<{ management_tier_enabled: boolean }>('/settings/management/toggle', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    }),
}

// Legacy API adapters kept to avoid breaking existing staff-side screens
// while the product pivots to the Joanna dashboard model.
export const formsAPI = {
  validate: async (_token: string) => ({
    valid: false,
    already_submitted: false,
    staff_email: '',
    staff_name: '',
    month: '',
    year: new Date().getFullYear(),
  }),
  submit: async (_data?: unknown) => ({ success: false, message: 'Forms workflow deprecated in this pivot.' }),
  sendForms: async (_month?: string) => ({ sent: [], errors: [], total: 0 }),
  getSubmissions: async (_month?: string, _year?: number) => ({ submissions: [], count: 0 }),
  getStatus: async (_month?: string, _year?: number) => ({
    month: '',
    year: new Date().getFullYear(),
    total: 0,
    submission_count: 0,
    submitted: [],
    pending: [],
  }),
}

export const synthesisAPI = {
  generate: async (_month: string) => ({}),
  getReport: async (_month: string, _year?: number) => ({}),
  getStatus: async (_year?: number) => ({ year: new Date().getFullYear(), statuses: {} as Record<string, unknown> }),
}

export const botAPI = {
  askTeam: async (_question?: string, _staffEmail?: string, _staffName?: string) => ({
    answer: 'Team bot has moved to the new dashboard roadmap.',
    sources: [],
  }),
  getAllHistory: async () => ({ staff: [] }),
  getStaffHistory: async (_staffEmail?: string) => ({ history: [], total: 0 }),
}
