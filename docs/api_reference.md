# Return Ready API Reference (Pivot)

Base URL: `http://localhost:8000`

## Team Intelligence

### `GET /team-intel/overview`
Returns latest biweekly/monthly metadata + report counts + people tracked.

### `GET /team-intel/biweekly`
List all biweekly reports (newest first).

### `POST /team-intel/biweekly/generate`
Generate biweekly report for provided period, or the latest rolling 14 days.

### `GET /team-intel/monthly`
List all monthly reports.

### `POST /team-intel/monthly/generate`
Generate monthly report for current or supplied month/year.

### `GET /team-intel/by-person`
Return KPI trend/flags/reported-items grouped by person.

### `POST /team-intel/pull/run`
Manual trigger for Google data pull job.

## AI Digest

### `GET /ai-digest/`
List weekly AI digests (newest first).

### `POST /ai-digest/generate`
Generate the current week's digest.

## Settings

### `GET /settings/documents`
List connected data sources.

### `POST /settings/documents`
Create or update connected document metadata.

### `GET /settings/management`
Get management tier state.

### `POST /settings/management/toggle`
Enable or disable management tier.

## Health

### `GET /health`
Returns service health.
