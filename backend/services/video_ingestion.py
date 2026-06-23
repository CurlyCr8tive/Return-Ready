import feedparser
import httpx

# TODO: verify channel ID matches https://www.youtube.com/@ycombinator before deploy
YC_YOUTUBE_FEED = (
    "https://www.youtube.com/feeds/videos.xml"
    "?channel_id=UCcefcZRL2oaA_uBNeo5UOWg"
)

# Verified 2026-06-09 via podnews.net — Anchor/Spotify for Podcasters RSS
AI_DAILY_BRIEF_FEED = "https://anchor.fm/s/f7cac464/podcast/rss"


def _fetch_feed(url: str) -> feedparser.FeedParserDict:
    """Fetch a feed URL via httpx (uses certifi for SSL) and parse with feedparser."""
    response = httpx.get(url, follow_redirects=True, timeout=15)
    response.raise_for_status()
    return feedparser.parse(response.text)


def _entry_content(entry) -> str:
    """Return the best available text content from a feed entry."""
    if entry.get("summary"):
        return entry.summary
    content_list = entry.get("content", [])
    if content_list:
        return content_list[0].get("value", "")
    return ""


def _entry_url(entry) -> str:
    """Return the primary URL from a feed entry."""
    return entry.get("link", "")


def _entry_published(entry) -> str:
    """Return the publication date string from a feed entry, falling back to updated."""
    return entry.get("published", "") or entry.get("updated", "")


def _fetch_youtube_videos(feed_url: str, limit: int = 5) -> list[dict]:
    feed = _fetch_feed(feed_url)
    if feed.bozo and not feed.entries:
        raise ValueError(f"YouTube feed parse error: {feed.bozo_exception}")
    return [
        {
            "title":            entry.get("title", ""),
            "url":              _entry_url(entry),
            "source_type":      "video",
            "channel_name":     "Y Combinator",
            "content":          _entry_content(entry),
            "publication_date": _entry_published(entry),
        }
        for entry in feed.entries[:limit]
    ]


def _fetch_podcast_episodes(feed_url: str, limit: int = 5) -> list[dict]:
    feed = _fetch_feed(feed_url)
    if feed.bozo and not feed.entries:
        raise ValueError(f"Podcast feed parse error: {feed.bozo_exception}")
    return [
        {
            "title":            entry.get("title", ""),
            "url":              _entry_url(entry),
            "source_type":      "podcast",
            "channel_name":     "The AI Daily Brief",
            "content":          _entry_content(entry),
            "publication_date": _entry_published(entry),
        }
        for entry in feed.entries[:limit]
    ]


async def run_video_ingestion() -> list[dict]:
    """
    Fetches up to 5 recent items from each approved source.
    Each feed is fetched independently — one failure does not block the other.
    Returns combined list, or [] if both feeds fail.
    """
    sources = []

    try:
        videos = _fetch_youtube_videos(YC_YOUTUBE_FEED)
        print(f"Video ingestion: fetched {len(videos)} YC YouTube videos")
        sources.extend(videos)
    except Exception as e:
        print(f"Video ingestion: YC YouTube feed failed: {e}")

    try:
        episodes = _fetch_podcast_episodes(AI_DAILY_BRIEF_FEED)
        print(f"Video ingestion: fetched {len(episodes)} AI Daily Brief episodes")
        sources.extend(episodes)
    except Exception as e:
        print(f"Video ingestion: AI Daily Brief feed failed: {e}")

    return sources
