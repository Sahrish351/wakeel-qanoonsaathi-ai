-- =============================================================================
-- Migration: 010_consultations.sql
-- Description: Creates public.consultations table connecting citizens and
--              lawyers on specific cases with strict privacy consent, status
--              workflow, and Row-Level Security policies.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- HELPER: Ensure is_admin() function exists
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY INVOKER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- public.consultations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultations (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id          UUID        NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id          UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lawyer_id        UUID        NOT NULL REFERENCES public.lawyers(id) ON DELETE CASCADE,
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending','accepted','declined','scheduled','completed','cancelled')),
  requested_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_at     TIMESTAMPTZ,
  consented_fields TEXT[]      NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.consultations IS 'Legal consultation requests between citizens and lawyers regarding a specific case.';
COMMENT ON COLUMN public.consultations.consented_fields IS 'Array of case fields the citizen explicitly consented to share with the lawyer (e.g. summary, timeline, evidence, identity).';
COMMENT ON COLUMN public.consultations.status IS 'pending | accepted | declined | scheduled | completed | cancelled';

-- Trigger to maintain updated_at
DROP TRIGGER IF EXISTS consultations_set_updated_at ON public.consultations;
CREATE TRIGGER consultations_set_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS consultations_case_id_idx ON public.consultations (case_id);
CREATE INDEX IF NOT EXISTS consultations_user_id_idx ON public.consultations (user_id);
CREATE INDEX IF NOT EXISTS consultations_lawyer_id_idx ON public.consultations (lawyer_id);
CREATE INDEX IF NOT EXISTS consultations_status_idx ON public.consultations (status);
CREATE INDEX IF NOT EXISTS consultations_requested_at_idx ON public.consultations (requested_at DESC);
CREATE INDEX IF NOT EXISTS consultations_scheduled_at_idx ON public.consultations (scheduled_at) WHERE scheduled_at IS NOT NULL;

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — public.consultations
-- ---------------------------------------------------------------------------
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- 1. SELECT:
--    - Citizen sees own consultations (user_id = auth.uid())
--    - Lawyer sees assigned consultations (lawyers.profile_id = auth.uid())
--    - Admin sees all consultations
DROP POLICY IF EXISTS "consultations_select_party_or_admin" ON public.consultations;
CREATE POLICY "consultations_select_party_or_admin"
  ON public.consultations FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id AND l.profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- 2. INSERT:
--    - Citizens can request consultations for their own cases
--    - Admin can create consultations
DROP POLICY IF EXISTS "consultations_insert_citizen_or_admin" ON public.consultations;
CREATE POLICY "consultations_insert_citizen_or_admin"
  ON public.consultations FOR INSERT
  WITH CHECK (
    (
      user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.cases c
        WHERE c.id = case_id AND c.user_id = auth.uid()
      )
    )
    OR public.is_admin()
  );

-- 3. UPDATE:
--    - Citizen can update status (e.g., cancel request, update consent)
--    - Lawyer can update status (e.g., accept, decline, schedule, complete)
--    - Admin can update all fields
DROP POLICY IF EXISTS "consultations_update_party_or_admin" ON public.consultations;
CREATE POLICY "consultations_update_party_or_admin"
  ON public.consultations FOR UPDATE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id AND l.profile_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id AND l.profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- 4. DELETE:
--    - Admins only (audit trail preservation; citizens cancel rather than delete)
DROP POLICY IF EXISTS "consultations_delete_admin" ON public.consultations;
CREATE POLICY "consultations_delete_admin"
  ON public.consultations FOR DELETE
  USING (public.is_admin());
