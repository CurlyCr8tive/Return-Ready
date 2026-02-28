print("Digest synthesizer pipeline started")
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[1] / ".env")
import anthropic
import json
import os
from datetime import date, timedelta
from supabase import create_client

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

def get_supabase():
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
    if not supabase_url or not supabase_key:
        raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in backend/.env")
    return create_client(supabase_url, supabase_key)

DIGEST_PROMPT = """
You are generating a weekly AI digest for
Joanna Patterson, COO of Pursuit, while she
is on 12 weeks of parental leave.

ABOUT PURSUIT AND JOANNA:
{pursuit_context}

Your job is to synthesize the external AI news
below into one structured weekly briefing that
keeps Joanna current without overwhelming her.
She reads fast. She thinks strategically.
Surface only what genuinely matters.

NOTE ON SLACK:
Slack integration is not yet connected.
For now, return an empty array [] for slack_highlights.

EXTERNAL AI NEWS THIS WEEK:
{external_news}

Generate the digest in this exact JSON structure.
Return JSON only. No markdown. No preamble.

{{
  "week_summary": "2-3 sentences. What was the dominant theme in AI this week? What should Joanna know first? Name specific companies and technologies — never be vague.",

  "ai_developments": [
    {{
      "headline": "Specific bold headline",
      "synthesis": "2-3 sentences. What happened, who did it, what changed.",
      "why_it_matters": "1-2 sentences. Concrete significance for AI broadly.",
      "source": "Source name",
      "url": "URL or null"
    }}
  ],

  "slack_highlights": [],

  "pursuit_implications": [
    {{
      "implication": "Direct specific statement. Never start with This could or This might. Start with an action or clear observation.",
      "reasoning": "1-2 sentences connecting this AI development to Pursuit's specific work in workforce development and tech careers.",
      "priority": "HIGH or MEDIUM or WATCH"
    }}
  ],

  "companies_to_watch": [
    {{
      "name": "Company name",
      "industry": "Sector (Education, Health Tech, Fintech, Civic Tech, Climate Tech, Cybersecurity, Nonprofit, Media, or other)",
      "what_they_do": "One line",
      "why_watch_now": "What they did or announced with AI this week",
      "pursuit_relevance": "Specific connection to workforce development or tech careers",
      "url": "URL from source news item, or null"
    }}
  ],

  "jobs_and_hiring": {{
    "summary": "2-3 sentences on AI adoption and job trends this week. Focus on how companies across industries are starting to use AI, which roles are growing, and what skills are in demand — not just in tech, but across all industries.",
    "key_insights": [
      {{
        "insight": "Specific observation about AI adoption, emerging roles, or skills in demand — name companies, industries, and concrete trends where possible",
        "url": "URL from the source news item this insight came from, or null"
      }}
    ]
  }},

  "featured_resource": {{
    "title": "Full title",
    "publication": "Where published",
    "url": "URL or null",
    "why_joanna": "One sentence — specific to her role at Pursuit, not generic",
    "format": "Article or Video or Report",
    "read_time": "X min"
  }}
}}

QUALITY RULES — follow these exactly:
→ Every Pursuit implication must connect directly to workforce development, tech career training, or nonprofit ops
→ Never write vague implications — be specific, name technologies and impacts
→ Priority HIGH means act on return, MEDIUM means be aware, WATCH means monitor over time
→ Minimum 3 developments, maximum 5
→ Minimum 2 Pursuit implications, maximum 5
→ slack_highlights must be [] until Slack integration is live
→ Featured resource must be genuinely worth Joanna's time — not filler
"""


