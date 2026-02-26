import type { Digest, DigestListItem, DigestStats } from './api'

// Replace this with real data once the scraper is running.
// Pages fall back to this when the backend returns null or is unreachable.

export const MOCK_DIGEST: Digest = {
  id: 'mock-week-1',
  week_number: 1,
  week_start: '2025-03-03',
  week_end: '2025-03-09',
  week_summary:
    'OpenAI\'s GPT-4.5 launch dominated headlines alongside a wave of AI hiring announcements from enterprise software companies. The clearest thread across the week: AI is moving decisively from experiment to infrastructure, and organizations that haven\'t yet defined their AI skills strategy are now visibly behind.',

  ai_developments: [
    {
      headline: 'OpenAI Releases GPT-4.5 with Improved Reasoning and Instruction-Following',
      synthesis:
        'OpenAI shipped GPT-4.5 with significantly better instruction-following, reduced hallucination rates, and a new "structured output" mode that returns reliable JSON. The model is available via API immediately and in ChatGPT Enterprise within days. Early benchmarks show 30% improvement on complex multi-step reasoning tasks compared to GPT-4o.',
      why_it_matters:
        'This is the model that will power the next generation of AI-assisted workflows inside companies. Developers building on GPT-4 will upgrade quickly — anything your fellows build or maintain using OpenAI will likely need to be tested against this version.',
      source: 'OpenAI Blog',
      url: 'https://openai.com/blog',
    },
    {
      headline: 'Anthropic Expands Claude for Education with New Classroom Tools',
      synthesis:
        'Anthropic launched Claude for Education, a suite of tools designed for universities and training programs. Features include citation-aware responses, assignment scaffolding, and a "teach-back" mode where Claude asks learners to explain concepts rather than just answering. Columbia and NYU are among the first institutional partners.',
      why_it_matters:
        'This is directly relevant to workforce training organizations. The "teach-back" modality is exactly the kind of pedagogy Pursuit already uses in cohort settings — AI tools that reinforce learning rather than shortcutting it.',
      source: 'TechCrunch',
      url: 'https://techcrunch.com',
    },
    {
      headline: 'Google Announces AI-Powered Job Matching Integration in Google for Jobs',
      synthesis:
        'Google is rolling out semantic job matching inside Google for Jobs, using AI to surface positions based on demonstrated skills rather than keyword matching. The update also adds "skills gap" labels that show job seekers which listed requirements they\'re most likely to develop quickly. US rollout starts this month.',
      why_it_matters:
        'This changes how Pursuit fellows will find jobs. Skills-based matching advantages candidates with project portfolios over keyword-heavy resumes — which is Pursuit\'s model. Worth briefing the placement team before they update job-search coaching materials.',
      source: 'Google Blog',
      url: 'https://blog.google',
    },
    {
      headline: 'Salesforce Reports 40% of New Hires in 2025 Will Have AI Specialist Roles',
      synthesis:
        'In its annual workforce report, Salesforce projected that 40% of its 2025 hiring will be for AI-specific roles — including AI trainers, prompt engineers, and AI QA specialists — up from 12% in 2023. The company also announced a $500M internal reskilling program for existing employees.',
      why_it_matters:
        'Salesforce is a marquee employer in Pursuit\'s network. A 40% shift toward AI roles signals that the skills we\'re training fellows on are on the right path — but the curriculum may need to emphasize AI-adjacent roles (QA, training, evaluation) alongside pure engineering.',
      source: 'Salesforce Newsroom',
      url: null,
    },
  ],

  slack_highlights: {
    placeholder: true,
    message: 'Slack integration coming soon — your team\'s #ai channel will appear here.',
  },

  pursuit_implications: [
    {
      implication:
        'Update the AI Tools module to include Claude for Education and GPT-4.5 structured outputs — fellows building in these environments will encounter both within 90 days.',
      reasoning:
        'Both releases are production-grade tools that employers are already integrating. Fellows who can work with structured outputs and AI-assisted learning environments will be more competitive at placement.',
      priority: 'HIGH',
    },
    {
      implication:
        'Brief the placement team on Google\'s skills-based job matching update before the next cohort job search sprint.',
      reasoning:
        'Skills-first matching directly advantages Pursuit graduates whose portfolios demonstrate applied competencies. Placement coaches should update job-search guidance to leverage project descriptions over resume keyword stuffing.',
      priority: 'HIGH',
    },
    {
      implication:
        'Add AI QA and AI trainer roles to Salesforce employer pipeline conversations this quarter.',
      reasoning:
        'Salesforce\'s 40% AI hiring projection includes roles that don\'t require senior engineering experience. These entry and mid-level AI-adjacent positions are a strong fit for Pursuit fellows at 6-12 months post-placement.',
      priority: 'MEDIUM',
    },
    {
      implication:
        'Monitor Anthropic\'s Education product for possible partnership or pilot program opportunity.',
      reasoning:
        'Anthropic is actively seeking institutional training partners. Pursuit\'s model — project-based, cohort learning for underrepresented adults — is a strong narrative fit for their education mission.',
      priority: 'WATCH',
    },
  ],

  companies_to_watch: [
    {
      name: 'Mistral AI',
      what_they_do: 'European AI lab building open-weight language models',
      why_watch_now: 'Released Mistral Large 2 this week — competitive with GPT-4o at lower cost, with stronger multilingual support',
      pursuit_relevance: 'Open-weight models matter for orgs training on proprietary data; strong multilingual models serve diverse learner populations',
    },
    {
      name: 'Coursera',
      what_they_do: 'Online learning platform with 148M registered learners',
      why_watch_now: 'Announced AI Skills Index and new employer-sponsored AI credential tracks for workforce programs',
      pursuit_relevance: 'Coursera is positioning as the default for employer-sponsored upskilling — a potential partner or competitor in the workforce development AI training space',
    },
    {
      name: 'Pave',
      what_they_do: 'Compensation benchmarking and planning software for HR teams',
      why_watch_now: 'Raised $110M Series C; adding AI-powered pay equity analysis and bias detection to their platform',
      pursuit_relevance: 'Tools that surface pay equity issues are relevant to Pursuit\'s employer partnerships and could support fellow salary negotiation coaching',
    },
  ],

  jobs_and_hiring: {
    summary:
      'AI hiring activity was strong across enterprise software, fintech, and education technology this week. Demand is split between deep technical roles (ML engineers, AI researchers) and a fast-growing tier of AI-adjacent roles: prompt engineers, AI content reviewers, model trainers, and AI product managers. The latter category is increasingly accessible to bootcamp graduates.',
    key_insights: [
      'Microsoft posted 340 AI-related roles this week, heaviest in Azure AI and Copilot product teams — mostly mid-level, 3-5 years experience',
      'Duolingo, Khan Academy, and Chegg are all hiring AI curriculum specialists — roles that blend teaching background with basic prompting skills',
      'Two Pursuit alumni employers (Peloton, Etsy) posted AI QA roles this week — flag for placement team to surface to recent graduates',
      'Median salary for "AI Engineer" titles in NYC rose to $178K according to Levels.fyi data published this week',
    ],
  },

  featured_resource: {
    title: 'The Workforce Disruption Playbook: How Leading Nonprofits Are Responding to AI',
    publication: 'Brookings Institution',
    url: 'https://brookings.edu',
    why_joanna: 'Directly benchmarks workforce development organizations on AI curriculum integration — Pursuit is cited in the report as a model for project-based AI training.',
    format: 'Report',
    read_time: '14 min',
  },

  external_source_count: 12,
  slack_message_count: 0,
  is_read: false,
  generated_at: '2025-03-03T07:42:00Z',
}

