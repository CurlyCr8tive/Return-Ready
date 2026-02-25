import logging
import os
from datetime import UTC, datetime
from typing import Any

from supabase import Client, create_client

logger = logging.getLogger(__name__)

# NOTE: This file intentionally provides a safe scaffolding for Google pulls.
# The parser can be extended once real Sheets/Docs field mappings are finalized.


STAFF_DOC_OWNERS = ["Stef", "Greg", "Afiya", "Francis"]


def get_supabase() -> Client:
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SERVICE_KEY", ""),
    )


def pull_google_data() -> dict[str, Any]:
    """
    Pull latest data from connected Google Sheets/Docs.

    Current behavior:
    - Reads document registrations from connected_documents.
    - Creates a pull log entry to track freshness.
    - Leaves weekly parsing as a no-op when no parser mapping exists.
    """
    supabase = get_supabase()

    docs = supabase.table("connected_documents").select("*").eq("active", True).execute().data or []

    # Placeholder parsing step: a concrete parser can map each doc_id to KPI fields.
    parsed_updates = 0
    parsed_standups = 0

    pull_log = {
        "pulled_at": datetime.now(UTC).isoformat(),
        "documents_seen": len(docs),
        "weekly_updates_written": parsed_updates,
        "standup_rows_written": parsed_standups,
        "status": "ok",
    }
    supabase.table("data_pull_log").insert(pull_log).execute()

    return pull_log
