#!/usr/bin/env python
# backend/scripts/ingest_leave_doc.py
# One-time ingestion script: load Joanna's leave document into ChromaDB
# so the Team Bot can answer questions from it.
#
# Usage:
#   python scripts/ingest_leave_doc.py path/to/joanna_leave_doc.pdf
#   python scripts/ingest_leave_doc.py path/to/joanna_leave_doc.txt
#
# Supports .pdf and .txt files.
# Run once before Joanna's leave starts. Re-run any time the doc is updated.

import sys
import os

# Add backend root to path so services can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from services.vector_db import ingest_document


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/ingest_leave_doc.py <path_to_document>")
        print("Supports: .pdf and .txt files")
        sys.exit(1)

    file_path = sys.argv[1]

    if not os.path.exists(file_path):
        print(f"Error: File not found: {file_path}")
        sys.exit(1)

    ext = os.path.splitext(file_path)[1].lower()
    if ext not in [".pdf", ".txt", ".md"]:
        print(f"Warning: Unrecognised extension '{ext}'. Attempting to read as plain text.")

    print(f"Ingesting: {file_path}")
    print("Generating embeddings and storing in ChromaDB...")

    try:
        chunk_count = ingest_document(
            file_path,
            metadata={"doc_type": "leave_document", "file": os.path.basename(file_path)},
        )
        print(f"Done. Ingested {chunk_count} chunks from {os.path.basename(file_path)}")
        print("The Team Bot is ready to answer questions from this document.")
    except Exception as e:
        print(f"Error during ingestion: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
