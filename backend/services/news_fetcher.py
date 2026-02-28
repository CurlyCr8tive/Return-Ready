import anthropic
import json
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

# Path where the scraper drops its output
SCRAPED_DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "scraped_articles.json"

# ── Scraper selection: developments, jobs, featured resource only ────────────
# Companies to Watch is always fetched via web search (see COMPANIES_FETCH_PROMPT).

SCRAPER_SELECTION_PROMPT = """
You are selecting and structuring AI news for Joanna Patterson,
COO of Pursuit — a nonprofit that trains adults for tech careers in NYC.

ABOUT PURSUIT AND JOANNA'S CONTEXT:
Pursuit has a direct partnership with Anthropic. Staff are being trained
as Claude experts, and Pursuit is rolling out a Builders program to help
fellows become AI-native developers. Pursuit received $50K in Claude API
credits and is a partner of the AI Justice Initiative (AIJI). The tools
in active use are Claude Code (CLI) and Claude Cowork. Joanna is focused
on how AI agents are reshaping the economy and what it means for
underrepresented adults entering the tech workforce.

PRIORITY COVERAGE — always prefer articles on these topics when present:
- Anthropic and Claude news (model releases, Claude Code, Claude Cowork,
  API updates, safety research) — HIGH PRIORITY given direct partnership
- AI coding agents and developer tools (Claude Code, Cursor, Windsurf)
  — directly relevant to Pursuit's Builders program
- Economic impact of AI agents on jobs and the workforce
  (speed of adoption, which roles are affected, earning power)
- AI Justice Initiative (AIJI) and nonprofit AI credit/grant programs
- AI tools for nonprofits and economic mobility programs
- "80% of apps will disappear" / startup disruption themes
  relevant to career counseling and program design

Below is a list of articles scraped this week from AI news sources.
Select only the most relevant and impactful items for a workforce
development leader. Skip anything that is not genuinely AI-related
or that is too technical/niche to matter to this audience.

SCRAPED ARTICLES:
{articles}

Select and return:

1. TOP AI DEVELOPMENTS (3-5 items)
   Product launches, research breakthroughs, policy changes,
   major company moves. Real-world impact only — no hype.
   Prioritize Anthropic/Claude news and AI agent developments.
   Use the article's actual URL exactly as provided.

2. JOBS & SKILLS (2-3 items)
   How are companies across industries starting to use AI?
   Which tech and AI-forward roles are growing?
   What skills are in demand — across all industries, not just tech?
   Focus on adoption trends, role shifts, and what skills lead
   to economic mobility right now.
   Use the article's actual URL exactly as provided.

3. ONE FEATURED RESOURCE
   Single best article from the list for a COO
   thinking about AI's impact on workforce development.
   Prefer pieces with strong leadership or economic framing
   (e.g. Ezra Klein style analysis, YC founder perspectives).
   Use the article's actual URL exactly as provided.

IMPORTANT: Copy URLs exactly from the scraped data.
Do not modify, shorten, or reconstruct any URL.

Return as JSON only. No markdown. No preamble.

{{
  "developments": [
    {{
      "headline": "Specific headline",
      "what_happened": "2-3 sentences from the article summary",
      "why_it_matters": "1-2 sentences. Real-world significance.",
      "source": "Publication name",
      "url": "Exact URL from scraped data"
    }}
  ],
  "jobs_and_hiring": [
    {{
      "insight": "Specific observation about AI adoption, job trends, or in-demand skills",
      "source": "Publication name",
      "url": "Exact URL from scraped data for this item, or null"
    }}
  ],
  "featured_resource": {{
    "title": "Full title from scraped data",
    "publication": "Source name",
    "url": "Exact URL from scraped data",
    "what_its_about": "2 sentences",
    "why_read": "1 sentence — specific to workforce development",
    "format": "Article",
    "estimated_time": "3 min"
  }}
}}
"""

# ── Companies to Watch: always web search, cross-industry AI adoption ────────

