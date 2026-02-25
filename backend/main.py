import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import ai_digest, settings, team_intelligence
from services.cron_jobs import start_cron_jobs, stop_cron_jobs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Return Ready API...")
    start_cron_jobs()
    yield
    logger.info("Shutting down Return Ready API...")
    stop_cron_jobs()


app = FastAPI(
    title="Return Ready API",
    description="Private dashboard backend for team intelligence reports and AI trends digest.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(team_intelligence.router, prefix="/team-intel", tags=["Team Intelligence"])
app.include_router(ai_digest.router, prefix="/ai-digest", tags=["AI Digest"])
app.include_router(settings.router, prefix="/settings", tags=["Settings"])


@app.get("/")
async def root():
    return {"status": "Return Ready API running"}


@app.get("/health")
async def health():
    return {"status": "ok", "service": "Return Ready API"}
