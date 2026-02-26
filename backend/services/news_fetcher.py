import anthropic
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

NEWS_FETCH_PROMPT = """
Search the web for the most important AI news
and developments from the past 7 days.

Find and return:

1. TOP AI DEVELOPMENTS (3-5 items)
   Product launches, research breakthroughs,
   policy changes, major company moves.
   Real-world impact only — no hype.

2. COMPANIES TO WATCH (3-4 items)
   Gaining traction in AI this week.
   Relevant to: education, workforce
   development, hiring tools.

3. AI AND JOBS (2-3 items)
   Who is hiring in AI this week?
   What skills are most in demand?
   Any notable hiring trends?

4. ONE FEATURED RESOURCE
   Single best article or report
   published this week.
   Practical and leadership-relevant.

Return as JSON only. No markdown. No preamble.

{
  "developments": [
    {
      "headline": "Specific headline",
      "what_happened": "2-3 sentences",
      "why_it_matters": "1-2 sentences",
      "source": "Publication name",
      "url": "URL or null"
    }
  ],
  "companies_to_watch": [
    {
      "name": "Company",
      "what_they_do": "One sentence",
      "why_watch_now": "What happened this week",
      "relevance": "Connection to workforce dev"
    }
  ],
  "jobs_and_hiring": [
    {
      "insight": "Specific observation",
      "source": "Where this comes from"
    }
  ],
  "featured_resource": {
    "title": "Full title",
    "publication": "Name",
    "url": "URL or null",
    "what_its_about": "2 sentences",
    "why_read": "1 sentence",
    "format": "Article or Video or Report",
    "estimated_time": "X min"
  }
}
"""


async def fetch_ai_news() -> dict:
    """
    Uses Claude web search to find and synthesize
    the week's most important AI news.
    Returns structured dict ready for synthesis.
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

    # Extract text — loop through all blocks
    result_text = ""
    for block in response.content:
        if block.type == "text":
            result_text += block.text

    # Parse JSON — strip markdown fences if present
    try:
        clean = result_text.strip()

        if "```json" in clean:
            clean = clean.split("```json")[1]
            clean = clean.split("```")[0]
        elif "```" in clean:
            clean = clean.split("```")[1]
            clean = clean.split("```")[0]

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
            "error": f"JSON parse failed: {str(e)}",
            "raw": result_text[:500]
        }
