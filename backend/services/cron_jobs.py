import logging
from datetime import UTC, datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from services.ai_digest import generate_weekly_ai_digest
from services.google_sources import pull_google_data
from services.team_intelligence import generate_biweekly_report, generate_monthly_report

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(timezone="UTC")


def start_cron_jobs():
    """
    Scheduling model for Joanna's 12-week leave:
    - Weekly data pull: every Monday 08:00 UTC
    - Weekly AI digest: every Friday 17:00 UTC
    - Biweekly team report: every other Friday 18:00 UTC
    - Monthly report: last day of month 20:00 UTC
    """
    scheduler.add_job(
        job_weekly_pull,
        CronTrigger(day_of_week="mon", hour=8, minute=0),
        id="weekly_pull",
        replace_existing=True,
    )

    scheduler.add_job(
        job_weekly_ai_digest,
        CronTrigger(day_of_week="fri", hour=17, minute=0),
        id="weekly_ai_digest",
        replace_existing=True,
    )

    scheduler.add_job(
        job_biweekly_report,
        CronTrigger(day_of_week="fri", hour=18, minute=0, week="*/2"),
        id="biweekly_report",
        replace_existing=True,
    )

    scheduler.add_job(
        job_monthly_report,
        CronTrigger(day="last", hour=20, minute=0),
        id="monthly_report",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("Scheduler started with weekly/biweekly/monthly jobs.")


def stop_cron_jobs():
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler stopped.")


def job_weekly_pull():
    try:
        pull_google_data()
        logger.info("Weekly Google pull completed.")
    except Exception as exc:
        logger.error("Weekly pull failed: %s", exc, exc_info=True)


def job_weekly_ai_digest():
    try:
        today = datetime.now(UTC).date()
        week_start = today - timedelta(days=today.weekday())
        generate_weekly_ai_digest(week_start)
        logger.info("Weekly AI digest generated.")
    except Exception as exc:
        logger.error("Weekly AI digest failed: %s", exc, exc_info=True)


def job_biweekly_report():
    try:
        end_date = datetime.now(UTC).date()
        start_date = end_date - timedelta(days=13)
        generate_biweekly_report(start_date.isoformat(), end_date.isoformat())
        logger.info("Biweekly report generated.")
    except Exception as exc:
        logger.error("Biweekly report failed: %s", exc, exc_info=True)


def job_monthly_report():
    try:
        now = datetime.now(UTC)
        generate_monthly_report(now.month, now.year)
        logger.info("Monthly report generated.")
    except Exception as exc:
        logger.error("Monthly report failed: %s", exc, exc_info=True)
