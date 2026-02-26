const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

async function fetchAPI<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    cache: 'no-store',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API ${response.status}: ${text}`)
  }

  return response.json() as Promise<T>
}

export type Digest = {
  id: string
  week_number: number
  week_start: string
  week_end: string
  week_summary: string
  ai_developments: Array<{
    headline: string
    synthesis: string
    why_it_matters: string
    source: string
    url: string | null
  }>
  slack_highlights: {
    placeholder: boolean
    message: string
  }
  pursuit_implications: Array<{
    implication: string
    reasoning: string
    priority: 'HIGH' | 'MEDIUM' | 'WATCH'
  }>
  companies_to_watch: Array<{
    name: string
    what_they_do: string
    why_watch_now: string
    pursuit_relevance: string
    url: string | null
  }>
  jobs_and_hiring: {
    summary: string
    key_insights: Array<{ insight: string; url: string | null }>
  }
  featured_resource: {
    title: string
    publication: string
    url: string | null
    why_joanna: string
    format: string
    read_time: string
  }
  external_source_count: number
  slack_message_count: number
  is_read: boolean
  generated_at: string
}

export type DigestListItem = {
  id: string
  week_number: number
  week_start: string
  week_end: string
  week_summary: string
  external_source_count: number
  is_read: boolean
  generated_at: string
}

export type DigestStats = {
  latest_week_number: number
  total_digests_generated: number
  total_unread: number
  last_generated: string | null
  next_digest: string
}

export type Settings = {
  id: string
  pursuit_context: string
  external_news_enabled: boolean
  email_enabled: boolean
  email_send_day: string
  email_send_time: string
  slack_connected: boolean
  slack_channel: string
  slack_last_synced: string | null
  updated_at: string
}

export const digestAPI = {
  getLatest: () => fetchAPI<{ digest: Digest | null }>('/digest/latest'),
  getAll: () => fetchAPI<{ digests: DigestListItem[] }>('/digest/all'),
  getStats: () => fetchAPI<DigestStats>('/digest/stats'),
  getById: (id: string) => fetchAPI<{ digest: Digest }>(`/digest/${id}`),
  generate: (weekStart?: string) =>
    fetchAPI<{ success: boolean; digest_id: string; week_number: number }>('/digest/generate', {
      method: 'POST',
      body: JSON.stringify(weekStart ? { week_start: weekStart } : {}),
    }),
}

export const settingsAPI = {
  get: () => fetchAPI<{ settings: Settings }>('/settings'),
  update: (payload: Partial<Settings>) =>
    fetchAPI<{ settings: Settings }>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  sendTestEmail: () => fetchAPI<{ success: boolean; email_id: string }>('/settings/send-test-email', { method: 'POST' }),
  getEmailLog: () =>
    fetchAPI<{ email_log: Array<{ id: string; week_number: number; subject: string; sent_to: string; sent_at: string; status: string }> }>(
      '/settings/email-log'
    ),
}
