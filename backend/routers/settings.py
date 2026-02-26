import os
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


class SettingsUpdate(BaseModel):
    pursuit_context: Optional[str] = None
    email_enabled: Optional[bool] = None
    email_send_day: Optional[str] = None
    email_send_time: Optional[str] = None
    external_news_enabled: Optional[bool] = None


@router.get("")
async def get_settings() -> dict[str, Any]:
    """Returns current settings row."""
    supabase = get_supabase()

    result = supabase.table("settings") \
        .select("*") \
        .limit(1) \
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="No settings found")

    return {"settings": result.data[0]}


@router.patch("")
async def update_settings(payload: SettingsUpdate) -> dict[str, Any]:
    """Updates settings fields."""
    supabase = get_supabase()

    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    updates["updated_at"] = "now()"

    existing = supabase.table("settings").select("id").limit(1).execute()

    if not existing.data:
        raise HTTPException(status_code=404, detail="No settings row found")

    result = supabase.table("settings") \
        .update(updates) \
        .eq("id", existing.data[0]["id"]) \
        .execute()

    return {"settings": result.data[0] if result.data else updates}


@router.post("/send-test-email")
async def send_test_email() -> dict[str, Any]:
    """Sends latest digest to Joanna immediately."""
    from services.email_sender import send_digest_email

    result = await send_digest_email()

    if not result["success"]:
        raise HTTPException(status_code=500, detail=result.get("error", "Email send failed"))

    return result


@router.get("/email-log")
async def get_email_log() -> dict[str, Any]:
    """Returns last 10 email sends."""
    supabase = get_supabase()

    result = supabase.table("email_log") \
        .select("id, week_number, subject, sent_to, sent_at, status") \
        .order("sent_at", desc=True) \
        .limit(10) \
        .execute()

    return {"email_log": result.data or []}
