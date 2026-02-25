from datetime import UTC, datetime, timedelta
from typing import Any

from fastapi import APIRouter

from services.ai_digest import generate_weekly_ai_digest, list_digests

router = APIRouter()


@router.get("/")
async def get_digests() -> dict[str, list[dict[str, Any]]]:
    return {"digests": list_digests()}


@router.post("/generate")
async def generate_digest() -> dict[str, Any]:
    today = datetime.now(UTC).date()
    # Monday week start
    week_start = today - timedelta(days=today.weekday())
    return generate_weekly_ai_digest(week_start)
