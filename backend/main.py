from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import digest, settings
import os

app = FastAPI(title="Connection OS API")

_raw = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000")
_allowed_origins = [o.strip() for o in _raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(digest.router, prefix="/digest", tags=["Digest"])
app.include_router(settings.router, prefix="/settings", tags=["Settings"])


@app.on_event("startup")
def start_scheduler():
    from services.cron_jobs import start_cron_jobs
    start_cron_jobs()


@app.get("/")
def health():
    return {"status": "Connection OS is running"}
