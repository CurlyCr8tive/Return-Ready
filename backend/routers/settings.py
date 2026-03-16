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
    slack_token: Optional[str] = None
    slack_channel: Optional[str] = None
    slack_connected: Optional[bool] = None


class SlackTestPayload(BaseModel):
    token: str
    channel_id: str


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

    updates = {k: v for k, v in payload.model_dump().items() if v is not None or k in ('slack_token', 'slack_connected')}
    updates["updated_at"] = "now()"

    existing = supabase.table("settings").select("id").limit(1).execute()

    if not existing.data:
        raise HTTPException(status_code=404, detail="No settings row found")

    result = supabase.table("settings") \
        .update(updates) \
        .eq("id", existing.data[0]["id"]) \
        .execute()

    return {"settings": result.data[0] if result.data else updates}


@router.post("/test-slack")
async def test_slack_connection(payload: SlackTestPayload) -> dict[str, Any]:
    """Verifies Slack token against the given channel, then saves credentials if valid."""
    import httpx

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://slack.com/api/conversations.info",
            headers={"Authorization": f"Bearer {payload.token}"},
            params={"channel": payload.channel_id},
        )

    data = resp.json()
    if not data.get("ok"):
        return {"success": False, "error": data.get("error", "unknown_error")}

    channel_name = data.get("channel", {}).get("name", payload.channel_id)

    # Save credentials now that the connection is confirmed
    supabase = get_supabase()
    existing = supabase.table("settings").select("id").limit(1).execute()
    if existing.data:
        supabase.table("settings").update({
            "slack_token": payload.token,
            "slack_channel": payload.channel_id,
            "slack_connected": True,
            "slack_last_synced": None,
            "updated_at": "now()",
        }).eq("id", existing.data[0]["id"]).execute()

    return {"success": True, "channel_name": channel_name}


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
