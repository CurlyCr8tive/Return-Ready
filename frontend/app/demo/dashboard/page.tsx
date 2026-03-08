import {
  DevelopmentsSection,
  ImplicationsSection,
  CompaniesSection,
  JobsSection,
  FeaturedSection,
} from '@/components/dashboard/DigestSection'
import type { Digest } from '@/lib/api'

// ---------------------------------------------------------------------------
// Hardcoded demo digest — fictional org "TechBridge"
// No real client data. Safe to share publicly.
// ---------------------------------------------------------------------------
const DEMO_DIGEST: Digest = {
  id: 'demo',
  week_number: 1,
  week_start: '2026-03-02',
  week_end: '2026-03-08',
  generated_at: '2026-03-05T06:00:00Z',
  is_read: true,
  external_source_count: 11,
  slack_message_count: 0,

  week_summary:
    'The dominant theme this week was agentic AI crossing from research into real-world deployment. Anthropic acquired computer-use startup Vercept, Google shipped multi-step task automation via Gemini on Android, and Salesforce publicly defended its platform relevance against AI disruption narratives. Together these signals mark a structural shift: autonomous agents are no longer a future threat to the labor market — they are a present one, and the employers workforce-development graduates enter are already deciding how to respond.',

  ai_developments: [
    {
      headline: 'Anthropic Acquires Vercept to Accelerate Computer-Use Agents',
      synthesis:
        'Anthropic acquired Seattle-based Vercept, a startup that built agents capable of operating software applications the way a human would — navigating interfaces, completing tasks, and working across tools autonomously. The deal came after Meta poached one of Vercept\'s founders, underscoring how competitive the agentic talent market has become.',
      why_it_matters:
        'Computer-use agents — AI that can operate any software like a person with a laptop — represent one of the highest-leverage automation vectors in the near term. Anthropic is now acquiring infrastructure and talent to lead this category.',
      source: 'TechCrunch',
      url: 'https://techcrunch.com/2026/02/25/anthropic-acquires-vercept-ai-startup-agents-computer-use-founders-investors/',
    },
    {
      headline: 'Gemini on Android Can Now Automate Multi-Step Real-World Tasks',
      synthesis:
        'Google announced that Gemini on Android will handle multi-step agentic tasks — ordering an Uber, placing a DoorDash order — starting with Pixel 10 and Samsung Galaxy S26 devices. This is the first mass-market deployment of agentic AI on personal devices, putting autonomous task completion in the hands of hundreds of millions of consumers.',
      why_it_matters:
        'Consumer-facing AI agents crossing into everyday task automation marks a meaningful threshold — it normalizes the expectation that software should work for you, not require you to operate it, and accelerates how quickly employers will expect workers to think in agentic terms.',
      source: 'The Verge',
      url: 'https://www.theverge.com/tech/884210/google-gemini-samsung-s26-pixel-10-uber',
    },
    {
      headline: "Salesforce's Benioff Reframes AI Disruption as a 'SaaSpocalypse' — and Pushes Back",
      synthesis:
        "After solid year-end earnings, Salesforce CEO Marc Benioff argued that AI will not kill SaaS businesses — positioning Salesforce as evolving its platform to incorporate AI agents rather than being replaced by them. The framing itself is notable: a major enterprise software incumbent is actively managing the narrative of disruption.",
      why_it_matters:
        'When the CEO of a $200B+ enterprise software company dedicates earnings calls to countering disruption narratives, the disruption is real. The workforce entering tech this year will find employers mid-transition, and the ability to help organizations adapt is a durable skill.',
      source: 'TechCrunch',
      url: 'https://techcrunch.com/2026/02/25/salesforce-ceo-marc-benioff-this-isnt-our-first-saaspocalypse/',
    },
    {
      headline: 'Anthropic Executives Signal Belief That Claude May Have Some Form of Consciousness',
      synthesis:
        "In a public interview blitz, Anthropic executives articulated a consistent position: that Claude may be 'alive' in some meaningful sense, referencing the company's model constitution and its ethical commitments around Claude's nature. This reflects how Anthropic thinks about model welfare and governance as it scales.",
      why_it_matters:
        "Understanding how AI labs frame their models' nature is essential context for technical practitioners — it shapes the ethical guardrails built into AI systems, which in turn shapes what those systems will and won't do in agentic deployments.",
      source: 'The Verge',
      url: 'https://www.theverge.com/report/883769/anthropic-claude-conscious-alive-moral-patient-constitution',
    },
  ],

  slack_highlights: [],

  pursuit_implications: [
    {
      implication:
        'Computer-use agent fluency is now a teachable, in-demand skill — it belongs in technical curriculum this year, not next.',
      reasoning:
        "Anthropic's Vercept acquisition signals that computer-use agents will become a core capability in the tools graduates are expected to build with. Fellows who understand how to configure and prompt agents that operate software have a differentiated edge most bootcamp graduates won't have.",
      priority: 'HIGH',
    },
    {
      implication:
        "Google's Gemini-on-Android launch is the clearest consumer-facing proof that agentic AI is a present reality — use it as a teaching moment and work backward to the jobs it creates.",
      reasoning:
        'When millions of people start using AI agents for daily tasks, employers accelerate internal automation timelines. Graduates positioned to explain what\'s happening technically and help organizations build equivalent internal workflows will have a durable advantage.',
      priority: 'HIGH',
    },
    {
      implication:
        "Salesforce's aggressive defense of its platform relevance signals that Salesforce-adjacent roles are evolving, not disappearing — graduates with CRM fluency plus agentic AI skills are entering a high-demand intersection.",
      reasoning:
        'Salesforce is too embedded in enterprise operations to disappear, but it is clearly shifting what skills it values. Workforce programs should update placement prep to reflect this pairing of CRM literacy with AI-native thinking.',
      priority: 'MEDIUM',
    },
    {
      implication:
        'Health tech and fintech employers scaling AI tools are creating new mid-level roles that reward domain knowledge plus technical fluency — a direct opportunity for career changers.',
      reasoning:
        'Companies like Abridge (150+ health systems) and Zest AI (credit unions) are actively hiring implementation specialists and AI support roles that do not require clinical or finance degrees. These are accessible entry points for technically trained career changers.',
      priority: 'WATCH',
    },
  ],

  companies_to_watch: [
    {
      name: 'Abridge',
      industry: 'Health Tech',
      what_they_do:
        'Enterprise AI platform that transforms clinical conversations into structured medical documentation, integrated directly into EHR systems like Epic.',
      why_watch_now:
        'Named #1 Market Leader for Ambient AI in Revenue Cycle Management by KLAS Research for the second consecutive year. Now supports 150+ health systems and will cover 50M+ medical conversations in 2026.',
      pursuit_relevance:
        'Scaling across 150+ health systems means active hiring for implementation specialists and clinical AI support roles — accessible to technically trained career changers without clinical degrees.',
      url: 'https://www.abridge.com',
    },
    {
      name: 'Zest AI',
      industry: 'Fintech',
      what_they_do:
        'Lending technology company that uses machine learning to build fairer credit underwriting models for banks and credit unions, analyzing thousands of variables versus the 15–20 in traditional scoring.',
      why_watch_now:
        'Launched the CU Lending Collective in March 2026, a new AI lending tool for small credit unions, and showcased its Lulu AI lending platform at the 2026 Governmental Affairs Conference.',
      pursuit_relevance:
        'AI-driven credit underwriting is among the fastest-growing job categories in financial services — and these roles reward technical fluency plus financial domain knowledge.',
      url: 'https://www.zest.ai',
    },
    {
      name: 'Udemy',
      industry: 'Education',
      what_they_do:
        'Global online learning marketplace with 84M+ learners, now operating as an AI-powered skills acceleration platform for enterprise workforce development.',
      why_watch_now:
        'Actively rolling out AI-powered microlearning in 2026 — converting long-form courses into bite-sized, personalized, context-aware learning experiences deployable at enterprise scale.',
      pursuit_relevance:
        "Udemy's enterprise push signals growing demand for L&D specialists who understand AI-native learning design — a skills gap workforce development orgs are well-positioned to address.",
      url: 'https://www.udemy.com',
    },
    {
      name: 'Mississippi AI Innovation Hub',
      industry: 'Civic Tech',
      what_they_do:
        'State-level initiative pairing Mississippi ITS with universities and agencies to build AI proof-of-concept tools that address real government challenges.',
      why_watch_now:
        'Deployed Procurii — an AI chatbot built with a university student team that helps state procurement staff navigate policy in plain language — and is releasing it as open-source.',
      pursuit_relevance:
        'A direct model for AI workforce development in the public sector: government partnering with students to build real tools. The open-source release creates entry points for early-career technologists from nontraditional backgrounds.',
      url: 'https://www.govtech.com/artificial-intelligence/mississippi-ai-innovation-hubs-new-chatbot-targets-procurement',
    },
  ],

  jobs_and_hiring: {
    summary:
      'Agentic AI is reshaping hiring across industries this week — not by eliminating roles outright, but by creating a new tier of in-demand skills. The most sought-after candidates can build, configure, or manage AI agents that operate software autonomously, while also translating that capability into domain-specific contexts like health, finance, and government.',
    key_insights: [
      {
        insight:
          "Anthropic's Vercept acquisition signals that computer-use agent development is now the most competed-for skill set in AI — labs are acquiring startups specifically for this capability.",
        url: 'https://techcrunch.com/2026/02/25/anthropic-acquires-vercept-ai-startup-agents-computer-use-founders-investors/',
      },
      {
        insight:
          "Google's Gemini-on-Android rollout illustrates that roles centered on navigating apps or managing routine multi-step workflows face near-term automation pressure — career advisors should flag this.",
        url: 'https://www.theverge.com/tech/884210/google-gemini-samsung-s26-pixel-10-uber',
      },
      {
        insight:
          "Abridge's expansion to 150+ health systems and Zest AI's credit union push both reflect aggressive scaling in sectors where technically literate operations roles — not engineering — are the fastest-growing hire.",
        url: 'https://www.abridge.com',
      },
    ],
  },

  featured_resource: {
    title: "Salesforce CEO Marc Benioff: This isn't our first SaaSpocalypse",
    publication: 'TechCrunch',
    url: 'https://techcrunch.com/2026/02/25/salesforce-ceo-marc-benioff-this-isnt-our-first-saaspocalypse/',
    why_joanna:
      "Benioff's framing of AI disruption as transition rather than collapse — from an executive who has survived multiple such transitions — offers a grounded lens for thinking about how large employers adapt, which is exactly the environment workforce-development graduates are entering.",
    format: 'Article',
    read_time: '4 min',
  },

}

