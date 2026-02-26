import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from datetime import date
from services.digest_synthesizer import generate_digest


@pytest.mark.asyncio
async def test_generate_digest_news_fetch_failure():
    with patch("services.digest_synthesizer.fetch_ai_news", new_callable=AsyncMock) as mock_fetch:
        mock_fetch.return_value = {"success": False, "error": "API unavailable"}

        with patch("services.digest_synthesizer.supabase"):
            result = await generate_digest(date(2025, 3, 3))

    assert result["success"] is False
    assert result["error"] == "News fetch failed"


@pytest.mark.asyncio
async def test_generate_digest_success():
    mock_news = {
        "success": True,
        "source_count": 5,
        "data": {
            "week_of": "2025-03-03",
            "developments": [],
            "companies_to_watch": [],
            "jobs_and_hiring": [],
            "featured_resource": {}
        }
    }

    mock_digest_json = '{"week_summary": "Test week", "ai_developments": [], "slack_highlights": {}, "pursuit_implications": [], "companies_to_watch": [], "jobs_and_hiring": {}, "featured_resource": {}}'

    mock_content = MagicMock()
    mock_content.text = mock_digest_json
    mock_response = MagicMock()
    mock_response.content = [mock_content]

    mock_insert = MagicMock()
    mock_insert.data = [{"id": "test-uuid-123"}]

    mock_settings = MagicMock()
    mock_settings.data = [{"pursuit_context": "Test context"}]

    with patch("services.digest_synthesizer.fetch_ai_news", new_callable=AsyncMock, return_value=mock_news):
        with patch("services.digest_synthesizer.client") as mock_client:
            mock_client.messages.create.return_value = mock_response
            with patch("services.digest_synthesizer.supabase") as mock_supabase:
                mock_supabase.table.return_value.select.return_value.limit.return_value.execute.return_value = mock_settings
                mock_supabase.table.return_value.insert.return_value.execute.return_value = mock_insert

                result = await generate_digest(date(2025, 3, 3))

    assert result["success"] is True
    assert "digest_id" in result