async def generate_digest(week_start: date) -> dict:
    """
    Generates complete weekly digest.
    Calls news_fetcher, runs synthesis,
    stores result in Supabase.
    Returns digest_id and stats.
    """

    supabase = get_supabase()

    # Step 1: Fetch external news
    from services.news_fetcher import fetch_ai_news
    news_result = await fetch_ai_news()

    if not news_result["success"]:
        return {
            "success": False,
            "error": "News fetch failed",
            "details": news_result.get("error")
        }

    # Step 2: Get Pursuit context from settings
    settings_result = supabase.table("settings") \
        .select("pursuit_context") \
        .limit(1) \
        .execute()

    pursuit_context = ""
    if settings_result.data:
        pursuit_context = settings_result.data[0].get("pursuit_context", "")

    if not pursuit_context:
        pursuit_context = os.environ.get("PURSUIT_CONTEXT", "")

    # Step 3: Compress news data to stay within token limits
    def compress_news(data: dict) -> dict:
        def trim(text, limit=180):
            if not text:
                return text
            return text[:limit] + "..." if len(text) > limit else text

        return {
            "developments": [
                {
                    "headline": d.get("headline", ""),
                    "what_happened": trim(d.get("what_happened", ""), 200),
                    "why_it_matters": trim(d.get("why_it_matters", ""), 150),
                    "source": d.get("source", ""),
                    "url": d.get("url"),
                }
                for d in data.get("developments", [])[:5]
            ],
            "companies_to_watch": [
                {
                    "name": c.get("name", ""),
                    "industry": c.get("industry", ""),
                    "what_they_do": c.get("what_they_do", ""),
                    "why_watch_now": trim(c.get("why_watch_now", ""), 150),
                    "relevance": trim(c.get("relevance", ""), 150),
                    "url": c.get("url"),
                }
                for c in data.get("companies_to_watch", [])[:4]
            ],
            "jobs_and_hiring": [
                {
                    "insight": trim(j.get("insight", ""), 200),
                    "source": j.get("source", ""),
                    "url": j.get("url"),
                }
                for j in data.get("jobs_and_hiring", [])[:3]
            ],
            "featured_resource": {
                "title": data.get("featured_resource", {}).get("title", ""),
                "publication": data.get("featured_resource", {}).get("publication", ""),
                "url": data.get("featured_resource", {}).get("url"),
                "why_read": trim(data.get("featured_resource", {}).get("why_read", ""), 150),
                "format": data.get("featured_resource", {}).get("format", ""),
                "estimated_time": data.get("featured_resource", {}).get("estimated_time", ""),
            },
        }

    compressed = compress_news(news_result["data"])
    filled_prompt = DIGEST_PROMPT.format(
        pursuit_context=pursuit_context,
        external_news=json.dumps(compressed, indent=2)
    )

    # Step 4: Run synthesis — retry spaced past the 60s rate limit window
    import time
    max_retries = 3
    retry_delay = 65  # seconds — beyond the 1-min token window
    for attempt in range(max_retries):
      try:
        response = client.messages.create(
          model="claude-sonnet-4-6",
          max_tokens=4096,
          messages=[
            {
              "role": "user",
              "content": filled_prompt
            }
          ]
        )
        result_text = response.content[0].text
        break
      except anthropic.RateLimitError as e:
        print(f"Anthropic rate limit hit (attempt {attempt+1}/{max_retries}): {e}. Waiting {retry_delay}s...")
        time.sleep(retry_delay)
      except Exception as e:
        print(f"Anthropic API error: {e}")
        return {
          "success": False,
          "error": f"Anthropic API error: {e}"
        }
    else:
      return {
        "success": False,
        "error": "Anthropic rate limit exceeded after retries"
      }

    # Step 5: Parse response
    try:
        clean = result_text.strip()
        if "```json" in clean:
            clean = clean.split("```json")[1].split("```")[0]
        elif "```" in clean:
            clean = clean.split("```")[1].split("```")[0]
        digest_data = json.loads(clean.strip())

    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": "JSON parse failed",
            "raw": result_text[:500]
        }

    # Step 6: Calculate week number
    leave_start_str = os.environ.get("LEAVE_START_DATE", "2025-03-01")
    leave_start = date.fromisoformat(leave_start_str)
    week_number = max(1, ((week_start - leave_start).days // 7) + 1)

    # Step 7: Store digest in Supabase
    raw_slack_highlights = digest_data.get("slack_highlights")
    if isinstance(raw_slack_highlights, list):
        slack_highlights = [
            item.strip()
            for item in raw_slack_highlights
            if isinstance(item, str) and item.strip()
        ]
    else:
        slack_highlights = []

    digest_record = {
        "week_number":          week_number,
        "week_start":           str(week_start),
        "week_end":             str(week_start + timedelta(days=6)),
        "week_summary":         digest_data.get("week_summary"),
        "ai_developments":      digest_data.get("ai_developments"),
        "slack_highlights":     slack_highlights,
        "pursuit_implications": digest_data.get("pursuit_implications"),
        "companies_to_watch":   digest_data.get("companies_to_watch"),
        "jobs_and_hiring":      digest_data.get("jobs_and_hiring"),
        "featured_resource":    digest_data.get("featured_resource"),
        "full_digest_json":     digest_data,
        "external_source_count": news_result["source_count"],
        "slack_message_count":  0
    }

    insert_result = supabase.table("digests") \
        .insert(digest_record) \
        .execute()

    digest_id = insert_result.data[0]["id"]

    return {
        "success":      True,
        "digest_id":    digest_id,
        "week_number":  week_number,
        "week_start":   str(week_start),
        "source_count": news_result["source_count"]
    }
if __name__ == "__main__":
    from datetime import date
    import asyncio

    print("Digest synthesizer pipeline main entry")
    week_start = date.today()
    result = asyncio.run(generate_digest(week_start))
    print("Pipeline result:", result)