// ---------------------------------------------------------------------------

export default function DemoPage() {
  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-textprimary">
          Welcome Back, Marcus.
        </h1>
        <p className="text-sm text-textmuted mt-1">
          Your AI intel for the week — curated &amp; ready.
        </p>
      </div>

      {/* Week summary card */}
      <div className="mb-8 rounded-xl border border-border bg-navylight p-4 sm:p-6 md:p-8">
        <div className="mb-3 flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <span className="rounded-md border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs font-mono font-semibold text-gold">
            Week 1
          </span>
          <span className="text-xs font-mono text-textmuted"> · Mar 2 – Mar 8, 2026</span>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-textprimary sm:text-base md:text-lg">
          {DEMO_DIGEST.week_summary}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-textmuted">
          <span>{DEMO_DIGEST.external_source_count} sources</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Current Week', value: 'Week 1', sub: 'of 12' },
          { label: 'Digests Generated', value: '1', sub: 'All read' },
          { label: 'Next Digest', value: 'Mar 9', sub: 'Monday at 6am' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-navylight p-4">
            <p className="text-xs font-mono text-textmuted uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-xl font-display font-bold text-textprimary">{s.value}</p>
            <p className="text-xs text-textmuted mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Full digest */}
      <div className="space-y-10">
        <DevelopmentsSection items={DEMO_DIGEST.ai_developments} />

        {/* Implications — custom header to say TechBridge */}
        <section className="rounded-xl border border-gold/20 bg-gold/5 p-4 sm:p-5 md:p-6">
          <h2 className="mb-4 text-xs font-mono font-semibold uppercase tracking-widest text-gold sm:mb-5">
            Why This Matters for TechBridge
          </h2>
          <div className="space-y-5">
            {DEMO_DIGEST.pursuit_implications.map((imp, i) => (
              <div key={i} className="border-l-2 border-gold pl-4">
                <span className={`mb-1 block text-xs font-mono font-semibold ${
                  imp.priority === 'HIGH' ? 'text-red-400' :
                  imp.priority === 'MEDIUM' ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {imp.priority}
                </span>
                <p className="mb-1 text-base font-medium leading-snug text-textprimary sm:text-lg">{imp.implication}</p>
                <p className="text-sm leading-relaxed text-textmuted sm:text-base">{imp.reasoning}</p>
              </div>
            ))}
          </div>
        </section>

        <CompaniesSection items={DEMO_DIGEST.companies_to_watch} />
        <JobsSection data={DEMO_DIGEST.jobs_and_hiring} />
        <FeaturedSection data={DEMO_DIGEST.featured_resource} />
      </div>
    </div>
  )
}
