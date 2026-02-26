# Connection OS — Supabase Schema

Run this SQL in the Supabase SQL editor before starting.

```sql
-- Weekly AI digests
CREATE TABLE digests (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_number           INTEGER NOT NULL,
  week_start            DATE NOT NULL,
  week_end              DATE NOT NULL,
  week_summary          TEXT,
  ai_developments       JSONB,
  slack_highlights      JSONB,
  pursuit_implications  JSONB,
  companies_to_watch    JSONB,
  jobs_and_hiring       JSONB,
  featured_resource     JSONB,
  full_digest_json      JSONB,
  external_source_count INTEGER DEFAULT 0,
  slack_message_count   INTEGER DEFAULT 0,
  generated_at          TIMESTAMPTZ DEFAULT NOW(),
  is_read               BOOLEAN DEFAULT FALSE,
  read_at               TIMESTAMPTZ
);

-- App settings and Pursuit context
CREATE TABLE settings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pursuit_context         TEXT,
  external_news_enabled   BOOLEAN DEFAULT TRUE,
  email_enabled           BOOLEAN DEFAULT TRUE,
  email_send_day          TEXT DEFAULT 'monday',
  email_send_time         TEXT DEFAULT '08:00',
  slack_connected         BOOLEAN DEFAULT FALSE,
  slack_channel           TEXT DEFAULT 'ai',
  slack_last_synced       TIMESTAMPTZ,
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings row
INSERT INTO settings (id, pursuit_context)
VALUES (
  gen_random_uuid(),
  'Pursuit is a workforce development nonprofit in New York City that trains adults from underrepresented backgrounds for tech careers. Fellows complete a 12-month program covering software engineering, professional skills, and job placement. COO Joanna Patterson oversees operations, programs, and team performance.'
);

-- Email delivery log
CREATE TABLE email_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_id    UUID REFERENCES digests(id),
  week_number  INTEGER,
  subject      TEXT,
  sent_to      TEXT,
  sent_at      TIMESTAMPTZ DEFAULT NOW(),
  status       TEXT DEFAULT 'sent'
);

-- Row Level Security
ALTER TABLE digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth only" ON digests
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth only" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Auth only" ON email_log
  FOR ALL USING (auth.role() = 'authenticated');
```
