# backend/routers/synthesis.py
# Monthly report synthesis endpoints
# POST /synthesis/generate/{month} — trigger Claude synthesis for a month
# GET  /synthesis/report/{month}   — retrieve stored report
# GET  /synthesis/status           — generation status for all 3 months
# Called by: frontend dashboard and cron_jobs.py

import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException

from services.synthesizer import generate_monthly_report, get_report

router = APIRouter()
logger = logging.getLogger(__name__)

VALID_MONTHS = {"march", "april", "may"}


@router.post("/generate/{month}")
async def trigger_synthesis(month: str):
    """
    Trigger Claude synthesis for a given month.
    Queries form_submissions, synthesizes with Claude, stores in monthly_reports.
    """
    if month not in VALID_MONTHS:
        raise HTTPException(status_code=400, detail="Month must be march, april, or may.")
    year = datetime.now(timezone.utc).year
    try:
        report = generate_monthly_report(month, year)
        return report
    except Exception as e:
        logger.error(f"Synthesis failed for {month} {year}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Synthesis failed: {str(e)}")


@router.get("/report/{month}")
async def get_monthly_report(month: str, year: Optional[int] = None):
    """Retrieve a stored monthly report from Supabase."""
    if month not in VALID_MONTHS:
        raise HTTPException(status_code=400, detail="Month must be march, april, or may.")
    if year is None:
        year = datetime.now(timezone.utc).year
    report = get_report(month, year)
    if not report:
        raise HTTPException(status_code=404, detail=f"No report found for {month} {year}.")
    return report


@router.get("/status")
async def get_all_statuses(year: Optional[int] = None):
    """Return generation status for all three months (for dashboard overview)."""
    if year is None:
        year = datetime.now(timezone.utc).year
    statuses = {}
    for month in ["march", "april", "may"]:
        report = get_report(month, year)
        statuses[month] = {
            "generated": report is not None,
            "generated_at": report.get("generated_at") if report else None,
            "submission_count": report.get("submission_count", 0) if report else 0,
        }
    return {"year": year, "statuses": statuses}
