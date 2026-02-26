import pytest
from unittest.mock import patch, MagicMock
from services.email_sender import build_email_html, send_digest_email


def test_build_email_html_renders():
    digest = {
        "week_number": 1,
        "week_start": "2025-03-03",
        "week_end": "2025-03-09",
        "week_summary": "A strong week in AI.",
        "ai_developments": [
            {
                "headline": "Test Headline",
                "synthesis": "Something happened.",
                "why_it_matters": "It matters.",
                "source": "TechCrunch",
                "url": "https://techcrunch.com"
            }
        ],
        "pursuit_implications": [
            {
                "implication": "Update curriculum.",
                "reasoning": "New tools require new skills.",
                "priority": "HIGH"
            }
        ],
        "companies_to_watch": [
            {
                "name": "Acme AI",
                "what_they_do": "Builds hiring tools.",
                "why_watch_now": "Raised $10M.",
                "pursuit_relevance": "Relevant to placement team."
            }
        ],
        "featured_resource": {
            "title": "The AI Skills Gap",
            "publication": "Harvard Business Review",
            "url": "https://hbr.org",
            "why_joanna": "Directly relevant to Pursuit's curriculum planning.",
            "format": "Article",
            "read_time": "8 min"
        }
    }

    html = build_email_html(digest)
    assert "Connection OS" in html
    assert "Week 1" in html
    assert "Test Headline" in html
    assert "Update curriculum" in html
    assert "Acme AI" in html


@pytest.mark.asyncio
async def test_send_digest_email_no_digests():
    mock_result = MagicMock()
    mock_result.data = []

    with patch("services.email_sender.supabase") as mock_supabase:
        mock_supabase.table.return_value.select.return_value.order.return_value.limit.return_value.execute.return_value = mock_result
        result = await send_digest_email()

    assert result["success"] is False
    assert "No digest found" in result["error"]
