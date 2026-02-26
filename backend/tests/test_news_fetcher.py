import pytest
from unittest.mock import patch, MagicMock
from services.news_fetcher import fetch_ai_news


@pytest.mark.asyncio
async def test_fetch_ai_news_success():
    mock_block = MagicMock()
    mock_block.type = "text"
    mock_block.text = '{"week_of": "2025-03-03", "developments": [], "companies_to_watch": [], "jobs_and_hiring": [], "featured_resource": {}}'

    mock_response = MagicMock()
    mock_response.content = [mock_block]

    with patch("services.news_fetcher.client") as mock_client:
        mock_client.messages.create.return_value = mock_response
        result = await fetch_ai_news()

    assert result["success"] is True
    assert "data" in result
    assert "source_count" in result


@pytest.mark.asyncio
async def test_fetch_ai_news_json_parse_error():
    mock_block = MagicMock()
    mock_block.type = "text"
    mock_block.text = "This is not JSON"

    mock_response = MagicMock()
    mock_response.content = [mock_block]

    with patch("services.news_fetcher.client") as mock_client:
        mock_client.messages.create.return_value = mock_response
        result = await fetch_ai_news()

    assert result["success"] is False
    assert "error" in result