COMPANIES_FETCH_PROMPT = """
Search the web for 3 to 4 companies across different industries that are
meaningfully adopting or deploying AI in the past 7 days. This is for
Joanna Patterson, COO of Pursuit — a nonprofit training underrepresented
adults for tech careers.

DO NOT include Anthropic, OpenAI, Google, Apple, Microsoft, Meta, Amazon,
Salesforce, or any major AI/Big Tech platform company. Those are covered
elsewhere and Joanna already tracks them. Surface companies from non-tech
industries — or smaller, less-obvious companies — integrating AI in
notable ways.

PRIORITY SECTORS — aim to cover at least 3 different sectors:
- Education and edtech (AI tutors, adaptive learning, credentialing)
- Health Tech (clinical AI, diagnostics, patient tools)
- Civic Tech and government (city/state/federal AI deployments)
- Fintech (lending, banking, fraud detection, economic access)
- Climate Tech (energy, sustainability, environmental monitoring)
- Cybersecurity (AI-powered threat detection, compliance)
- Nonprofit and social sector (workforce training, community orgs
  receiving AI funding or adopting AI tools)
- Media and Creative Industries (newsrooms, studios, content platforms)

You MUST return at least 3 companies. Search across multiple sectors.
For each company, find a direct article about what they announced or did
this week — not a profile page, not their homepage.

CRITICAL URL RULE:
Return the direct permalink to the specific news article, not a homepage
or roundup. If you cannot find a direct article URL, set url to null.

Return as JSON only. No markdown. No preamble.

{
  "companies_to_watch": [
    {
      "name": "Company name",
      "industry": "One of the sectors above",
      "what_they_do": "One sentence — what the company does overall",
      "why_watch_now": "What they announced or did with AI this week",
      "relevance": "Why this matters for workforce development or economic mobility",
      "url": "Direct article permalink or null"
    }
  ]
}
"""

# ── Scraper backup for companies (used when web search returns < 2) ───────────

COMPANIES_SCRAPER_BACKUP_PROMPT = """
From the scraped articles below, identify 2 to 4 companies that are
meaningfully implementing or adopting AI. Focus on companies from
non-tech industries. Do NOT include Google, Apple, Microsoft, Meta,
Amazon, OpenAI, Anthropic, or Salesforce.

Target sectors: Education, Health Tech, Fintech, Civic Tech,
Climate Tech, Cybersecurity, Nonprofit, Media, or any non-tech industry.

SCRAPED ARTICLES:
{articles}

Return only companies where there is a clear, specific article about
their AI work. Use the exact URL from the scraped data.

Return as JSON only. No markdown. No preamble.

{{
  "companies_to_watch": [
    {{
      "name": "Company name",
      "industry": "Sector",
      "what_they_do": "One sentence",
      "why_watch_now": "What they did or announced with AI",
      "relevance": "Why this matters for workforce development or economic mobility",
      "url": "Exact URL from scraped data or null"
    }}
  ]
}}
"""

# ── Full web search fallback (used when no scraped data exists) ──────────────

