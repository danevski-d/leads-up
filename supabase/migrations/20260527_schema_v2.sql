-- ================================================================
-- MIGRATION V2: Pipeline tracking + workspace config
-- RUN IN: Supabase Dashboard → SQL Editor → New Query → Run
-- ================================================================

-- Leads: add pipeline + nurture tracking columns
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS status              TEXT        NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS qualified           BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS company             TEXT,
  ADD COLUMN IF NOT EXISTS lead_score          INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS qualification_notes TEXT,
  ADD COLUMN IF NOT EXISTS nurture_step        INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS next_followup_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_contacted_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS call_id             TEXT,
  ADD COLUMN IF NOT EXISTS call_duration       INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS call_summary        TEXT,
  ADD COLUMN IF NOT EXISTS email_thread_id     TEXT;

-- Workspaces: add per-client config
ALTER TABLE public.workspaces
  ADD COLUMN IF NOT EXISTS calendly_link       TEXT,
  ADD COLUMN IF NOT EXISTS notification_email  TEXT,
  ADD COLUMN IF NOT EXISTS reply_from_name     TEXT        NOT NULL DEFAULT 'Maya';

-- Indexes for nurture loop queries
CREATE INDEX IF NOT EXISTS idx_leads_nurture
  ON public.leads(status, next_followup_at)
  WHERE status = 'contacted';

CREATE INDEX IF NOT EXISTS idx_leads_ws_created
  ON public.leads(workspace_id, created_at);

-- ================================================================
-- DONE. Verify with:
--   SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'leads' ORDER BY ordinal_position;
-- ================================================================
