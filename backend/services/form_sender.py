# backend/services/form_sender.py
# Auto-send monthly form emails to all staff members via Resend API
# Generates unique JWT token per staff member per month (10-day expiry)
# Logs each send to Supabase form_send_log table
# Called by: cron_jobs.py (28th of March/April/May) and routers/forms.py (manual)

import os
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

import resend
from jose import jwt, JWTError
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

JWT_SECRET = os.getenv("JWT_SECRET", "change-this-secret-before-production")
APP_URL = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
FROM_EMAIL = os.getenv("FROM_EMAIL", "Return Ready <noreply@returnready.co>")

resend.api_key = os.getenv("RESEND_API_KEY", "")


def get_supabase() -> Client:
    return create_client(
        os.getenv("SUPABASE_URL", ""),
        os.getenv("SUPABASE_SERVICE_KEY", ""),
    )


def generate_form_token(staff_email: str, month: str, year: int) -> str:
    """Generate a JWT token for a staff member's monthly form. Expires in 10 days."""
    expire = datetime.now(timezone.utc) + timedelta(days=10)
    payload = {
        "staff_email": staff_email,
        "month": month,
        "year": year,
        "exp": expire,
        "type": "form_token",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def validate_form_token(token: str) -> Optional[dict]:
    """Validate a form token. Returns payload dict or None if invalid/expired."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        if payload.get("type") != "form_token":
            return None
        return payload
    except JWTError:
        return None


def send_monthly_forms(month: str, year: int) -> dict:
    """
    Send form invitation emails to all staff members for the given month.
    Reads staff from Supabase staff_members table.
    Returns dict with sent/errors/total counts.
    """
    supabase = get_supabase()
    month_display = month.capitalize()

    result = supabase.table("staff_members").select("*").execute()
    staff_list = result.data or []

    if not staff_list:
        logger.warning("No staff members found in database — nothing sent.")
        return {"sent": [], "errors": [], "total": 0}

    sent = []
    errors = []

    for staff in staff_list:
        email = staff["email"]
        name = staff["name"]

        try:
            token = generate_form_token(email, month, year)
            form_url = f"{APP_URL}/staff/form?token={token}"
            bot_url = f"{APP_URL}/staff/bot"

            resend.Emails.send({
                "from": FROM_EMAIL,
                "to": email,
                "subject": f"Your Monthly Update for Joanna — {month_display}",
                "html": build_email_html(name, month_display, form_url, bot_url),
            })

            supabase.table("form_send_log").insert({
                "staff_email": email,
                "month": month,
                "token": token,
                "sent_at": datetime.now(timezone.utc).isoformat(),
                "submitted": False,
            }).execute()

            sent.append(email)
            logger.info(f"Form email sent to {email} for {month} {year}")

        except Exception as e:
            logger.error(f"Failed to send form to {email}: {e}")
            errors.append({"email": email, "error": str(e)})

    return {"sent": sent, "errors": errors, "total": len(staff_list)}


def build_email_html(name: str, month_display: str, form_url: str, bot_url: str) -> str:
    """Build the branded HTML email body for the monthly form invitation."""
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <div style="background:#1B2A4A;padding:32px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:22px;font-weight:600;letter-spacing:-0.3px;">Return Ready</h1>
      <p style="color:#4A7FC1;margin:6px 0 0;font-size:13px;">Monthly Team Update</p>
    </div>
    <div style="padding:40px 36px;">
      <h2 style="color:#1B2A4A;font-size:20px;margin:0 0 16px;font-weight:600;">Hi {name},</h2>
      <p style="color:#5A6475;line-height:1.7;margin:0 0 28px;font-size:15px;">
        Joanna is on parental leave and your monthly update helps her return ready.
        It takes about 5 minutes.
      </p>
      <div style="text-align:center;margin:0 0 32px;">
        <a href="{form_url}"
           style="display:inline-block;background:#2E5FA3;color:white;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
          Submit Your {month_display} Update &rarr;
        </a>
      </div>
      <p style="color:#5A6475;line-height:1.7;margin:0 0 16px;font-size:15px;">
        You also have access to the Joanna Bot for any operational questions while she&rsquo;s out:
      </p>
      <div style="text-align:center;margin:0 0 40px;">
        <a href="{bot_url}"
           style="display:inline-block;border:2px solid #2E5FA3;color:#2E5FA3;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
          Ask the Joanna Bot &rarr;
        </a>
      </div>
      <p style="color:#9CA3AF;font-size:13px;line-height:1.6;border-top:1px solid #E2E6ED;padding-top:24px;margin:0;">
        Thank you for keeping things running.<br>
        This link expires in 10 days. If you have trouble, contact your admin.
      </p>
    </div>
  </div>
</body>
</html>"""
