-- =============================================================================
-- Migration: 006_action_plans.sql
-- Description: Creates public.action_plans table. Action plans are AI-generated
--              step-by-step guidance for a case, versioned over time.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- public.action_plans
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.action_plans (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id      UUID        NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  version      INTEGER     NOT NULL DEFAULT 1,
  summary      TEXT        NOT NULL,
  actions_json JSONB       NOT NULL DEFAULT '{}',
  sources_json JSONB       NOT NULL DEFAULT '[]',
  confidence   TEXT        DEFAULT 'unknown' CHECK (confidence IN ('high','medium','low','unknown')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.action_plans IS 'Versioned AI-generated action plans for a legal case. Each re-generation increments version.';
COMMENT ON COLUMN public.action_plans.actions_json IS 'Array of action step objects: {step, description, deadline?, authority?, urgency?}.';
COMMENT ON COLUMN public.action_plans.sources_json IS 'Array of cited legal source references used to generate this plan.';

-- Unique constraint: one version number per case
ALTER TABLE public.action_plans
  DROP CONSTRAINT IF EXISTS action_plans_case_version_unique;
ALTER TABLE public.action_plans
  ADD CONSTRAINT action_plans_case_version_unique UNIQUE (case_id, version);

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY (via case ownership)
-- ---------------------------------------------------------------------------
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "action_plans_select_owner" ON public.action_plans;
CREATE POLICY "action_plans_select_owner"
  ON public.action_plans FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = case_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "action_plans_insert_owner" ON public.action_plans;
CREATE POLICY "action_plans_insert_owner"
  ON public.action_plans FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = case_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "action_plans_update_owner" ON public.action_plans;
CREATE POLICY "action_plans_update_owner"
  ON public.action_plans FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = case_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "action_plans_delete_owner" ON public.action_plans;
CREATE POLICY "action_plans_delete_owner"
  ON public.action_plans FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = case_id AND c.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS action_plans_case_version_idx ON public.action_plans (case_id, version DESC);
