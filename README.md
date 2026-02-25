# Return Ready

Return Ready is Joanna's private parental-leave dashboard.

It synthesizes team Google Sheets/Docs data into biweekly and monthly reports, and publishes a weekly AI news/trends digest focused on implications for Pursuit.

## Stack

- Frontend: Next.js + Tailwind CSS
- Backend: FastAPI
- Database/Auth: Supabase (magic link)
- AI: Claude API (team synthesis + AI digest)
- Integrations: Google Drive API (service account, read-only)
- Scheduler: APScheduler

## Product Views

1. Overview
2. Biweekly Reports
3. Monthly Reports
4. By Person
5. AI News Digest
6. Settings

## Local Run

```bash
cd connection-os/frontend
npm install
npm run dev
```

```bash
cd connection-os/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Key API Groups

- `/team-intel/*`
- `/ai-digest/*`
- `/settings/*`

See `docs/data_schema.md` and `docs/api_reference.md` for full details.
