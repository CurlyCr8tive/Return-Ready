import json
from pathlib import Path

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import date, timedelta

scheduler = AsyncIOScheduler()


async def run_weekly_digest():
    """Monday 6am — ingest, triage, generate, and store digest."""
    from services.video_ingestion import run_video_ingestion
    from services.source_triage_agent import triage_sources
    from services.digest_synthesizer import generate_digest

    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    digest_week = str(week_start)

    print(f"Generating digest for week of {week_start}")

    # Step 1: Ingest video and podcast sources
    video_sources = await run_video_ingestion()

    # Step 2: Load scraped articles and convert to source shape
    article_sources = []
    scraped_path = Path(__file__).resolve().parents[1] / "data" / "scraped_articles.json"
    if scraped_path.exists():
        with open(scraped_path) as f:
            scraped = json.load(f)
        article_sources = [
            {
                "title":            a.get("title", ""),
                "url":              a.get("url", ""),
                "source_type":      "article",
                "channel_name":     a.get("source", ""),
                "content":          a.get("summary", ""),
                "publication_date": a.get("published_date", ""),
            }
            for a in scraped.get("articles", [])
        ]
        print(f"Loaded {len(article_sources)} scraped articles")
    else:
        print("No scraped_articles.json found — skipping article sources")

    # Step 3: Triage all sources together
    all_sources = article_sources + video_sources
    triaged = []
    if all_sources:
        triaged = await triage_sources(all_sources, digest_week)
        print(f"Triage complete — {len(triaged)} include/supporting sources")

    # Step 4: Generate digest
    # Pass triaged_sources only when triage produced results;
    # None falls back to the existing article-only flow in generate_digest
    result = await generate_digest(
        week_start,
        triaged_sources=triaged if triaged else None,
    )

    if result["success"]:
        print(f"Digest ready — Week {result['week_number']}")
    else:
        print(f"Digest failed: {result['error']}")


async def run_weekly_email():
    """Monday 8am — send latest digest by email."""
    from services.email_sender import send_digest_email

    print("Sending weekly digest email")
    result = await send_digest_email()

    if result["success"]:
        print(f"Email sent to {result['sent_to']}")
    else:
        print(f"Email failed: {result['error']}")


def start_cron_jobs():
    """Start all scheduled jobs."""

    # Weekly digest — Monday 6am
    scheduler.add_job(
        run_weekly_digest,
        'cron',
        day_of_week='mon',
        hour=6,
        minute=0,
        id='digest_generate',
        replace_existing=True
    )

    # Weekly email — Monday 8am
    scheduler.add_job(
        run_weekly_email,
        'cron',
        day_of_week='mon',
        hour=8,
        minute=0,
        id='digest_email',
        replace_existing=True
    )

    scheduler.start()
    print("Cron jobs started: digest at 6am, email at 8am")
