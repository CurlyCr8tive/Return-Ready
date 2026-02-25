import json
import logging
import os
from datetime import UTC, date, datetime
from typing import Any

import anthropic
from supabase import Client, create_client

logger = logging.getLogger(__name__)

claude = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))

DIGEST_PROMPT = """Generate a weekly AI news digest for Joanna, COO at Pursuit.

Return JSON with keys:
- what_happened_this_week (3-5 concise bullets)
- what_it_means_for_pursuit
- who_is_hiring_in_ai
- companies_to_watch
- one_thing_to_read (object with title and url)

Focus specifically on workforce development implications where possible.
"""


def get_supabase() -> Client:
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SERVICE_KEY", ""),
    )


def _safe_json(text: str) -> dict[str, Any]:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return {"raw_text": text}


def generate_weekly_ai_digest(week_start: date) -> dict[str, Any]:
    week_start_iso = week_start.isoformat()

    try:
        # Claude web-search is account/SDK-version dependent.
        # We attempt structured synthesis directly and store source links when present.
        response = claude.messages.create(
            model=os.getenv("CLAUDE_MODEL", "claude-sonnet-4-6"),
            max_tokens=2500,
            messages=[{"role": "user", "content": DIGEST_PROMPT}],
        )
    except Exception as exc:
        logger.error("AI digest generation failed: %s", exc)
        raise

    text = response.content[0].text if response.content else "{}"
    sections = _safe_json(text)

    digest = {
        "week_start": week_start_iso,
        "week_end": (week_start.fromordinal(week_start.toordinal() + 6)).isoformat(),
        "sections": sections,
        "source_links": sections.get("source_links", []),
        "generated_at": datetime.now(UTC).isoformat(),
    }

    supabase = get_supabase()
    existing = (
        supabase.table("ai_weekly_digests")
        .select("id")
        .eq("week_start", week_start_iso)
        .execute()
    )

    if existing.data:
        (
            supabase.table("ai_weekly_digests")
            .update(digest)
            .eq("id", existing.data[0]["id"])
            .execute()
        )
    else:
        supabase.table("ai_weekly_digests").insert(digest).execute()

    return digest


def list_digests() -> list[dict[str, Any]]:
    supabase = get_supabase()
    result = (
        supabase.table("ai_weekly_digests")
        .select("*")
        .order("week_start", desc=True)
        .execute()
    )
    return result.data or []
