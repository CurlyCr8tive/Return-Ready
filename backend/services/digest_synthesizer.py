import anthropic
import json
import os
from datetime import date, timedelta
from supabase import create_client

client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

supabase = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_SERVICE_KEY")
)

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
Slack integration is coming in a future update.
For the slack_highlights section return this
placeholder object:
{{
  "placeholder": true,
  "message": "Slack integration coming soon — your team's #ai channel will appear here."
}}

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

  "slack_highlights": {{
    "placeholder": true,
    "message": "Slack integration coming soon — your team's #ai channel will appear here."
  }},

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
      "what_they_do": "One line",
      "why_watch_now": "What happened this week",
      "pursuit_relevance": "Specific connection to workforce development or tech careers"
    }}
  ],

  "jobs_and_hiring": {{
    "summary": "2-3 sentences on the AI jobs market this week.",
    "key_insights": [
      "Specific observation — name companies and roles where possible"
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
→ Featured resource must be genuinely worth Joanna's time — not filler
"""


async def generate_digest(week_start: date) -> dict:
    """
    Generates complete weekly digest.
    Calls news_fetcher, runs synthesis,
    stores result in Supabase.
    Returns digest_id and stats.
    """

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

    # Step 3: Build synthesis prompt
    filled_prompt = DIGEST_PROMPT.format(
        pursuit_context=pursuit_context,
        external_news=json.dumps(news_result["data"], indent=2)
    )

    # Step 4: Run synthesis
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4000,
        messages=[
            {
                "role": "user",
                "content": filled_prompt
            }
        ]
    )

    result_text = response.content[0].text

    # Step 5: Parse response
    try:
        clean = result_text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
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
    digest_record = {
        "week_number":          week_number,
        "week_start":           str(week_start),
        "week_end":             str(week_start + timedelta(days=6)),
        "week_summary":         digest_data.get("week_summary"),
        "ai_developments":      digest_data.get("ai_developments"),
        "slack_highlights":     digest_data.get("slack_highlights"),
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
