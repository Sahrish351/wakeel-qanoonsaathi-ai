-- =============================================================================
-- Migration: 002_cases.sql
-- Description: Creates public.cases, public.case_facts, and public.case_events
--              tables with full RLS (owner-only CRUD) and supporting indexes.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- public.cases
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cases (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        TEXT        NOT NULL,
  category     TEXT        NOT NULL CHECK (category IN (
                 'police_criminal','cybercrime','harassment_stalking','womens_rights',
                 'family','property','employment','business_compliance','consumer',
                 'tax','contract','fraud_scam','human_rights','other'
               )),
  jurisdiction TEXT,
  urgency      TEXT        DEFAULT 'unknown' CHECK (urgency IN ('emergency','high','moderate','routine','unknown')),
  status       TEXT        DEFAULT 'open'    CHECK (status IN ('open','in_progress','resolved','closed','escalated')),
  summary      TEXT,
  confidence   NUMERIC(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.cases IS 'A single legal matter / situation being managed by the user.';
COMMENT ON COLUMN public.cases.confidence IS 'AI confidence score 0.00–1.00 for the generated case summary.';

DROP TRIGGER IF EXISTS cases_set_updated_at ON public.cases;
CREATE TRIGGER cases_set_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- public.case_facts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.case_facts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     UUID        NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  fact_key    TEXT        NOT NULL,
  fact_value  TEXT        NOT NULL,
  confidence  NUMERIC(3,2) CHECK (confidence >= 0 AND confidence <= 1),
  source      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.case_facts IS 'Structured facts extracted from user input or documents for a given case.';

-- ---------------------------------------------------------------------------
-- public.case_events
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.case_events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id     UUID        NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  event_type  TEXT        NOT NULL,
  title       TEXT        NOT NULL,
  description TEXT,
  occurred_at TIMESTAMPTZ NOT NULL,
  created_by  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.case_events IS 'Timestamped timeline events attached to a case (e.g., incident, hearing, submission).';

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — cases
-- ---------------------------------------------------------------------------
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cases_select_owner" ON public.cases;
CREATE POLICY "cases_select_owner"
  ON public.cases FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "cases_insert_owner" ON public.cases;
CREATE POLICY "cases_insert_owner"
  ON public.cases FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "cases_update_owner" ON public.cases;
CREATE POLICY "cases_update_owner"
  ON public.cases FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "cases_delete_owner" ON public.cases;
CREATE POLICY "cases_delete_owner"
  ON public.cases FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — case_facts (via case ownership)
-- ---------------------------------------------------------------------------
ALTER TABLE public.case_facts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "case_facts_select_owner" ON public.case_facts;
CREATE POLICY "case_facts_select_owner"
  ON public.case_facts FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "case_facts_insert_owner" ON public.case_facts;
CREATE POLICY "case_facts_insert_owner"
  ON public.case_facts FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "case_facts_update_owner" ON public.case_facts;
CREATE POLICY "case_facts_update_owner"
  ON public.case_facts FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "case_facts_delete_owner" ON public.case_facts;
CREATE POLICY "case_facts_delete_owner"
  ON public.case_facts FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND c.user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — case_events (via case ownership)
-- ---------------------------------------------------------------------------
ALTER TABLE public.case_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "case_events_select_owner" ON public.case_events;
CREATE POLICY "case_events_select_owner"
  ON public.case_events FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "case_events_insert_owner" ON public.case_events;
CREATE POLICY "case_events_insert_owner"
  ON public.case_events FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "case_events_update_owner" ON public.case_events;
CREATE POLICY "case_events_update_owner"
  ON public.case_events FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND c.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "case_events_delete_owner" ON public.case_events;
CREATE POLICY "case_events_delete_owner"
  ON public.case_events FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND c.user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS cases_user_updated_idx  ON public.cases (user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS cases_user_status_idx   ON public.cases (user_id, status);
CREATE INDEX IF NOT EXISTS case_facts_case_idx     ON public.case_facts (case_id);
CREATE INDEX IF NOT EXISTS case_events_case_at_idx ON public.case_events (case_id, occurred_at DESC);
