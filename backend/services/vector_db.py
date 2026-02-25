# backend/services/vector_db.py
# ChromaDB operations — single persistent collection: joanna_knowledge_base
# Used to store and retrieve chunks from Joanna's leave document.
# Called by: ingest_leave_doc.py (write) and routers/bots.py (read/query)

import os
import uuid
import logging

import chromadb
from dotenv import load_dotenv

from services.embeddings import embed_text, embed_query

load_dotenv()

logger = logging.getLogger(__name__)

CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(__file__), "../chroma")
COLLECTION_NAME = "joanna_knowledge_base"

CHUNK_SIZE = 500     # target characters per chunk
CHUNK_OVERLAP = 100  # overlap between consecutive chunks


def get_collection():
    """Get or create the joanna_knowledge_base ChromaDB collection."""
    client = chromadb.PersistentClient(path=CHROMA_PERSIST_DIR)
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """
    Split text into overlapping chunks, preferring sentence/paragraph boundaries.
    Returns a list of non-empty string chunks.
    """
    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + chunk_size, text_len)
        chunk = text[start:end]

        # Try to break at a natural boundary if not at end of text
        if end < text_len:
            for sep in ["\n\n", "\n", ". ", "? ", "! "]:
                boundary = chunk.rfind(sep)
                if boundary > int(chunk_size * 0.5):
                    chunk = chunk[: boundary + len(sep)]
                    end = start + boundary + len(sep)
                    break

        stripped = chunk.strip()
        if stripped:
            chunks.append(stripped)

        start = end - overlap

    return chunks


def ingest_document(file_path: str, metadata: dict = None) -> int:
    """
    Ingest a document into ChromaDB.
    Reads the file (.pdf or .txt), chunks it, generates Gemini embeddings,
    and upserts into the joanna_knowledge_base collection.
    Returns the number of chunks ingested.
    """
    collection = get_collection()
    meta = metadata or {}
    file_path = os.path.abspath(file_path)
    ext = os.path.splitext(file_path)[1].lower()

    # Read document content
    if ext == ".pdf":
        text = _read_pdf(file_path)
    else:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

    if not text.strip():
        logger.warning(f"Document {file_path} appears to be empty.")
        return 0

    chunks = chunk_text(text)
    logger.info(f"Chunked {os.path.basename(file_path)} into {len(chunks)} chunks")

    ids, embeddings, documents, metadatas = [], [], [], []

    for i, chunk in enumerate(chunks):
        chunk_id = f"{os.path.basename(file_path)}_chunk_{i}_{uuid.uuid4().hex[:8]}"
        embedding = embed_text(chunk, task_type="retrieval_document")

        ids.append(chunk_id)
        embeddings.append(embedding)
        documents.append(chunk)
        metadatas.append({
            **meta,
            "source": os.path.basename(file_path),
            "chunk_index": i,
        })

    collection.upsert(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas,
    )

    logger.info(f"Upserted {len(chunks)} chunks from {os.path.basename(file_path)}")
    return len(chunks)


def query(question: str, n_results: int = 5) -> list[dict]:
    """
    Find the most relevant document chunks for a question.
    Embeds the question, queries ChromaDB, returns list of result dicts
    with 'text', 'metadata', and 'score' (cosine similarity, 0-1).
    """
    collection = get_collection()
    query_embedding = embed_query(question)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results,
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    if results["documents"] and results["documents"][0]:
        for doc, meta, distance in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        ):
            chunks.append({
                "text": doc,
                "metadata": meta,
                "score": round(1 - distance, 4),
            })

    return chunks


def _read_pdf(file_path: str) -> str:
    """Extract text from a PDF file using pypdf."""
    try:
        from pypdf import PdfReader
        reader = PdfReader(file_path)
        pages = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text)
        return "\n\n".join(pages)
    except ImportError:
        raise ImportError(
            "pypdf is required to read PDF files. Run: pip install pypdf"
        )