NEWS_FETCH_PROMPT = """
Search the web for the most important AI news
and developments from the past 7 days.

AUDIENCE CONTEXT:
This digest is for Joanna Patterson, COO of Pursuit — a nonprofit
in NYC that trains underrepresented adults for tech careers.
Pursuit has a direct partnership with Anthropic, $50K in Claude API
credits, and is launching a Builders program to train fellows as
AI-native developers using Claude Code. Pursuit is also partnered
with the AI Justice Initiative (AIJI). Joanna needs to understand
how AI agents are reshaping the economy, what it means for the
workforce, and which tools and trends matter for her programs.

PRIORITY TOPICS — always search for and include when credible news exists:
- Anthropic and Claude (Claude Code, Claude Cowork, model releases,
  API changes, safety research) — HIGH PRIORITY, direct partnership
- AI coding agents and developer tools (Claude Code, Cursor, Windsurf,
  Replit, GitHub Copilot) — relevant to Builders program
- Economic impact of AI agents on the workforce: which jobs are
  affected, speed of adoption, earning power, economic mobility
- AI Justice Initiative (AIJI) and nonprofit AI programs/grants
- AI tools for nonprofits, education, and workforce development orgs
- Startup disruption: "80% of apps will disappear" / app layer collapse
  themes relevant to career counseling
- Policy: AI regulation, executive orders, federal investment in AI

Coverage guidance:
- Always include at least 1 Anthropic or Claude item if published this week.
- Always include at least 1 item on AI's economic impact on jobs/workforce.
- Include nonprofit funding or AI grant news if credible coverage exists.
- Do not fabricate coverage. If a topic has no meaningful update, skip it.

Find and return:

1. TOP AI DEVELOPMENTS (3-5 items)
   Product launches, research breakthroughs,
   policy changes, major company moves.
   Real-world impact only — no hype.
   Lead with Anthropic/Claude news if available this week.

2. COMPANIES TO WATCH (3-4 items)
   Companies OUTSIDE the core AI/Big Tech sphere that are meaningfully
   adopting AI this week. Do NOT include Google, Apple, Microsoft, Meta,
   Amazon, OpenAI, or Anthropic — Joanna already tracks these.
   Focus on non-tech industries or smaller, less-obvious companies:
   - Education (AI tutors, adaptive learning)
   - Health Tech (clinical AI, diagnostics)
   - Civic Tech / government deployments
   - Fintech (lending, banking, fraud detection)
   - Climate Tech
   - Cybersecurity
   - Nonprofit / social sector (workforce orgs, AI grants)
   - Media and Creative Industries
   For each company, note what they did with AI this week and
   why it matters for economic mobility or workforce development.

3. JOBS & SKILLS (2-3 items)
   How are companies across industries starting to use AI?
   Which tech and AI-forward roles are growing or emerging?
   What skills are in demand across all industries, not just tech?
   Focus on adoption trends, role shifts, and what skills create
   economic mobility for adults entering or re-entering tech careers.

4. ONE FEATURED RESOURCE
   Single best article, report, or video published this week.
   Prefer strong leadership or economic framing —
   e.g. Ezra Klein style workforce analysis, YC founder perspectives
   on AI agents, or Anthropic product deep-dives.
   Practical and relevant to a COO thinking about AI's impact.

CRITICAL URL RULE:
For every item that has a URL, you MUST search
for and return the direct permalink to that
specific article — not a homepage, not a
roundup page, not a search result page.

For example:
  WRONG: https://techcrunch.com
  WRONG: https://venturebeat.com/ai/
  WRONG: https://example.com/weekly-roundup/
  RIGHT: https://techcrunch.com/2026/02/20/anthropic-launches-claude-code-security/

If you cannot find the direct article URL,
set the url field to null.
Never return a URL that points to a page
containing multiple articles.

Return as JSON only. No markdown. No preamble.

{
  "developments": [
    {
      "headline": "Specific headline",
      "what_happened": "2-3 sentences",
      "why_it_matters": "1-2 sentences",
      "source": "Publication name",
      "url": "Direct article permalink or null"
    }
  ],
  "companies_to_watch": [
    {
      "name": "Company",
      "industry": "Sector (Education, Health Tech, Fintech, etc.)",
      "what_they_do": "One sentence",
      "why_watch_now": "What they did with AI this week",
      "relevance": "Connection to workforce dev or economic mobility",
      "url": "Direct article permalink about this company, or null"
    }
  ],
  "jobs_and_hiring": [
    {
      "insight": "Specific observation about AI adoption, job trends, or in-demand skills",
      "source": "Where this comes from",
      "url": "Direct article permalink about this item, or null"
    }
  ],
  "featured_resource": {
    "title": "Full title",
    "publication": "Name",
    "url": "Direct article permalink or null",
    "what_its_about": "2 sentences",
    "why_read": "1 sentence",
    "format": "Article or Video or Report",
    "estimated_time": "X min"
  }
}
"""


def _parse_json_response(text: str) -> dict:
    clean = text.strip()
    if "```json" in clean:
        clean = clean.split("```json")[1].split("```")[0]
    elif "```" in clean:
        clean = clean.split("```")[1].split("```")[0]
    return json.loads(clean.strip())


BIG_TECH = {"google", "apple", "microsoft", "meta", "amazon", "openai", "anthropic", "salesforce"}


def _filter_big_tech(companies: list) -> list:
    return [c for c in companies if c.get("name", "").lower() not in BIG_TECH]


def _dedupe_companies(companies: list) -> list:
    seen, out = set(), []
    for c in companies:
        key = c.get("name", "").lower()
        if key not in seen:
            seen.add(key)
            out.append(c)
    return out


async def fetch_companies_from_web() -> list:
    """
    Fetches 3-4 Companies to Watch via Claude web search.
    Cross-industry focus: Education, Health, Civic, Fintech, Climate, etc.
    Never includes Big Tech.
    """
    print("Fetching Companies to Watch via web search...")
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2500,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": COMPANIES_FETCH_PROMPT}]
    )

    result_text = ""
    for block in response.content:
        if block.type == "text":
            result_text += block.text

    try:
        data = _parse_json_response(result_text)
        return _filter_big_tech(data.get("companies_to_watch", []))
    except (json.JSONDecodeError, Exception) as e:
        print(f"Companies web search failed: {e}")
        return []


