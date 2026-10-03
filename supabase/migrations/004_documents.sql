-- =============================================================================
-- Migration: 004_documents.sql
-- Description: Creates public.documents and public.document_extractions tables.
--              Documents are stored in Supabase Storage; this table holds
--              metadata and analysis results only.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- public.documents
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id          UUID        REFERENCES public.cases(id) ON DELETE SET NULL,
  owner_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  storage_path     TEXT        NOT NULL,
  filename         TEXT        NOT NULL,
  mime_type        TEXT        NOT NULL,
  size_bytes       INTEGER     NOT NULL,
  sha256           TEXT        NOT NULL,
  analysis_status  TEXT        DEFAULT 'pending' CHECK (analysis_status IN ('pending','processing','complete','failed','unsupported')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.documents IS 'Metadata for user-uploaded documents. File content lives in Supabase Storage.';
COMMENT ON COLUMN public.documents.sha256 IS 'SHA-256 hash of file content for deduplication and integrity checks.';
COMMENT ON COLUMN public.documents.analysis_status IS 'AI analysis pipeline status: pending → processing → complete | failed | unsupported.';

-- ---------------------------------------------------------------------------
-- public.document_extractions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.document_extractions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id     UUID        NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  extracted_text  TEXT,
  entities        JSONB       DEFAULT '[]',
  dates           JSONB       DEFAULT '[]',
  deadlines       JSONB       DEFAULT '[]',
  referenced_laws JSONB       DEFAULT '[]',
  confidence      TEXT        DEFAULT 'unknown' CHECK (confidence IN ('high','medium','low','unknown')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.document_extractions IS 'AI-extracted structured data from a document (entities, dates, laws referenced, deadlines).';

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — documents
-- ---------------------------------------------------------------------------
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "documents_select_owner" ON public.documents;
CREATE POLICY "documents_select_owner"
  ON public.documents FOR SELECT
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "documents_insert_owner" ON public.documents;
CREATE POLICY "documents_insert_owner"
  ON public.documents FOR INSERT
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "documents_update_owner" ON public.documents;
CREATE POLICY "documents_update_owner"
  ON public.documents FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "documents_delete_owner" ON public.documents;
CREATE POLICY "documents_delete_owner"
  ON public.documents FOR DELETE
  USING (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — document_extractions (via document ownership)
-- ---------------------------------------------------------------------------
ALTER TABLE public.document_extractions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "doc_extractions_select_owner" ON public.document_extractions;
CREATE POLICY "doc_extractions_select_owner"
  ON public.document_extractions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id AND d.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "doc_extractions_insert_owner" ON public.document_extractions;
CREATE POLICY "doc_extractions_insert_owner"
  ON public.document_extractions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id AND d.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "doc_extractions_update_owner" ON public.document_extractions;
CREATE POLICY "doc_extractions_update_owner"
  ON public.document_extractions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id AND d.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "doc_extractions_delete_owner" ON public.document_extractions;
CREATE POLICY "doc_extractions_delete_owner"
  ON public.document_extractions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.documents d
      WHERE d.id = document_id AND d.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS documents_owner_idx        ON public.documents (owner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS documents_case_idx         ON public.documents (case_id);
CREATE INDEX IF NOT EXISTS documents_analysis_idx     ON public.documents (analysis_status);
CREATE INDEX IF NOT EXISTS doc_extractions_doc_idx    ON public.document_extractions (document_id);