export const MOCK_DIGEST_LIST: DigestListItem[] = [
  {
    id: 'mock-week-1',
    week_number: 1,
    week_start: '2025-03-03',
    week_end: '2025-03-09',
    week_summary: MOCK_DIGEST.week_summary,
    external_source_count: 12,
    is_read: false,
    generated_at: '2025-03-03T07:42:00Z',
  },
  {
    id: 'mock-week-0b',
    week_number: 2,
    week_start: '2025-03-10',
    week_end: '2025-03-16',
    week_summary:
      'Meta\'s open-source Llama 4 release set off a new round of competition in the AI model market. Meanwhile, the White House issued updated AI workplace guidance affecting federal contractors — relevant to Pursuit\'s public-sector employer relationships.',
    external_source_count: 9,
    is_read: true,
    generated_at: '2025-03-10T07:38:00Z',
  },
  {
    id: 'mock-week-0c',
    week_number: 3,
    week_start: '2025-03-17',
    week_end: '2025-03-23',
    week_summary:
      'A quiet week in model releases, but a loud one in regulation: the EU AI Act\'s first compliance deadlines hit, affecting any US company with EU operations. Three Pursuit employer partners are on the affected list.',
    external_source_count: 7,
    is_read: true,
    generated_at: '2025-03-17T07:51:00Z',
  },
]

export const MOCK_STATS: DigestStats = {
  latest_week_number: 1,
  total_digests_generated: 3,
  total_unread: 1,
  last_generated: '2025-03-03T07:42:00Z',
  next_digest: '2025-03-24',
}
