-- =============================================================================
-- Migration: 011_feedback_audit.sql
-- Description: Creates public.feedback and public.audit_logs tables for
--              user safety reviews, AI response feedback, and immutable
--              security audit tracking with strict RLS policies.
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
-- public.feedback
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  case_id    UUID        REFERENCES public.cases(id) ON DELETE SET NULL,
  message_id UUID        REFERENCES public.messages(id) ON DELETE SET NULL,
  rating     TEXT        NOT NULL CHECK (rating IN ('helpful','not_helpful','unsafe','request_review')),
  comment    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.feedback IS 'Citizen and lawyer ratings and safety reports on AI messages and legal workflows.';
COMMENT ON COLUMN public.feedback.rating IS 'helpful | not_helpful | unsafe | request_review';

-- ---------------------------------------------------------------------------
-- public.audit_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_role  TEXT        NOT NULL,
  action      TEXT        NOT NULL,
  entity_type TEXT        NOT NULL,
  entity_id   UUID,
  metadata    JSONB       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_logs IS 'Append-only regulatory and security audit log tracking administrative, consent, and data access actions.';

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS feedback_user_id_idx ON public.feedback (user_id);
CREATE INDEX IF NOT EXISTS feedback_case_id_idx ON public.feedback (case_id);
CREATE INDEX IF NOT EXISTS feedback_message_id_idx ON public.feedback (message_id);
CREATE INDEX IF NOT EXISTS feedback_rating_idx ON public.feedback (rating);
CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON public.feedback (created_at DESC);

CREATE INDEX IF NOT EXISTS audit_logs_actor_id_idx ON public.audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON public.audit_logs (action);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON public.audit_logs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs (created_at DESC);

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — public.feedback
-- ---------------------------------------------------------------------------
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Owner can read own feedback; admins can read all
DROP POLICY IF EXISTS "feedback_select_owner_or_admin" ON public.feedback;
CREATE POLICY "feedback_select_owner_or_admin"
  ON public.feedback FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_admin()
  );

-- 2. INSERT: Users can submit feedback for their own actions or anonymously
DROP POLICY IF EXISTS "feedback_insert_owner_or_admin" ON public.feedback;
CREATE POLICY "feedback_insert_owner_or_admin"
  ON public.feedback FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    OR user_id IS NULL
    OR public.is_admin()
  );

-- 3. UPDATE: Owner can update their own feedback comment; admins can update
DROP POLICY IF EXISTS "feedback_update_owner_or_admin" ON public.feedback;
CREATE POLICY "feedback_update_owner_or_admin"
  ON public.feedback FOR UPDATE
  USING (
    user_id = auth.uid()
    OR public.is_admin()
  )
  WITH CHECK (
    user_id = auth.uid()
    OR public.is_admin()
  );

-- 4. DELETE: Admins only
DROP POLICY IF EXISTS "feedback_delete_admin" ON public.feedback;
CREATE POLICY "feedback_delete_admin"
  ON public.feedback FOR DELETE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — public.audit_logs (Append-Only)
-- ---------------------------------------------------------------------------
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Admins only
DROP POLICY IF EXISTS "audit_logs_select_admin" ON public.audit_logs;
CREATE POLICY "audit_logs_select_admin"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

-- 2. INSERT: Authenticated users/services can append audit log records
DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_authenticated"
  ON public.audit_logs FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    OR public.is_admin()
  );

-- 3. UPDATE: Strictly disabled (immutable audit trail)
DROP POLICY IF EXISTS "audit_logs_update_disabled" ON public.audit_logs;
CREATE POLICY "audit_logs_update_disabled"
  ON public.audit_logs FOR UPDATE
  USING (FALSE);

-- 4. DELETE: Strictly disabled (immutable audit trail)
DROP POLICY IF EXISTS "audit_logs_delete_disabled" ON public.audit_logs;
CREATE POLICY "audit_logs_delete_disabled"
  ON public.audit_logs FOR DELETE
  USING (FALSE);
