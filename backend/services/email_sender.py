import resend
import os
from supabase import create_client

resend.api_key = os.environ.get("RESEND_API_KEY")

supabase = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_SERVICE_KEY")
)


def build_email_html(digest: dict) -> str:
    """
    Builds HTML email from digest data.
    Uses inline styles — required for email clients.
    Max width 600px, mobile responsive.
    """

    developments = digest.get("ai_developments", [])
    implications = digest.get("pursuit_implications", [])
    companies = digest.get("companies_to_watch", [])
    jobs = digest.get("jobs_and_hiring", {})
    featured = digest.get("featured_resource", {})
    week_summary = digest.get("week_summary", "")
    week_number = digest.get("week_number", "")
    week_start = digest.get("week_start", "")
    week_end = digest.get("week_end", "")

    # Build developments HTML
    dev_html = ""
    for i, dev in enumerate(developments[:5], 1):
        url = dev.get("url")
        headline = dev.get("headline", "")
        headline_html = (
            f'<a href="{url}" style="color:#1B2A4A;text-decoration:none;">{headline}</a>'
            if url else headline
        )
        source_html = (
            f'<a href="{url}" style="color:#C9A84C;text-decoration:none;">Read article →</a>'
            if url else f'<span style="color:#6b7280;">{dev.get("source", "")}</span>'
        )
        dev_html += f"""
        <div style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #e5e7eb;">
          <div style="font-size:13px;color:#6b7280;font-family:monospace;margin-bottom:4px;">{i} · {dev.get("source", "")}</div>
          <div style="font-weight:600;font-size:16px;color:#1B2A4A;margin-bottom:8px;line-height:1.4;">{headline_html}</div>
          <div style="font-size:14px;color:#374151;line-height:1.6;margin-bottom:6px;">{dev.get("synthesis", "")}</div>
          <div style="font-size:13px;color:#4B5563;line-height:1.5;margin-bottom:10px;padding-left:12px;border-left:2px solid #e5e7eb;font-style:italic;">{dev.get("why_it_matters", "")}</div>
          <div style="font-size:12px;">{source_html}</div>
        </div>
        """

    # Build implications HTML
    impl_html = ""
    for imp in implications:
        priority = imp.get("priority", "MEDIUM")
        priority_color = {
            "HIGH": "#DC2626",
            "MEDIUM": "#D97706",
            "WATCH": "#2563EB"
        }.get(priority, "#6b7280")

        impl_html += f"""
        <div style="margin-bottom:16px;padding-left:16px;border-left:3px solid #C9A84C;">
          <div style="font-size:11px;font-weight:600;color:{priority_color};font-family:monospace;margin-bottom:4px;letter-spacing:0.05em;">{priority}</div>
          <div style="font-size:14px;color:#1B2A4A;font-weight:500;margin-bottom:4px;line-height:1.5;">{imp.get("implication", "")}</div>
          <div style="font-size:13px;color:#6b7280;line-height:1.5;">{imp.get("reasoning", "")}</div>
        </div>
        """

    # Build companies HTML
    co_html = ""
    for co in companies[:3]:
        co_html += f"""
        <div style="margin-bottom:12px;padding:12px;background:#f9fafb;border-radius:6px;">
          <div style="font-weight:600;color:#1B2A4A;margin-bottom:4px;">{co.get("name", "")}</div>
          <div style="font-size:13px;color:#374151;margin-bottom:4px;">{co.get("what_they_do", "")}</div>
          <div style="font-size:12px;color:#C9A84C;font-weight:500;">{co.get("why_watch_now", "")}</div>
        </div>
        """

    # Build featured resource HTML
    featured_url = featured.get("url", "#")
    featured_html = f"""
    <div style="background:#1B2A4A;border-radius:8px;padding:24px;margin-top:8px;">
      <div style="font-size:11px;color:#C9A84C;font-weight:600;letter-spacing:0.1em;margin-bottom:12px;font-family:monospace;">ONE THING TO READ</div>
      <div style="font-size:17px;font-weight:600;color:#F0F4FF;margin-bottom:8px;line-height:1.4;">{featured.get("title", "")}</div>
      <div style="font-size:13px;color:#8A9DC0;margin-bottom:4px;">{featured.get("publication", "")} · {featured.get("read_time", "")}</div>
      <div style="font-size:13px;color:#8A9DC0;margin-bottom:16px;line-height:1.5;">{featured.get("why_joanna", "")}</div>
      <a href="{featured_url}" style="display:inline-block;background:#C9A84C;color:#1B2A4A;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:600;font-size:14px;">Read Now →</a>
    </div>
    """ if featured else ""

    dashboard_url = os.environ.get("NEXT_PUBLIC_APP_URL", "https://connectionos.app")

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <title>Connection OS · Week {week_number}</title>
    </head>
    <body style="margin:0;padding:0;background:#f3f4f6;font-family:Georgia,serif;">

      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
        <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr><td style="background:#1B2A4A;padding:32px;border-radius:8px 8px 0 0;">
            <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#C9A84C;margin-bottom:4px;">Connection OS</div>
            <div style="font-family:monospace;font-size:12px;color:#8A9DC0;">Week {week_number} of 12 · {week_start} to {week_end}</div>
          </td></tr>

          <!-- WEEK SUMMARY -->
          <tr><td style="background:#ffffff;padding:28px 32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
            <div style="font-size:15px;color:#374151;line-height:1.7;">{week_summary}</div>
          </td></tr>

          <!-- DEVELOPMENTS -->
          <tr><td style="background:#ffffff;padding:0 32px 28px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
            <div style="font-size:11px;font-weight:600;color:#C9A84C;letter-spacing:0.1em;font-family:monospace;padding-bottom:16px;border-bottom:1px solid #e5e7eb;margin-bottom:20px;">WHAT HAPPENED IN AI THIS WEEK</div>
            {dev_html}
          </td></tr>

          <!-- PURSUIT IMPLICATIONS -->
          <tr><td style="background:#fffbf0;padding:28px 32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;border-top:3px solid #C9A84C;">
            <div style="font-size:11px;font-weight:600;color:#C9A84C;letter-spacing:0.1em;font-family:monospace;margin-bottom:20px;">WHY THIS MATTERS FOR PURSUIT</div>
            {impl_html}
          </td></tr>

          <!-- COMPANIES TO WATCH -->
          <tr><td style="background:#ffffff;padding:28px 32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
            <div style="font-size:11px;font-weight:600;color:#C9A84C;letter-spacing:0.1em;font-family:monospace;margin-bottom:16px;">COMPANIES TO WATCH</div>
            {co_html}
          </td></tr>

          <!-- FEATURED RESOURCE -->
          <tr><td style="background:#ffffff;padding:0 32px 28px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
            {featured_html}
          </td></tr>

          <!-- FOOTER -->
          <tr><td style="background:#1B2A4A;padding:24px 32px;border-radius:0 0 8px 8px;">
            <a href="{dashboard_url}" style="color:#C9A84C;text-decoration:none;font-size:13px;">View full digest on dashboard →</a>
            <div style="font-size:11px;color:#8A9DC0;margin-top:12px;line-height:1.6;">
              Connection OS · Built for Pursuit<br>
              You're receiving this as Joanna Patterson, COO of Pursuit.<br>
              <a href="{dashboard_url}/settings" style="color:#8A9DC0;">Manage email settings</a>
            </div>
          </td></tr>

        </table>
        </td></tr>
      </table>

    </body>
    </html>
    """

    return html


async def send_digest_email() -> dict:
    """
    Fetches latest digest from Supabase
    and sends as HTML email via Resend.
    """

    # Get latest digest
    result = supabase.table("digests") \
        .select("*") \
        .order("generated_at", desc=True) \
        .limit(1) \
        .execute()

    if not result.data:
        return {
            "success": False,
            "error": "No digest found to send"
        }

    digest = result.data[0]

    # Build subject line
    developments = digest.get("ai_developments") or []
    top_headline = ""
    if developments:
        top_headline = developments[0].get("headline", "")[:60]

    subject = f"Connection OS · Week {digest['week_number']} · {top_headline}"

    # Build HTML
    html_content = build_email_html(digest)

    # Send via Resend
    try:
        response = resend.Emails.send({
            "from": os.environ.get("EMAIL_FROM", "digest@connectionos.app"),
            "to": os.environ.get("EMAIL_TO", "joanna@pursuit.org"),
            "subject": subject,
            "html": html_content
        })

        # Log to Supabase
        supabase.table("email_log").insert({
            "digest_id":   digest["id"],
            "week_number": digest["week_number"],
            "subject":     subject,
            "sent_to":     os.environ.get("EMAIL_TO"),
            "status":      "sent"
        }).execute()

        return {
            "success":     True,
            "email_id":    response.get("id"),
            "sent_to":     os.environ.get("EMAIL_TO"),
            "subject":     subject,
            "week_number": digest["week_number"]
        }

    except Exception as e:
        # Log failure
        supabase.table("email_log").insert({
            "digest_id":   digest["id"],
            "week_number": digest["week_number"],
            "subject":     subject,
            "sent_to":     os.environ.get("EMAIL_TO"),
            "status":      "failed"
        }).execute()

        return {
            "success": False,
            "error":   str(e)
        }
