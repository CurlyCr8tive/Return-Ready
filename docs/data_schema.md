# Return Ready — Supabase Schema (Pivot)

```sql
CREATE TABLE connected_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('google_docs', 'google_sheets')),
  doc_type TEXT NOT NULL,
  doc_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  management_tier BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_weekly_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_name TEXT NOT NULL,
  week_start DATE NOT NULL,
  kpi_name TEXT NOT NULL,
  kpi_value TEXT,
  notes TEXT,
  flag TEXT,
  source_doc_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_weekly_updates_week ON team_weekly_updates(week_start);
CREATE INDEX idx_weekly_updates_owner ON team_weekly_updates(owner_name);

CREATE TABLE team_standups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL,
  owner_name TEXT,
  update_text TEXT NOT NULL,
  source_doc_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_standups_date ON team_standups(entry_date);

CREATE TABLE team_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN ('biweekly', 'monthly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  month INT,
  year INT,
  sections JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX uniq_biweekly_report
  ON team_reports(report_type, period_start, period_end)
  WHERE report_type = 'biweekly';

CREATE UNIQUE INDEX uniq_monthly_report
  ON team_reports(report_type, month, year)
  WHERE report_type = 'monthly';

CREATE TABLE ai_weekly_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE UNIQUE NOT NULL,
  week_end DATE NOT NULL,
  sections JSONB NOT NULL,
  source_links JSONB DEFAULT '[]'::jsonb,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE data_pull_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pulled_at TIMESTAMPTZ NOT NULL,
  documents_seen INT DEFAULT 0,
  weekly_updates_written INT DEFAULT 0,
  standup_rows_written INT DEFAULT 0,
  status TEXT DEFAULT 'ok'
);

CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Notes

- Backend writes with service role key.
- Dashboard is private to Joanna (magic link auth).
- Management tier flag controls optional secondary data layer.
