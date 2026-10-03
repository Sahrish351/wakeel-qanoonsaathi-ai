-- =============================================================================
-- Migration: 005_evidence.sql
-- Description: Creates public.evidence_items table. Evidence is owned by the
--              case owner and optionally linked to an uploaded document.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- public.evidence_items
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.evidence_items (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id       UUID        NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  document_id   UUID        REFERENCES public.documents(id) ON DELETE SET NULL,
  title         TEXT        NOT NULL,
  description   TEXT,
  evidence_type TEXT        NOT NULL CHECK (evidence_type IN (
                  'screenshot','photo','video','audio','document',
                  'message','note','other'
                )),
  occurred_at   TIMESTAMPTZ,
  hash          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.evidence_items IS 'Evidence items linked to a case. May optionally reference a stored document.';
COMMENT ON COLUMN public.evidence_items.hash IS 'Optional SHA-256 hash for non-document evidence integrity tracking.';

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY (via case ownership)
-- ---------------------------------------------------------------------------
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "evidence_select_owner" ON public.evidence_items;
CREATE POLICY "evidence_select_owner"
  ON public.evidence_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = case_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "evidence_insert_owner" ON public.evidence_items;
CREATE POLICY "evidence_insert_owner"
  ON public.evidence_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = case_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "evidence_update_owner" ON public.evidence_items;
CREATE POLICY "evidence_update_owner"
  ON public.evidence_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = case_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "evidence_delete_owner" ON public.evidence_items;
CREATE POLICY "evidence_delete_owner"
  ON public.evidence_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.cases c
      WHERE c.id = case_id AND c.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS evidence_case_at_idx ON public.evidence_items (case_id, created_at DESC);
CREATE INDEX IF NOT EXISTS evidence_doc_idx     ON public.evidence_items (document_id);
