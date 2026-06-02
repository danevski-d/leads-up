-- ================================================================
-- MIGRATION: Multi-tenant schema for useleadsup.com
-- ================================================================
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → New Query → paste → Run
-- ================================================================
-- What this does:
--   1. Creates workspaces table (one row per paying client)
--   2. Creates prospects table (YOUR OWN sales CRM, admin-only)
--   3. Extends profiles with role (superadmin|client) + workspace_id
--   4. Creates is_superadmin() and my_workspace_id() helper functions
--   5. Replaces all RLS policies:
--        - superadmin bypasses everything
--        - clients only see their own workspace data
--        - prospects table is superadmin-only
--   6. Adds indexes for performance
--   7. Sets 19dragan96@gmail.com as superadmin
-- ================================================================


-- ----------------------------------------------------------------
-- 1. WORKSPACES
--    One row per paying client company.
--    webhook_token is how n8n knows which workspace a lead belongs to.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workspaces (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Client identity
  name              TEXT        NOT NULL,           -- "Smith HVAC LLC"
  slug              TEXT        UNIQUE NOT NULL,     -- "smith-hvac" (URL-safe)
  owner_email       TEXT        NOT NULL,            -- client's login email
  owner_user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Business context
  industry          TEXT,
  company_website   TEXT,

  -- Plan & billing
  plan              TEXT        NOT NULL DEFAULT 'trial'
                                CHECK (plan IN ('trial','growth','scale','enterprise')),
  status            TEXT        NOT NULL DEFAULT 'trial'
                                CHECK (status IN ('active','trial','paused','cancelled')),
  trial_ends_at     TIMESTAMPTZ,
  monthly_lead_cap  INTEGER     NOT NULL DEFAULT 500,

  -- n8n integration token
  -- Client's form/webhook includes this so n8n routes leads correctly.
  webhook_token     TEXT        UNIQUE NOT NULL
                                DEFAULT encode(gen_random_bytes(32), 'hex'),

  -- Internal notes (admin only)
  notes             TEXT
);

-- updated_at trigger for workspaces
CREATE TRIGGER workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- ----------------------------------------------------------------
-- 2. EXTEND PROFILES
--    Add role (superadmin | client) and workspace_id FK.
-- ----------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role         TEXT NOT NULL DEFAULT 'client'
                                        CHECK (role IN ('superadmin', 'client')),
  ADD COLUMN IF NOT EXISTS workspace_id UUID
                                        REFERENCES public.workspaces(id)
                                        ON DELETE SET NULL;


-- ----------------------------------------------------------------
-- 3. PROSPECTS TABLE
--    YOUR OWN sales CRM — the people you are selling LeadsUp to.
--    Completely separate from client leads. Superadmin-only.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prospects (
  id                  BIGSERIAL   PRIMARY KEY,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Contact info
  name                TEXT        NOT NULL DEFAULT '',
  email               TEXT,
  phone               TEXT,
  company             TEXT,

  -- Pipeline stage (your sales process for LeadsUp)
  source              TEXT,       -- 'website_chat', 'gmail', 'referral', 'cold_outbound'
  chat_source         TEXT,
  status              TEXT        NOT NULL DEFAULT 'new'
                                  CHECK (status IN (
                                    'new', 'contacted', 'demo_booked',
                                    'proposal_sent', 'won', 'lost'
                                  )),
  value               NUMERIC     NOT NULL DEFAULT 0,
  notes               TEXT,

  -- Business context (from chat/form)
  business_type       TEXT,
  monthly_leads       TEXT,
  challenge           TEXT,
  current_tools       TEXT,
  industry            TEXT,

  -- AI qualification output
  lead_score          INTEGER     NOT NULL DEFAULT 0,
  qualified           BOOLEAN     NOT NULL DEFAULT FALSE,
  qualification_notes TEXT,
  pain_points         TEXT,
  service_match       TEXT,

  -- Communication tracking
  email_thread_id     TEXT,
  last_contacted_at   TIMESTAMPTZ,
  booked_at           TIMESTAMPTZ,

  -- Retell call data
  call_duration       INTEGER,
  call_summary        TEXT,
  call_recording_url  TEXT
);

CREATE TRIGGER prospects_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();


-- ----------------------------------------------------------------
-- 4. HELPER FUNCTIONS FOR RLS
-- ----------------------------------------------------------------

-- Returns TRUE if the current authenticated user is a superadmin.
-- SECURITY DEFINER so it runs as the function owner, not the caller.
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'superadmin'
     FROM public.profiles
     WHERE id = auth.uid()),
    FALSE
  );
$$;

-- Returns the workspace_id of the current authenticated user.
CREATE OR REPLACE FUNCTION public.my_workspace_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT workspace_id
  FROM public.profiles
  WHERE id = auth.uid();
$$;


-- ----------------------------------------------------------------
-- 5. RLS — WORKSPACES
-- ----------------------------------------------------------------
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Superadmin: full CRUD on all workspaces
CREATE POLICY "superadmin_workspaces"
  ON public.workspaces
  FOR ALL
  USING (public.is_superadmin())
  WITH CHECK (public.is_superadmin());

