# Checkpoint 3 — Feature Exploration

## Artifact
I used the terminal workflow to explore a real feature idea for Return-Ready: adding a scraper or ingestion flow for tech videos and podcasts, such as Y Combinator videos and the NVIDIA AI Podcast, so relevant discussions can be turned into digest content.

Aider’s proposed implementation direction was:

- create a separate `backend/services/media_fetcher.py`
- integrate media summaries into `backend/services/digest_synthesizer.py`
- add settings/configuration support for media sources
- add a database table for tracking processed videos and podcasts
- start with a narrow MVP, such as Y Combinator videos only and storing summaries instead of full transcripts

Aider also suggested that the safest architecture would be a separate media fetcher rather than overloading the existing news fetcher immediately.

## Reflection
I didn’t really get to the point of fully building the feature yet, but I did use the terminal workflow to explore and plan a real feature I’d want to add. Working without seeing the code in an editor felt more uncomfortable than freeing at first, because I’m used to visually scanning the file tree and codebase in VS Code. In the terminal, I trusted the AI more for mapping and planning, but less for blind execution. I had to be more deliberate about the context I gave it and more cautious about what I accepted.