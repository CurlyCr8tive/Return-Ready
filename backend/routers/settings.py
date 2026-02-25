import os
from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel
from supabase import Client, create_client

router = APIRouter()


def get_supabase() -> Client:
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SERVICE_KEY", ""),
    )


class ConnectedDocumentPayload(BaseModel):
    owner_name: str
    source_type: str
    doc_type: str
    doc_id: str
    title: str
    active: bool = True
    management_tier: bool = False


class ManagementTogglePayload(BaseModel):
    enabled: bool


@router.get("/documents")
async def list_documents() -> dict[str, list[dict[str, Any]]]:
    supabase = get_supabase()
    rows = supabase.table("connected_documents").select("*").order("owner_name").execute().data or []
    return {"documents": rows}


@router.post("/documents")
async def upsert_document(payload: ConnectedDocumentPayload) -> dict[str, Any]:
    supabase = get_supabase()
    row = payload.model_dump()

    existing = (
        supabase.table("connected_documents")
        .select("id")
        .eq("doc_id", payload.doc_id)
        .execute()
    )

    if existing.data:
        result = (
            supabase.table("connected_documents")
            .update(row)
            .eq("id", existing.data[0]["id"])
            .execute()
        )
        return {"document": result.data[0] if result.data else row}

    result = supabase.table("connected_documents").insert(row).execute()
    return {"document": result.data[0] if result.data else row}


@router.get("/management")
async def get_management_settings() -> dict[str, Any]:
    supabase = get_supabase()
    rows = supabase.table("app_settings").select("setting_key, setting_value").execute().data or []
    by_key = {r["setting_key"]: r.get("setting_value") for r in rows}

    return {
        "management_tier_enabled": bool(by_key.get("management_tier_enabled", False)),
        "management_google_connected": bool(by_key.get("management_google_connected", False)),
    }


@router.post("/management/toggle")
async def toggle_management(payload: ManagementTogglePayload) -> dict[str, Any]:
    supabase = get_supabase()

    existing = (
        supabase.table("app_settings")
        .select("id")
        .eq("setting_key", "management_tier_enabled")
        .execute()
    )

    row = {"setting_key": "management_tier_enabled", "setting_value": payload.enabled}

    if existing.data:
        supabase.table("app_settings").update(row).eq("id", existing.data[0]["id"]).execute()
    else:
        supabase.table("app_settings").insert(row).execute()

    return {"management_tier_enabled": payload.enabled}