-- Clients: read their own workspace only (no writes)
CREATE POLICY "client_own_workspace_read"
  ON public.workspaces
  FOR SELECT
  USING (
    NOT public.is_superadmin()
    AND id = public.my_workspace_id()
  );


-- ----------------------------------------------------------------
-- 6. RLS — LEADS  (replace old single-user policies)
-- ----------------------------------------------------------------

-- Drop all old owner-based policies
DROP POLICY IF EXISTS "owner select leads"            ON public.leads;
DROP POLICY IF EXISTS "owner insert leads"            ON public.leads;
DROP POLICY IF EXISTS "owner update leads"            ON public.leads;
DROP POLICY IF EXISTS "owner delete leads"            ON public.leads;
-- Also drop any previously created multi-tenant policies (idempotent re-run)
DROP POLICY IF EXISTS "superadmin_leads"              ON public.leads;
DROP POLICY IF EXISTS "client_workspace_leads"        ON public.leads;

-- Superadmin: see and modify ALL leads across all workspaces
CREATE POLICY "superadmin_leads"
  ON public.leads
  FOR ALL
  USING (public.is_superadmin())
  WITH CHECK (public.is_superadmin());

-- Clients: only see leads that belong to their workspace
CREATE POLICY "client_workspace_leads"
  ON public.leads
  FOR ALL
  USING (
    NOT public.is_superadmin()
    AND workspace_id = public.my_workspace_id()
  )
  WITH CHECK (
    NOT public.is_superadmin()
    AND workspace_id = public.my_workspace_id()
  );


-- ----------------------------------------------------------------
-- 7. RLS — PROSPECTS  (superadmin only)
-- ----------------------------------------------------------------
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

-- Only superadmin can access prospects
CREATE POLICY "superadmin_prospects"
  ON public.prospects
  FOR ALL
  USING (public.is_superadmin())
  WITH CHECK (public.is_superadmin());


-- ----------------------------------------------------------------
-- 8. RLS — PROFILES  (extend existing)
-- ----------------------------------------------------------------

-- Drop old narrow policies before replacing
DROP POLICY IF EXISTS "users view own profile"         ON public.profiles;
DROP POLICY IF EXISTS "users update own profile"       ON public.profiles;
DROP POLICY IF EXISTS "users insert own profile"       ON public.profiles;
DROP POLICY IF EXISTS "superadmin_profiles"            ON public.profiles;
DROP POLICY IF EXISTS "users_own_profile_select"       ON public.profiles;
DROP POLICY IF EXISTS "users_own_profile_update"       ON public.profiles;
DROP POLICY IF EXISTS "users_own_profile_insert"       ON public.profiles;

-- Superadmin: full access to all profiles (needed to manage clients)
CREATE POLICY "superadmin_profiles"
  ON public.profiles
  FOR ALL
  USING (public.is_superadmin())
  WITH CHECK (public.is_superadmin());

-- Every user: can read and update their own profile
CREATE POLICY "users_own_profile_select"
  ON public.profiles
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "users_own_profile_update"
  ON public.profiles
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_own_profile_insert"
  ON public.profiles
  FOR INSERT
  WITH CHECK (id = auth.uid());


-- ----------------------------------------------------------------
-- 9. INDEXES
-- ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_leads_workspace_id
  ON public.leads(workspace_id);

CREATE INDEX IF NOT EXISTS idx_leads_status
  ON public.leads(status);

CREATE INDEX IF NOT EXISTS idx_profiles_workspace_id
  ON public.profiles(workspace_id);

CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_workspaces_webhook_token
  ON public.workspaces(webhook_token);

CREATE INDEX IF NOT EXISTS idx_workspaces_status
  ON public.workspaces(status);

CREATE INDEX IF NOT EXISTS idx_workspaces_owner_user_id
  ON public.workspaces(owner_user_id);

CREATE INDEX IF NOT EXISTS idx_prospects_email
  ON public.prospects(email);

CREATE INDEX IF NOT EXISTS idx_prospects_status
  ON public.prospects(status);


-- ----------------------------------------------------------------
-- 10. SET YOURSELF AS SUPERADMIN
-- ----------------------------------------------------------------
UPDATE public.profiles
SET role = 'superadmin'
WHERE email = '19dragan96@gmail.com';


-- ================================================================
-- DONE. Verify with:
--
--   SELECT id, email, role, workspace_id FROM public.profiles;
--   SELECT id, name, webhook_token, status FROM public.workspaces;
--   SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
--
-- NEXT: Create your first client workspace by running:
--
--   INSERT INTO public.workspaces (name, slug, owner_email, plan, status)
--   VALUES ('Client Name', 'client-slug', 'client@email.com', 'growth', 'active')
--   RETURNING id, webhook_token;
--
-- Copy the webhook_token — give it to the client for their form.
-- ================================================================
