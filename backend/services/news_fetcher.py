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

2. COMPANIES TO WATCH (3-4 items)
   Companies gaining AI traction relevant to education,
   workforce development, hiring tools, or AI coding agents.

3. AI AND JOBS (2-3 items)
   AI hiring trends, skills in demand, workforce shifts.
   Especially: how AI agents are reshaping which roles exist
   and what skills lead to economic mobility.

4. ONE FEATURED RESOURCE
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
  "companies_to_watch": [
    {{
      "name": "Company",
      "what_they_do": "One sentence",
      "why_watch_now": "What happened this week",
      "relevance": "Connection to workforce dev or tech careers",
      "url": "Exact URL from scraped data for this company's news item, or null"
    }}
  ],
  "jobs_and_hiring": [
    {{
      "insight": "Specific observation",
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

BROADER SECTOR COVERAGE — include when relevant news exists:
- AI in Education and edtech
- Civic Tech and government AI
- Fintech and economic mobility
- Health Tech
- Climate Tech
- Cybersecurity
- Media / Creative Industries

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
   Gaining traction in AI this week.
   Include AI coding tool companies and
   workforce/education-adjacent AI companies.

3. AI AND JOBS (2-3 items)
   How AI agents are reshaping which roles exist.
   What skills lead to economic mobility right now?
   Any notable hiring trends or displacement signals?
   Prioritize signals relevant to adults entering tech careers.

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
      "what_they_do": "One sentence",
      "why_watch_now": "What happened this week",
      "relevance": "Connection to workforce dev",
      "url": "Direct article permalink about this company, or null"
    }
  ],
  "jobs_and_hiring": [
    {
      "insight": "Specific observation",
      "source": "Where this comes from",
      "url": "Direct article permalink about this jobs item, or null"
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


async def fetch_from_scraped(json_path: Path = SCRAPED_DATA_PATH) -> dict:
    """
    Reads scraped articles JSON and uses Claude (no web search)
    to select and structure the most relevant items.
    Much cheaper than web search and guarantees real article URLs.
    """
    with open(json_path) as f:
        scraped = json.load(f)

    articles = scraped.get("articles", [])

    # Condense each article to keep token count low
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

    result_text = response.content[0].text

    try:
        news_data = _parse_json_response(result_text)
        return {
            "success": True,
            "data": news_data,
            "source": "scraper",
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
    Primary entry point. Uses scraped JSON if available,
    falls back to Claude web search.
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
