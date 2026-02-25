# backend/services/embeddings.py
# Google Gemini embedding generation service (models/embedding-001)
# Used to embed leave doc chunks for ChromaDB ingestion
# and to embed staff questions at query time for the Team Bot RAG pipeline.
# Called by: vector_db.py (ingestion) and routers/bots.py (query)

import os
import logging

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

EMBEDDING_MODEL = "models/embedding-001"
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))


def embed_text(text: str, task_type: str = "retrieval_document") -> list[float]:
    """
    Generate a single embedding vector for a text string using Gemini.
    task_type: 'retrieval_document' for indexing, 'retrieval_query' for search queries.
    """
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type=task_type,
    )
    return result["embedding"]


def embed_query(query: str) -> list[float]:
    """Generate an embedding optimised for retrieval queries."""
    return embed_text(query, task_type="retrieval_query")


def embed_batch(texts: list[str], task_type: str = "retrieval_document") -> list[list[float]]:
    """
    Generate embeddings for a list of texts sequentially.
    Returns a list of embedding vectors in the same order as input.
    """
    embeddings = []
    for i, text in enumerate(texts):
        try:
            embedding = embed_text(text, task_type=task_type)
            embeddings.append(embedding)
        except Exception as e:
            logger.error(f"Embedding failed for chunk {i}: {e}")
            raise
    return embeddings
