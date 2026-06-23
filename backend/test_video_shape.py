import asyncio
from services.video_ingestion import run_video_ingestion

REQUIRED_KEYS = {"title", "url", "source_type", "channel_name", "content", "publication_date"}
VALID_SOURCE_TYPES = {"video", "podcast"}

sources = asyncio.run(run_video_ingestion())

print(f"total sources: {len(sources)}\n")

passed = True
for i, s in enumerate(sources):
    missing_keys = REQUIRED_KEYS - set(s.keys())
    empty_fields = [k for k in REQUIRED_KEYS if not s.get(k)]
    bad_type = s.get("source_type") not in VALID_SOURCE_TYPES

    issues = []
    if missing_keys:
        issues.append(f"missing keys: {missing_keys}")
    if empty_fields:
        issues.append(f"empty fields: {empty_fields}")
    if bad_type:
        issues.append(f"invalid source_type: {s.get('source_type')!r}")

    status = "FAIL" if issues else "OK"
    if issues:
        passed = False

    print(f"[{status}] [{s.get('source_type','?')}] {s.get('title','')[:60]}")
    for issue in issues:
        print(f"       !! {issue}")

print(f"\n{'ALL PASSED' if passed else 'FAILURES ABOVE — check feed URLs or _entry_* helpers'}")