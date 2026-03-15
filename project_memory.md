# Return Ready - Project Memory

## Project Overview
Return Ready (branded as "Connection OS") is a personalized AI digest platform designed to help professionals stay connected during extended leave periods (e.g., parental leave, sabbatical). The system automatically generates weekly digests combining AI industry news, company developments, and Slack highlights to help users "come back ready."

**Target Use Case**: 12-week leave period (March-May 2025)
**Core Value Proposition**: Stay informed without the overwhelm - curated, synthesized weekly updates delivered via email and web dashboard.

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **AI Model**: Anthropic Claude (claude-sonnet-4-6)
- **Deployment**: Heroku (via Procfile)
- **Key Libraries**:
  - `anthropic` - Claude API for digest synthesis
  - `apscheduler` - Cron job scheduling for weekly digest generation
  - `httpx` - Async HTTP requests for news fetching
  - `resend` - Email delivery service
  - `supabase-py` - Database client
  - `pydantic` - Data validation

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Authentication**: Supabase Auth (magic links, password, OAuth)
- **Deployment**: Vercel (assumed)
- **UI Components**: Custom components with accessibility focus

### Infrastructure
- **Database**: Supabase (auth + data storage)
- **Email**: Resend API
- **News Sources**: Web scraping + external APIs
- **Scheduling**: APScheduler for automated weekly tasks

## Main Features

### 1. Weekly Digest Generation
- **Auto-generation**: Runs every Sunday at 9 AM EST via APScheduler cron job
- **Content Sources**:
  - AI industry news (external APIs + web scraping)
  - Company developments (filtered for workforce-relevant companies, excluding big tech)
  - Slack highlights (when connected - currently placeholder)
- **AI Synthesis**: Uses Anthropic Claude (claude-sonnet-4-6) with custom prompt tailored to Pursuit's workforce development mission
- **Structured Output**: JSON format with sections for developments, implications, companies to watch, jobs/hiring trends, and featured resources
- **Storage**: Digests stored in Supabase with metadata (week number, dates, read status, source counts)
- **Rate Limiting**: Built-in retry logic for Anthropic API (65-second delays, 3 attempts)

### 2. Dashboard Interface
- **Home**: Latest digest with hero card display
- **Archive**: Historical digests (12 weeks total) with future weeks locked
- **Digest Detail**: Full digest view with navigation, sources panel, and structured sections
- **Settings**: Email preferences, Slack integration, Pursuit context customization
- **Account**: Profile management, sign-out

### 3. Email Delivery
- **Auto-send**: Configurable day/time (default: Monday 9 AM EST)
- **HTML Template**: Branded email with digest content
- **Test Email**: Manual test send from settings
- **Email Log**: Track delivery history

### 4. Authentication
- **Methods**: Magic link (passwordless), email/password, signup flow
- **Password Reset**: Secure reset flow via email
- **Session Management**: Supabase auth with middleware protection
- **Demo Mode**: Public demo dashboard at `/demo`

### 5. Progress Tracking
- **Week Counter**: Visual progress through 12-week leave period
- **Read Status**: Track which digests have been viewed
- **Stats Dashboard**: Total digests, unread count, next digest date

## Current Architecture

### Backend Routes
- `GET /` - Health check
- `GET /digest/latest` - Most recent digest
- `GET /digest/all` - All digests list
- `GET /digest/{id}` - Single digest detail
- `GET /digest/stats` - Digest statistics
- `POST /digest/generate` - Manual digest generation
- `GET /settings` - User settings
- `PATCH /settings` - Update settings
- `POST /settings/send-test-email` - Test email delivery
- `GET /settings/email-log` - Email history

### Database Schema (Supabase)
- **digests**: Weekly digest content and metadata
- **settings**: User preferences (email, Slack, Pursuit context)
- **email_log**: Email delivery tracking
- **users**: Supabase auth users

### Frontend Pages
- `/` - Dashboard home (latest digest)
- `/archive` - All digests
- `/digest/[id]` - Digest detail view
- `/settings` - User settings
- `/account` - Profile management
- `/login` - Authentication
- `/reset-password` - Password reset
- `/demo` - Public demo (no auth required)

## Known Issues & Limitations

