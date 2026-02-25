import type { AIDigest, PersonSummary, TeamReport } from './api'

export const mockOverview = {
  latest_biweekly: { generated_at: '2026-02-21T14:20:00Z' },
  latest_monthly: { generated_at: '2026-02-01T13:10:00Z' },
  report_status: { biweekly_count: 6, monthly_count: 3 },
  people_tracked: 4,
}

export const mockBiweeklyReports: TeamReport[] = [
  {
    period_start: '2026-02-08',
    period_end: '2026-02-21',
    report_type: 'biweekly',
    sections: {
      biweekly_snapshot: 'Attendance and admissions held steady; volunteer activity dipped slightly in week two.',
      kpi_highlights_by_person: {
        Stef: 'Pathfinder usage +12%; jobs placements stable.',
        Greg: 'Volunteer pipeline slowed after one partner pause.',
        Afiya: 'L1 cohort retention improved week-over-week.',
        Francis: 'Admissions conversion up 4 points.',
      },
      patterns_and_trends: 'L3+ progression improved where attendance support was active.',
      risks_and_flags: 'Volunteer backlog may impact April events if unresolved.',
      wins: 'Community development events exceeded attendance targets.',
    },
    generated_at: '2026-02-21T14:20:00Z',
  },
  {
    period_start: '2026-01-25',
    period_end: '2026-02-07',
    report_type: 'biweekly',
    sections: {
      biweekly_snapshot: 'Core KPIs stable with stronger admissions momentum.',
      kpi_highlights_by_person: { Stef: 'L3+ up 2 learners', Francis: 'Admissions +9%' },
      patterns_and_trends: 'Job outcomes correlating with higher pathfinder completion.',
      risks_and_flags: 'One partner response delay on hiring cohort.',
      wins: 'Strong start to month across team reporting.',
    },
    generated_at: '2026-02-07T14:20:00Z',
  },
]

export const mockMonthlyReports: TeamReport[] = [
  {
    period_start: '2026-02-01',
    period_end: '2026-02-28',
    report_type: 'monthly',
    month: 2,
    year: 2026,
    sections: {
      month_in_summary: 'February was operationally stable with moderate growth in admissions and learner progression.',
      kpi_performance_by_person: {
        Stef: 'Attendance stable; pathfinder and L3+ up.',
        Greg: 'Volunteer volume down; quality of placements steady.',
        Afiya: 'Cohort completion improved.',
        Francis: 'Admissions and community output rose.',
      },
      what_improved: 'L1-to-L3 progression and admissions conversion.',
      what_needs_attention: 'Volunteer pipeline continuity and one delayed employer partner.',
      heading_into_next_month: 'Protect gains in progression while rebuilding volunteer funnel.',
    },
    generated_at: '2026-03-01T08:00:00Z',
  },
]

export const mockPeople: PersonSummary[] = [
  {
    person: 'Stef',
    kpi_trend: [
      { week_start: '2026-02-03', kpi_name: 'attendance', kpi_value: 92 },
      { week_start: '2026-02-10', kpi_name: 'pathfinder use', kpi_value: 78 },
      { week_start: '2026-02-17', kpi_name: 'L3+', kpi_value: 31 },
    ],
    flags: [{ week_start: '2026-02-10', flag: 'Two learners at risk of dropping.' }],
    reported_items: [{ week_start: '2026-02-17', notes: 'Weekly coaching cadence improved follow-through.' }],
  },
  {
    person: 'Greg',
    kpi_trend: [
      { week_start: '2026-02-03', kpi_name: 'volunteers', kpi_value: 41 },
      { week_start: '2026-02-10', kpi_name: 'volunteers', kpi_value: 37 },
    ],
    flags: [{ week_start: '2026-02-10', flag: 'Partner pause reduced volunteer intake.' }],
    reported_items: [{ week_start: '2026-02-10', notes: 'Outreach sprint planned to recover pipeline.' }],
  },
]

export const mockDigests: AIDigest[] = [
  {
    week_start: '2026-02-16',
    week_end: '2026-02-22',
    sections: {
      top_developments: [
        {
          headline: 'Major model vendors launched faster enterprise APIs',
          description:
            'Two providers announced lower-latency endpoints designed for workflow tools. This improves real-time assistant experiences and reduces response delays.',
          url: 'https://example.com/ai-workforce-report',
        },
        {
          headline: 'AI hiring rose for operations and workflow roles',
          description:
            'Companies increased postings focused on applied AI in business operations. Demand is shifting from research-heavy roles to practical implementation roles.',
          url: 'https://example.com/ai-hiring-trends',
        },
        {
          headline: 'Workforce organizations expanded AI coaching pilots',
          description:
            'Several organizations announced AI-enabled learner support pilots. Early programs emphasize human-in-the-loop coaching and measurable completion outcomes.',
          url: 'https://example.com/ai-coaching-pilots',
        },
      ],
      funding_snapshot: {
        top_rounds: [
          'Adept raised a late-stage round for enterprise workflow agents.',
          'Perplexity closed additional growth funding tied to product expansion.',
          'Two vertical AI startups secured Series A rounds in healthcare and legal operations.',
        ],
        sectors: [
          'Enterprise copilots',
          'Workflow automation',
          'Vertical AI SaaS',
        ],
        market_direction: [
          'Investors are prioritizing products with clear enterprise adoption and near-term revenue.',
          'Capital is shifting from generalized AI hype toward applied, workflow-specific platforms.',
        ],
        url: 'https://example.com/ai-funding-weekly',
      },
      market_direction_signals: [
        'Enterprise AI spending is moving toward operational efficiency tools with measurable outcomes.',
        'Teams are consolidating around fewer, higher-trust AI vendors for core workflow integrations.',
      ],
      digest_meta: {
        sources_analyzed: 18,
        reading_time_min: 4,
      },
      what_happened_this_week: [
        'Two major model providers released lower-latency enterprise APIs.',
        'AI hiring demand rose in operations + data workflow roles.',
        'More workforce orgs announced AI-enabled coaching pilots.',
      ],
      what_it_means_for_pursuit: 'Opportunity to expand AI-readiness training for career services and learner support teams.',
      who_is_hiring_in_ai: ['ServiceNow', 'Datadog', 'Scale AI'],
      companies_to_watch: ['Anthropic', 'Perplexity', 'Cognition'],
      one_thing_to_read: { title: 'State of Applied AI in Workforce Development', url: 'https://example.com/ai-workforce-report' },
    },
    source_links: ['https://example.com/ai-workforce-report', 'https://example.com/ai-hiring-trends'],
    generated_at: '2026-02-22T17:00:00Z',
  },
]

export const mockDocuments = [
  { owner_name: 'Stef', title: 'Stef Weekly KPI', source_type: 'google_docs' },
  { owner_name: 'Greg', title: 'Volunteer Tracker Standup', source_type: 'google_sheets' },
  { owner_name: 'Afiya', title: 'L1 Cohort Weekly', source_type: 'google_docs' },
  { owner_name: 'Francis', title: 'Admissions + Community KPI', source_type: 'google_docs' },
]
