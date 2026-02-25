import json
import logging
import os
from datetime import UTC, datetime
from typing import Any

import anthropic
from supabase import Client, create_client

logger = logging.getLogger(__name__)

claude = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))

BIWEEKLY_PROMPT = """You are preparing a biweekly executive report for Joanna while she is on parental leave.

Use the provided KPI updates and standup entries to generate exactly these sections:
1) Biweekly Snapshot
2) KPI Highlights by Person
3) Patterns and Trends
4) Risks and Flags
5) Wins

Rules:
- Be specific and concise.
- Call out each person by name when relevant.
- Include only evidence-supported points from the provided data.
- Return valid JSON with keys: biweekly_snapshot, kpi_highlights_by_person, patterns_and_trends, risks_and_flags, wins.
"""

MONTHLY_PROMPT = """You are preparing a monthly executive report for Joanna while she is on parental leave.

Use the provided KPI updates and standup entries to generate exactly these sections:
1) The Month in Summary
2) KPI Performance by Person
3) What Improved
4) What Needs Attention
5) Heading Into Next Month

Rules:
- Be specific and concise.
- Call out each person by name when relevant.
- Include only evidence-supported points from the provided data.
- Return valid JSON with keys: month_in_summary, kpi_performance_by_person, what_improved, what_needs_attention, heading_into_next_month.
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
        logger.warning("Claude output was not valid JSON, storing raw text.")
        return {"raw_text": text}


def _fetch_team_updates(start_date: str, end_date: str) -> list[dict[str, Any]]:
    supabase = get_supabase()
    result = (
        supabase.table("team_weekly_updates")
        .select("*")
        .gte("week_start", start_date)
        .lte("week_start", end_date)
        .order("week_start")
        .execute()
    )
    return result.data or []


def _fetch_standups(start_date: str, end_date: str) -> list[dict[str, Any]]:
    supabase = get_supabase()
    result = (
        supabase.table("team_standups")
        .select("*")
        .gte("entry_date", start_date)
        .lte("entry_date", end_date)
        .order("entry_date")
        .execute()
    )
    return result.data or []


def _prompt_payload(start_date: str, end_date: str) -> str:
    updates = _fetch_team_updates(start_date, end_date)
    standups = _fetch_standups(start_date, end_date)
    payload = {
        "date_window": {"start": start_date, "end": end_date},
        "weekly_kpis": updates,
        "standups": standups,
    }
    return json.dumps(payload, ensure_ascii=True)


def _run_synthesis(prompt: str, payload: str) -> dict[str, Any]:
    response = claude.messages.create(
        model=os.getenv("CLAUDE_MODEL", "claude-sonnet-4-6"),
        max_tokens=3000,
        messages=[
            {
                "role": "user",
                "content": f"{prompt}\n\nSource data JSON:\n{payload}",
            }
        ],
    )
    text = response.content[0].text if response.content else "{}"
    return _safe_json(text)


def generate_biweekly_report(period_start: str, period_end: str) -> dict[str, Any]:
    payload = _prompt_payload(period_start, period_end)
    synthesis = _run_synthesis(BIWEEKLY_PROMPT, payload)

    report = {
        "period_start": period_start,
        "period_end": period_end,
        "report_type": "biweekly",
        "sections": synthesis,
        "generated_at": datetime.now(UTC).isoformat(),
    }

    supabase = get_supabase()
    existing = (
        supabase.table("team_reports")
        .select("id")
        .eq("report_type", "biweekly")
        .eq("period_start", period_start)
        .eq("period_end", period_end)
        .execute()
    )

    if existing.data:
        (
            supabase.table("team_reports")
            .update(report)
            .eq("id", existing.data[0]["id"])
            .execute()
        )
    else:
        supabase.table("team_reports").insert(report).execute()

    return report


def generate_monthly_report(month: int, year: int) -> dict[str, Any]:
    period_start = datetime(year, month, 1, tzinfo=UTC).date().isoformat()
    if month == 12:
        period_end = datetime(year + 1, 1, 1, tzinfo=UTC).date().isoformat()
    else:
        period_end = datetime(year, month + 1, 1, tzinfo=UTC).date().isoformat()

    payload = _prompt_payload(period_start, period_end)
    synthesis = _run_synthesis(MONTHLY_PROMPT, payload)

    report = {
        "period_start": period_start,
        "period_end": period_end,
        "report_type": "monthly",
        "month": month,
        "year": year,
        "sections": synthesis,
        "generated_at": datetime.now(UTC).isoformat(),
    }

    supabase = get_supabase()
    existing = (
        supabase.table("team_reports")
        .select("id")
        .eq("report_type", "monthly")
        .eq("month", month)
        .eq("year", year)
        .execute()
    )

    if existing.data:
        (
            supabase.table("team_reports")
            .update(report)
            .eq("id", existing.data[0]["id"])
            .execute()
        )
    else:
        supabase.table("team_reports").insert(report).execute()

    return report


def get_reports(report_type: str) -> list[dict[str, Any]]:
    supabase = get_supabase()
    result = (
        supabase.table("team_reports")
        .select("*")
        .eq("report_type", report_type)
        .order("generated_at", desc=True)
        .execute()
    )
    return result.data or []


def get_by_person_summary() -> list[dict[str, Any]]:
    supabase = get_supabase()
    updates = supabase.table("team_weekly_updates").select("*").order("week_start").execute()

    grouped: dict[str, dict[str, Any]] = {}
    for row in updates.data or []:
        person = row.get("owner_name", "Unknown")
        item = grouped.setdefault(
            person,
            {
                "person": person,
                "kpi_trend": [],
                "flags": [],
                "reported_items": [],
            },
        )
        item["kpi_trend"].append(
            {
                "week_start": row.get("week_start"),
                "kpi_name": row.get("kpi_name"),
                "kpi_value": row.get("kpi_value"),
            }
        )
        if row.get("flag"):
            item["flags"].append(
                {
                    "week_start": row.get("week_start"),
                    "flag": row.get("flag"),
                }
            )
        if row.get("notes"):
            item["reported_items"].append(
                {
                    "week_start": row.get("week_start"),
                    "notes": row.get("notes"),
                }
            )

    return list(grouped.values())