1. **Slack Integration**: Placeholder implementation - returns empty array, not fully functional
2. **News Fetching**: Relies on web scraping which may be fragile
3. **Company Filtering**: Excludes Google, Apple, Microsoft, Meta, Amazon, OpenAI from "companies to watch" (hardcoded)
4. **Week Calculation**: Assumes fixed 12-week period starting from `LEAVE_START_DATE` env var (default: 2025-03-01)
5. **Single User**: Currently designed for single-user deployment (no multi-tenancy)
6. **Anthropic Rate Limits**: Has retry logic but may still fail after 3 attempts during high usage
7. **Token Limits**: News data is compressed to fit within Claude's context window (may lose detail)
8. **API Rate Limiting**: No rate limiting on FastAPI endpoints
9. **Caching**: No caching layer for digest data
10. **Error Recovery**: If digest generation fails mid-week, no automatic retry mechanism

## Next Steps & Roadmap

### High Priority
1. **Slack Integration**: Complete OAuth flow and message fetching
2. **Error Monitoring**: Add Sentry or similar for production error tracking
3. **Email Deliverability**: Test and optimize email templates for various clients
4. **Mobile Responsiveness**: Audit and improve mobile experience
5. **Testing**: Expand test coverage (currently minimal)

### Medium Priority
6. **Multi-user Support**: Add user isolation and permissions
7. **Customization**: Allow users to customize news sources and topics
8. **Export**: Add PDF/email export of digests
9. **Search**: Add search functionality across digests
10. **Analytics**: Track engagement metrics (opens, reads, time spent)

### Low Priority
11. **Dark Mode**: Add theme toggle
12. **Notifications**: Browser push notifications for new digests
13. **Social Sharing**: Share digest highlights
14. **API Documentation**: OpenAPI/Swagger docs
15. **Performance**: Optimize bundle size and load times

## Development Workflow

### Local Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
# Set up .env with Supabase credentials
python main.py

# Frontend
cd frontend
npm install
# Set up .env.local with Next.js env vars
npm run dev
```

### Environment Variables
- **Backend**: 
  - `SUPABASE_URL` - Supabase project URL
  - `SUPABASE_SERVICE_KEY` - Supabase service role key (admin access)
  - `ANTHROPIC_API_KEY` - Claude API key
  - `RESEND_API_KEY` - Email delivery API key
  - `ALLOWED_ORIGINS` - CORS allowed origins (comma-separated)
  - `LEAVE_START_DATE` - Start date for week calculation (default: 2025-03-01)
  - `PURSUIT_CONTEXT` - Fallback context if not in settings table
- **Frontend**: 
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
  - `NEXT_PUBLIC_BACKEND_URL` - FastAPI backend URL
  - `NEXT_PUBLIC_LEAVE_START_DATE` - Start date for week labels

### Testing
```bash
# Backend tests
cd backend
pytest

# Frontend (no tests currently)
cd frontend
npm test
```

### Deployment
- **Backend**: Heroku (auto-deploy from main branch)
- **Frontend**: Vercel (auto-deploy from main branch)

## Design Principles

1. **Accessibility First**: ARIA labels, keyboard navigation, skip links
2. **Progressive Enhancement**: Works without JavaScript for core content
3. **Mobile-First**: Responsive design from smallest screens up
4. **Performance**: Lazy loading, code splitting, optimized assets
5. **Privacy**: No tracking, minimal data collection
6. **Clarity**: Clear typography, generous whitespace, intuitive navigation
7. **Context-Aware AI**: Digest synthesis tailored to Pursuit's mission (workforce development, economic mobility, tech career training)
8. **Strategic Focus**: Filters out noise, surfaces only what matters for returning to work after leave

## Key Files Reference

- `backend/main.py` - FastAPI app entry point
- `backend/services/digest_synthesizer.py` - Core digest generation logic
- `backend/services/news_fetcher.py` - News aggregation
- `backend/services/email_sender.py` - Email delivery
- `backend/services/cron_jobs.py` - Scheduled tasks
- `frontend/app/(dashboard)/page.tsx` - Main dashboard
- `frontend/components/dashboard/DigestCard.tsx` - Digest display component
- `frontend/lib/api.ts` - API client and types
- `docs/product_brief.md` - Product requirements
- `docs/data_schema.md` - Database schema
- `docs/api_reference.md` - API documentation

## Contact & Resources

- **Repository**: [Add GitHub URL]
- **Production**: [Add production URL]
- **Staging**: [Add staging URL]
- **Documentation**: See `/docs` directory
