# backend/routers/forms.py
# Staff monthly submission form endpoints
# GET  /forms/validate/{token}    — validate a form link token, return staff info
# POST /forms/submit              — store a 7-question staff submission
# POST /forms/send/{month}        — manual trigger to send form emails
# GET  /forms/submissions/{month} — Joanna views all submissions for a month
# GET  /forms/status/{month}      — who has / hasn't submitted

import os
import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client

from services.form_sender import validate_form_token, send_monthly_forms

router = APIRouter()
logger = logging.getLogger(__name__)

VALID_MONTHS = {"march", "april", "may"}


def get_supabase():
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SERVICE_KEY", ""),
    )


class FormSubmission(BaseModel):
    token: str
    staff_name: str
    q1_important: str
    q2_decisions: str
    q3_risks: str
    q4_wins: str
    q5_external: str
    q6_team_health: str
    q7_first_week: str


@router.get("/validate/{token}")
async def validate_token(token: str):
    """
    Validate a form link token.
    Returns staff info and already_submitted status.
    Raises 404 if token is invalid or expired.
    """
    payload = validate_form_token(token)
    if not payload:
        raise HTTPException(status_code=404, detail="This link has expired or is invalid.")

    supabase = get_supabase()
    log_result = supabase.table("form_send_log").select("*").eq("token", token).execute()
    if not log_result.data:
        raise HTTPException(status_code=404, detail="Token not found.")

    log_entry = log_result.data[0]

    staff_result = (
        supabase.table("staff_members")
        .select("name")
        .eq("email", payload["staff_email"])
        .execute()
    )
    staff_name = staff_result.data[0]["name"] if staff_result.data else "Team Member"

    return {
        "valid": True,
        "already_submitted": bool(log_entry.get("submitted")),
        "staff_email": payload["staff_email"],
        "staff_name": staff_name,
        "month": payload["month"],
        "year": payload["year"],
    }


@router.post("/submit")
async def submit_form(submission: FormSubmission):
    """
    Receive and store a staff form submission.
    Validates token, checks for duplicate, saves to form_submissions,
    and marks form_send_log as submitted.
    """
    payload = validate_form_token(submission.token)
    if not payload:
        raise HTTPException(status_code=400, detail="Invalid or expired token.")

    supabase = get_supabase()
    log_result = (
        supabase.table("form_send_log")
        .select("submitted")
        .eq("token", submission.token)
        .execute()
    )
    if not log_result.data:
        raise HTTPException(status_code=400, detail="Token not found in send log.")
    if log_result.data[0].get("submitted"):
        raise HTTPException(status_code=400, detail="Form already submitted.")

    now = datetime.now(timezone.utc).isoformat()

    supabase.table("form_submissions").insert({
        "staff_email": payload["staff_email"],
        "staff_name": submission.staff_name,
        "month": payload["month"],
        "year": payload["year"],
        "q1_important": submission.q1_important,
        "q2_decisions": submission.q2_decisions,
        "q3_risks": submission.q3_risks,
        "q4_wins": submission.q4_wins,
        "q5_external": submission.q5_external,
        "q6_team_health": submission.q6_team_health,
        "q7_first_week": submission.q7_first_week,
        "submitted_at": now,
    }).execute()

    supabase.table("form_send_log").update({
        "submitted": True,
        "submitted_at": now,
    }).eq("token", submission.token).execute()

    logger.info(f"Submission stored: {payload['staff_email']} / {payload['month']}")
    return {"success": True, "message": "Form submitted successfully."}


@router.post("/send/{month}")
async def trigger_send_forms(month: str):
    """Manually trigger sending form emails for a month (admin/testing)."""
    if month not in VALID_MONTHS:
        raise HTTPException(status_code=400, detail="Month must be march, april, or may.")
    year = datetime.now(timezone.utc).year
    result = send_monthly_forms(month, year)
    return result


@router.get("/submissions/{month}")
async def get_submissions(month: str, year: Optional[int] = None):
    """Return all staff form submissions for a month (Joanna's dashboard view)."""
    supabase = get_supabase()
    if year is None:
        year = datetime.now(timezone.utc).year
    result = (
        supabase.table("form_submissions")
        .select("*")
        .eq("month", month)
        .eq("year", year)
        .order("submitted_at")
        .execute()
    )
    return {"submissions": result.data or [], "count": len(result.data or [])}


@router.get("/status/{month}")
async def get_form_status(month: str, year: Optional[int] = None):
    """Return submitted vs pending staff list for a given month."""
    supabase = get_supabase()
    if year is None:
        year = datetime.now(timezone.utc).year

    staff_result = supabase.table("staff_members").select("*").execute()
    all_staff = staff_result.data or []

    sub_result = (
        supabase.table("form_submissions")
        .select("staff_email")
        .eq("month", month)
        .eq("year", year)
        .execute()
    )
    submitted_emails = {s["staff_email"] for s in (sub_result.data or [])}

    return {
        "month": month,
        "year": year,
        "total": len(all_staff),
        "submission_count": len(submitted_emails),
        "submitted": [s for s in all_staff if s["email"] in submitted_emails],
        "pending": [s for s in all_staff if s["email"] not in submitted_emails],
    }
