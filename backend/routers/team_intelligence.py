from datetime import UTC, date, datetime, timedelta
from typing import Any

from fastapi import APIRouter, HTTPException

from services.team_intelligence import (
    generate_biweekly_report,
    generate_monthly_report,
    get_by_person_summary,
    get_reports,
)
from services.google_sources import pull_google_data

router = APIRouter()


@router.get("/overview")
async def overview() -> dict[str, Any]:
    biweekly = get_reports("biweekly")
    monthly = get_reports("monthly")
    by_person = get_by_person_summary()

    latest_biweekly = biweekly[0] if biweekly else None
    latest_monthly = monthly[0] if monthly else None

    return {
        "latest_biweekly": latest_biweekly,
        "latest_monthly": latest_monthly,
        "report_status": {
            "biweekly_count": len(biweekly),
            "monthly_count": len(monthly),
        },
        "people_tracked": len(by_person),
    }


@router.get("/biweekly")
async def list_biweekly_reports() -> dict[str, list[dict[str, Any]]]:
    return {"reports": get_reports("biweekly")}


@router.post("/biweekly/generate")
async def generate_biweekly(period_start: str | None = None, period_end: str | None = None):
    if not period_start or not period_end:
        today = datetime.now(UTC).date()
        period_end_date = today
        period_start_date = today - timedelta(days=13)
        period_start = period_start_date.isoformat()
        period_end = period_end_date.isoformat()

    return generate_biweekly_report(period_start, period_end)


@router.get("/monthly")
async def list_monthly_reports() -> dict[str, list[dict[str, Any]]]:
    return {"reports": get_reports("monthly")}


@router.post("/monthly/generate")
async def generate_monthly(month: int | None = None, year: int | None = None):
    now = datetime.now(UTC)
    month = month or now.month
    year = year or now.year

    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="month must be between 1 and 12")

    return generate_monthly_report(month, year)


@router.get("/by-person")
async def by_person() -> dict[str, list[dict[str, Any]]]:
    return {"people": get_by_person_summary()}


@router.post("/pull/run")
async def run_pull() -> dict[str, Any]:
    return pull_google_data()
