from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import date, timedelta

scheduler = AsyncIOScheduler()


async def run_weekly_digest():
    """Monday 6am — generate and store digest."""
    from services.digest_synthesizer import generate_digest

    today = date.today()
    week_start = today - timedelta(days=today.weekday())

    print(f"Generating digest for week of {week_start}")
    result = await generate_digest(week_start)

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