async def fetch_companies_from_scraper_backup(condensed: list) -> list:
    """
    Fallback: extracts non-Big-Tech companies from scraped articles
    when the web search returns fewer than 2 results.
    """
    print("Companies web search returned < 2 — using scraper backup...")
    prompt = COMPANIES_SCRAPER_BACKUP_PROMPT.format(
        articles=json.dumps(condensed, indent=2)
    )
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    )
    try:
        result_text = ""
        for block in response.content:
            if block.type == "text":
                result_text += block.text  # type: ignore[union-attr]
        data = _parse_json_response(result_text)
        return _filter_big_tech(data.get("companies_to_watch", []))
    except (json.JSONDecodeError, Exception) as e:
        print(f"Scraper company backup failed: {e}")
        return []


async def _resolve_companies(web_companies: list, condensed_scraper: list | None = None) -> list:
    """
    Ensures at least 2 companies, max 4. Web search is primary;
    scraper articles are the backup if web returns < 2.
    """
    companies = web_companies
    if len(companies) < 2 and condensed_scraper:
        backup = await fetch_companies_from_scraper_backup(condensed_scraper)
        companies = _dedupe_companies(companies + backup)
    return _filter_big_tech(companies)[:4]


async def fetch_from_scraped(json_path: Path = SCRAPED_DATA_PATH) -> dict:
    """
    Reads scraped articles JSON and uses Claude (no web search)
    to select developments, jobs/skills, and featured resource.
    Companies to Watch always comes from web search; scraper is the backup.
    """
    with open(json_path) as f:
        scraped = json.load(f)

    articles = scraped.get("articles", [])

    condensed = [
        {
            "title": a.get("title", ""),
            "url": a.get("url", ""),
            "summary": (a.get("summary", "") or "")[:300],
            "source": a.get("source", ""),
            "published_date": a.get("published_date", "")[:10],
            "tags": a.get("tags", []),
        }
        for a in articles
    ]

    prompt = SCRAPER_SELECTION_PROMPT.format(
        articles=json.dumps(condensed, indent=2)
    )

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=3000,
        messages=[{"role": "user", "content": prompt}]
    )

    result_text = next(  # type: ignore[union-attr]
        block.text for block in response.content if block.type == "text"
    )

    try:
        news_data = _parse_json_response(result_text)

        web_companies = await fetch_companies_from_web()
        news_data["companies_to_watch"] = await _resolve_companies(web_companies, condensed)

        return {
            "success": True,
            "data": news_data,
            "source": "scraper+web",
            "source_count": (
                len(news_data.get("developments", [])) +
                len(news_data.get("companies_to_watch", [])) +
                len(news_data.get("jobs_and_hiring", []))
            )
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"JSON parse failed: {e}",
            "raw": result_text[:500]
        }


async def fetch_ai_news() -> dict:
    """
    Primary entry point. Uses scraped JSON if available (with web-searched
    companies always merged in), falls back to full Claude web search.
    In the web-search-only path, also runs the dedicated companies fetch
    so the section is always cross-industry, never Big Tech dominated.
    """
    if SCRAPED_DATA_PATH.exists():
        print(f"Using scraped data: {SCRAPED_DATA_PATH}")
        return await fetch_from_scraped(SCRAPED_DATA_PATH)

    print("No scraped data found — using web search fallback")

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        tools=[{"type": "web_search_20250305", "name": "web_search"}],
        messages=[{"role": "user", "content": NEWS_FETCH_PROMPT}]
    )

    result_text = ""
    for block in response.content:
        if block.type == "text":
            result_text += block.text

    try:
        news_data = _parse_json_response(result_text)

        # Always run the dedicated companies search — the main web prompt
        # tends to pick well-known names; the dedicated prompt surfaces
        # cross-industry companies Joanna doesn't already track.
        web_companies = await fetch_companies_from_web()
        resolved = await _resolve_companies(web_companies)
        if resolved:
            news_data["companies_to_watch"] = resolved

        return {
            "success": True,
            "data": news_data,
            "source": "web_search",
            "source_count": (
                len(news_data.get("developments", [])) +
                len(news_data.get("companies_to_watch", [])) +
                len(news_data.get("jobs_and_hiring", []))
            )
        }
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"JSON parse failed: {e}",
            "raw": result_text[:500]
        }
