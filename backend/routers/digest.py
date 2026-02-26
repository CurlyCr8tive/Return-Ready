import os
from datetime import date, timedelta
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client

router = APIRouter()


def get_supabase():
    return create_client(
        os.environ.get("SUPABASE_URL", ""),
        os.environ.get("SUPABASE_SERVICE_KEY", ""),
    )


class GenerateRequest(BaseModel):
    week_start: Optional[str] = None


@router.get("/latest")
async def get_latest_digest() -> dict[str, Any]:
    """Returns most recent digest and marks it as read."""
    supabase = get_supabase()

    result = supabase.table("digests") \
        .select("*") \
        .order("generated_at", desc=True) \
        .limit(1) \
        .execute()

    if not result.data:
        return {"digest": None}

    digest = result.data[0]

    # Mark as read
    supabase.table("digests") \
        .update({"is_read": True, "read_at": "now()"}) \
        .eq("id", digest["id"]) \
        .execute()

    digest["is_read"] = True
    return {"digest": digest}


@router.get("/all")
async def get_all_digests() -> dict[str, Any]:
    """Returns all digests newest first (list view — no full content)."""
    supabase = get_supabase()

    result = supabase.table("digests") \
        .select("id, week_number, week_start, week_end, week_summary, external_source_count, is_read, generated_at") \
        .order("generated_at", desc=True) \
        .execute()

    return {"digests": result.data or []}


@router.get("/stats")
async def get_stats() -> dict[str, Any]:
    """Returns dashboard overview stats."""
    supabase = get_supabase()

    all_result = supabase.table("digests") \
        .select("id, week_number, is_read, generated_at") \
        .order("generated_at", desc=True) \
        .execute()

    digests = all_result.data or []
    total = len(digests)
    unread = sum(1 for d in digests if not d.get("is_read"))
    latest_week = digests[0]["week_number"] if digests else 0
    last_generated = digests[0]["generated_at"] if digests else None

    today = date.today()
    days_until_monday = (7 - today.weekday()) % 7 or 7
    next_monday = today + timedelta(days=days_until_monday)

    # If leave start date is in the future and sooner than next Monday, use it
    leave_start_str = os.environ.get("LEAVE_START_DATE", "2026-03-01")
    leave_start = date.fromisoformat(leave_start_str)
    next_digest = str(leave_start if leave_start > today and leave_start <= next_monday else next_monday)

    return {
        "latest_week_number": latest_week,
        "total_digests_generated": total,
        "total_unread": unread,
        "last_generated": last_generated,
        "next_digest": next_digest,
    }


@router.get("/{digest_id}")
async def get_digest(digest_id: str) -> dict[str, Any]:
    """Returns full digest by ID and marks it as read."""
    supabase = get_supabase()

    result = supabase.table("digests") \
        .select("*") \
        .eq("id", digest_id) \
        .limit(1) \
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Digest not found")

    digest = result.data[0]

    # Mark as read
    supabase.table("digests") \
        .update({"is_read": True, "read_at": "now()"}) \
        .eq("id", digest_id) \
        .execute()

    digest["is_read"] = True
    return {"digest": digest}


@router.post("/generate")
async def generate_digest(body: GenerateRequest = None) -> dict[str, Any]:
    """Manually triggers digest generation."""
    from services.digest_synthesizer import generate_digest as run_generate

    if body and body.week_start:
        try:
            week_start = date.fromisoformat(body.week_start)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    else:
        today = date.today()
        week_start = today - timedelta(days=today.weekday())

    result = await run_generate(week_start)

    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Generation failed"))

    return result
