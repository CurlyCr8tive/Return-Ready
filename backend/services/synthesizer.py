# backend/services/synthesizer.py
# Monthly report synthesis engine — uses Claude to generate structured briefs
# from staff form submissions for a given month.
# Called by: cron_jobs.py (end of month) and routers/synthesis.py (manual trigger)
# Stores results in Supabase monthly_reports table.

import os
import logging
from datetime import datetime, timezone
from typing import Optional

import anthropic
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

claude = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))

SYNTHESIS_PROMPT = """You are preparing a monthly executive brief for Joanna Patterson, COO of Pursuit, who is on parental leave for 12 weeks.

She will read this on her return to quickly understand what happened while she was gone.

Based on the team's monthly submissions below, generate a structured brief with these exact sections:

1. THE MONTH IN 60 SECONDS
   3-4 sentences. Direct and specific overview.
   What was the dominant theme this month?

2. KEY DECISIONS MADE
   Bulleted list. Who made them. What was decided.
   Include only decisions with clear outcomes.

3. RISKS AND OPEN ITEMS
   Prioritized list. What needs her attention first.
   Be specific — name people and projects.

4. WINS AND PROGRESS
   Brief and celebratory. What went well.
   Name the people responsible.

5. EXTERNAL RELATIONSHIPS
   Any funder, partner, or vendor updates.
   What needs follow-up from Joanna.

6. TEAM HEALTH
   Honest assessment from what was submitted.
   Any tensions, burnout signals, or standout performers.

7. WHAT YOUR TEAM NEEDS FROM YOUR FIRST WEEK BACK
   Synthesized from question 7 across all submissions.
   The clearest signal of what to prioritize on return.

Be direct. Joanna is a senior executive returning from leave. Surface only what is new, changed, or urgent. Do not pad. Do not repeat.

If fewer than half the team submitted this month, note that at the top and flag which sections may be incomplete as a result."""


def get_supabase() -> Client:
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SERVICE_KEY", ""),
    )


def format_submissions(submissions: list, total_staff: int) -> str:
    """Format all submissions into a structured string for the Claude prompt."""
    if not submissions:
        return "No submissions received for this month."

    lines = [f"Total staff: {total_staff}", f"Submissions received: {len(submissions)}", ""]

    for i, sub in enumerate(submissions, 1):
        lines.append(f"--- Submission {i}: {sub.get('staff_name', 'Unknown')} ---")
        lines.append(f"Q1 (Most important this month): {sub.get('q1_important', 'Not answered')}")
        lines.append(f"Q2 (Decisions made without Joanna): {sub.get('q2_decisions', 'Not answered')}")
        lines.append(f"Q3 (What's at risk): {sub.get('q3_risks', 'Not answered')}")
        lines.append(f"Q4 (Wins and progress): {sub.get('q4_wins', 'Not answered')}")
        lines.append(f"Q5 (External partner conversations): {sub.get('q5_external', 'Not answered')}")
        lines.append(f"Q6 (Team dynamics and mood): {sub.get('q6_team_health', 'Not answered')}")
        lines.append(f"Q7 (What to know/do first week back): {sub.get('q7_first_week', 'Not answered')}")
        lines.append("")

    return "\n".join(lines)


def parse_report_sections(report_text: str) -> dict:
    """Parse the Claude-generated report into labeled section dicts."""
    sections = {
        "full_text": report_text,
        "month_summary": "",
        "key_decisions": "",
        "risks_open_items": "",
        "wins_progress": "",
        "external_relationships": "",
        "team_health": "",
        "first_week_focus": "",
    }

    section_markers = {
        "1. THE MONTH IN 60 SECONDS": "month_summary",
        "2. KEY DECISIONS MADE": "key_decisions",
        "3. RISKS AND OPEN ITEMS": "risks_open_items",
        "4. WINS AND PROGRESS": "wins_progress",
        "5. EXTERNAL RELATIONSHIPS": "external_relationships",
        "6. TEAM HEALTH": "team_health",
        "7. WHAT YOUR TEAM NEEDS": "first_week_focus",
    }

    lines = report_text.split("\n")
    current_section = None
    current_content: list[str] = []

    for line in lines:
        matched = None
        for marker, key in section_markers.items():
            if marker in line.upper():
                matched = key
                break

        if matched:
            if current_section:
                sections[current_section] = "\n".join(current_content).strip()
            current_section = matched
            current_content = []
        elif current_section:
            current_content.append(line)

    if current_section and current_content:
        sections[current_section] = "\n".join(current_content).strip()

    return sections


def generate_monthly_report(month: str, year: int) -> dict:
    """
    Generate a synthesized monthly report from all staff submissions for a given month.
    Stores the result in Supabase monthly_reports table. Returns the full report dict.
    """
    supabase = get_supabase()

    subs_result = (
        supabase.table("form_submissions")
        .select("*")
        .eq("month", month)
        .eq("year", year)
        .execute()
    )
    submissions = subs_result.data or []

    staff_result = supabase.table("staff_members").select("id").execute()
    total_staff = len(staff_result.data or [])

    logger.info(f"Generating report for {month} {year}: {len(submissions)}/{total_staff} submissions")

    submissions_text = format_submissions(submissions, total_staff)
    user_message = (
        f"{SYNTHESIS_PROMPT}\n\n"
        f"Month: {month.capitalize()} {year}\n\n"
        f"Team submissions:\n{submissions_text}"
    )

    response = claude.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=[{"role": "user", "content": user_message}],
    )
    report_text = response.content[0].text
    sections = parse_report_sections(report_text)

    report_data = {
        "month": month,
        "year": year,
        "month_summary": sections.get("month_summary", ""),
        "key_decisions": sections.get("key_decisions", ""),
        "risks_open_items": sections.get("risks_open_items", ""),
        "wins_progress": sections.get("wins_progress", ""),
        "first_week_focus": sections.get("first_week_focus", ""),
        "full_report_json": sections,
        "submission_count": len(submissions),
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }

    existing = (
        supabase.table("monthly_reports")
        .select("id")
        .eq("month", month)
        .eq("year", year)
        .execute()
    )
    if existing.data:
        supabase.table("monthly_reports").update(report_data).eq("month", month).eq("year", year).execute()
    else:
        supabase.table("monthly_reports").insert(report_data).execute()

    logger.info(f"Report stored for {month} {year}")
    return report_data


def get_report(month: str, year: int) -> Optional[dict]:
    """Retrieve a stored monthly report from Supabase."""
    supabase = get_supabase()
    result = (
        supabase.table("monthly_reports")
        .select("*")
        .eq("month", month)
        .eq("year", year)
        .execute()
    )
    return result.data[0] if result.data else None
