# backend/routers/bots.py
# Team Bot endpoint — RAG pipeline for staff "What Would Joanna Do?" questions
# POST /bot/team               — answer a question using leave doc context
# GET  /bot/history            — all bot history grouped by staff (Joanna's view)
# GET  /bot/history/{email}    — individual staff conversation history

import os
import logging
from datetime import datetime, timezone

import anthropic
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client

from services.vector_db import query as vector_query

router = APIRouter()
logger = logging.getLogger(__name__)

claude = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))

TEAM_BOT_SYSTEM_PROMPT = """You are an AI assistant representing Joanna Patterson, COO of Pursuit, while she is on parental leave.

Answer questions the way Joanna would — direct, practical, specific, warm but efficient.

Answer ONLY from the provided context documents.
If the answer is not clearly in the context, say:
"I don't have enough context to answer that confidently. Bring it to your manager or save it for Joanna's return when she's back."

Never speculate. Never invent policy or process.
Always indicate which document or section your answer comes from.

Keep answers concise and actionable.
Name specific people, processes, or next steps when the context supports it."""


def get_supabase():
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SERVICE_KEY", ""),
    )


class TeamBotQuery(BaseModel):
    question: str
    staff_email: str
    staff_name: str


@router.post("/team")
async def team_bot(payload: TeamBotQuery):
    """
    Answer a staff question using Joanna's leave doc (RAG via ChromaDB + Claude).
    Saves the full exchange to bot_history table.
    Returns answer and sources.
    """
    # Retrieve relevant chunks from ChromaDB
    retrieved = vector_query(payload.question, n_results=5)

    if retrieved:
        context_parts = []
        for i, chunk in enumerate(retrieved, 1):
            source = chunk["metadata"].get("source", "leave document")
            context_parts.append(f"[Source {i}: {source}]\n{chunk['text']}")
        context_text = "\n\n".join(context_parts)
    else:
        context_text = "No relevant context found in the knowledge base."

    # Call Claude with retrieved context
    user_message = f"Context:\n{context_text}\n\nQuestion: {payload.question}"

    try:
        response = claude.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            system=TEAM_BOT_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
        answer = response.content[0].text
    except Exception as e:
        logger.error(f"Claude API error in team bot: {e}")
        raise HTTPException(status_code=500, detail="Bot response generation failed.")

    sources = [
        {
            "source": chunk["metadata"].get("source", ""),
            "chunk_index": chunk["metadata"].get("chunk_index", 0),
            "score": chunk["score"],
        }
        for chunk in retrieved
    ]

    # Save to bot_history
    supabase = get_supabase()
    supabase.table("bot_history").insert({
        "staff_email": payload.staff_email,
        "staff_name": payload.staff_name,
        "bot_type": "team",
        "question": payload.question,
        "answer": answer,
        "sources": sources,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }).execute()

    return {"answer": answer, "sources": sources}


@router.get("/history")
async def get_all_bot_history():
    """
    Return all bot history grouped by staff member.
    Used by Joanna's dashboard to see team inquiry activity.
    """
    supabase = get_supabase()
    result = (
        supabase.table("bot_history")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )

    by_staff: dict = {}
    for entry in (result.data or []):
        email = entry["staff_email"]
        if email not in by_staff:
            by_staff[email] = {
                "staff_email": email,
                "staff_name": entry["staff_name"],
                "total_questions": 0,
                "last_question_at": None,
                "conversations": [],
            }
        by_staff[email]["total_questions"] += 1
        by_staff[email]["conversations"].append(entry)
        if (
            not by_staff[email]["last_question_at"]
            or entry["created_at"] > by_staff[email]["last_question_at"]
        ):
            by_staff[email]["last_question_at"] = entry["created_at"]

    return {"staff": list(by_staff.values())}


@router.get("/history/{staff_email:path}")
async def get_staff_bot_history(staff_email: str):
    """Return full conversation history for a specific staff member."""
    supabase = get_supabase()
    result = (
        supabase.table("bot_history")
        .select("*")
        .eq("staff_email", staff_email)
        .order("created_at")
        .execute()
    )
    return {"history": result.data or [], "total": len(result.data or [])}
