import anthropic
import json
import os

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

NEWS_FETCH_PROMPT = """
You are a research assistant for Joanna Patterson,
COO of Pursuit — a nonprofit that trains adults
for tech careers in New York City.

Search the web for the most important AI news
and developments from the past 7 days.

Find and return:

1. TOP AI DEVELOPMENTS (3-5 items)
   Product launches, research breakthroughs,
   policy changes, major company moves.
   Focus on real-world impact over hype.

2. COMPANIES TO WATCH (3-4 items)
   Gaining traction in AI this week.
   Especially relevant: education, workforce
   development, hiring tools, skills training.

3. AI AND JOBS (2-3 items)
   Who is hiring in AI this week?
   What skills are most in demand?
   Any notable hiring trends or freezes?

4. ONE FEATURED RESOURCE
   Single best article, video, or report
   published this week.
   Prioritize: practical over theoretical,
   leadership-relevant over deeply technical.

Search broadly then be very selective.
Return only what genuinely matters.
Skip incremental updates and pure hype.

Return as JSON only. No markdown. No preamble.

{
  "week_of": "YYYY-MM-DD",
  "developments": [
    {
      "headline": "Specific bold headline",
      "what_happened": "2-3 sentences. What exactly happened and who did it.",
      "why_it_matters": "1-2 sentences. Concrete real-world significance.",
      "source": "Publication or company name",
      "url": "URL if found, null if not"
    }
  ],
  "companies_to_watch": [
    {
      "name": "Company name",
      "what_they_do": "One sentence max",
      "why_watch_now": "What happened this week specifically",
      "relevance": "Connection to workforce development or tech careers"
    }
  ],
  "jobs_and_hiring": [
    {
      "insight": "Specific observation about AI hiring this week",
      "source": "Where this comes from"
    }
  ],
  "featured_resource": {
    "title": "Full title",
    "author_or_publication": "Name",
    "url": "URL",
    "what_its_about": "2 sentences max",
    "why_read": "1 sentence — specific value",
    "format": "Article or Video or Report",
    "estimated_time": "X min"
  }
}
"""


async def fetch_ai_news() -> dict:
    """
    Uses Claude web search to find and synthesize
    the week's most important AI news.
    Returns structured JSON ready for synthesis.
    """

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        tools=[
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        messages=[
            {
                "role": "user",
                "content": NEWS_FETCH_PROMPT
            }
        ]
    )

    # Extract text from content blocks
    result_text = ""
    for block in response.content:
        if block.type == "text":
            result_text += block.text

    # Parse JSON — strip markdown fences if present
    try:
        clean = result_text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        news_data = json.loads(clean.strip())
        return {
            "success": True,
            "data": news_data,
            "source_count": (
                len(news_data.get("developments", [])) +
                len(news_data.get("companies_to_watch", [])) +
                len(news_data.get("jobs_and_hiring", []))
            )
        }

    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": str(e),
            "raw": result_text
        }
