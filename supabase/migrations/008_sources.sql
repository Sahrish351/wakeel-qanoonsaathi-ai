-- =============================================================================
-- Migration: 008_sources.sql
-- Description: Creates the curated legal knowledge base tables:
--              public.sources, public.source_chunks, public.source_reviews.
--              Sources are publicly readable when verified; admin-managed.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- public.sources
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sources (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title               TEXT        NOT NULL,
  authority           TEXT        NOT NULL,
  jurisdiction        TEXT        NOT NULL,
  category            TEXT        NOT NULL,
  url                 TEXT        NOT NULL,
  excerpt             TEXT,
  effective_date      DATE,
  last_reviewed_at    TIMESTAMPTZ,
  verification_status TEXT        DEFAULT 'unverified' CHECK (verification_status IN ('verified','unverified','under_review','stale')),
  active              BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.sources IS 'Curated library of official Pakistani legal resources, statutes, helplines, and authorities.';
COMMENT ON COLUMN public.sources.category IS 'Matches the cases.category enum for cross-referencing.';

-- ---------------------------------------------------------------------------
-- public.source_chunks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.source_chunks (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id     UUID        NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  chunk_text    TEXT        NOT NULL,
  metadata_json JSONB       DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.source_chunks IS 'Text chunks of source documents, used for RAG (retrieval-augmented generation).';

-- ---------------------------------------------------------------------------
-- public.source_reviews
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.source_reviews (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id   UUID        NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
  reviewer_id UUID        NOT NULL REFERENCES public.profiles(id),
  decision    TEXT        NOT NULL CHECK (decision IN ('approved','rejected','needs_update')),
  notes       TEXT,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.source_reviews IS 'Audit trail of admin decisions on source verification.';

-- ---------------------------------------------------------------------------
-- HELPER: is_admin() — avoids code duplication in policies
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
-- ROW LEVEL SECURITY — sources
-- ---------------------------------------------------------------------------
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read verified active sources.
DROP POLICY IF EXISTS "sources_select_verified" ON public.sources;
CREATE POLICY "sources_select_verified"
  ON public.sources FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND active = TRUE
    AND verification_status = 'verified'
  );

-- Admins can select all sources regardless of status.
DROP POLICY IF EXISTS "sources_select_admin" ON public.sources;
CREATE POLICY "sources_select_admin"
  ON public.sources FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "sources_insert_admin" ON public.sources;
CREATE POLICY "sources_insert_admin"
  ON public.sources FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "sources_update_admin" ON public.sources;
CREATE POLICY "sources_update_admin"
  ON public.sources FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "sources_delete_admin" ON public.sources;
CREATE POLICY "sources_delete_admin"
  ON public.sources FOR DELETE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — source_chunks
-- ---------------------------------------------------------------------------
ALTER TABLE public.source_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "source_chunks_select_verified" ON public.source_chunks;
CREATE POLICY "source_chunks_select_verified"
  ON public.source_chunks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sources s
      WHERE s.id = source_id
        AND s.active = TRUE
        AND s.verification_status = 'verified'
        AND auth.role() = 'authenticated'
    )
  );

DROP POLICY IF EXISTS "source_chunks_select_admin" ON public.source_chunks;
CREATE POLICY "source_chunks_select_admin"
  ON public.source_chunks FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "source_chunks_insert_admin" ON public.source_chunks;
CREATE POLICY "source_chunks_insert_admin"
  ON public.source_chunks FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "source_chunks_update_admin" ON public.source_chunks;
CREATE POLICY "source_chunks_update_admin"
  ON public.source_chunks FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "source_chunks_delete_admin" ON public.source_chunks;
CREATE POLICY "source_chunks_delete_admin"
  ON public.source_chunks FOR DELETE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — source_reviews (admin only)
-- ---------------------------------------------------------------------------
ALTER TABLE public.source_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "source_reviews_select_admin" ON public.source_reviews;
CREATE POLICY "source_reviews_select_admin"
  ON public.source_reviews FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "source_reviews_insert_admin" ON public.source_reviews;
CREATE POLICY "source_reviews_insert_admin"
  ON public.source_reviews FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "source_reviews_update_admin" ON public.source_reviews;
CREATE POLICY "source_reviews_update_admin"
  ON public.source_reviews FOR UPDATE
  USING (public.is_admin());

DROP POLICY IF EXISTS "source_reviews_delete_admin" ON public.source_reviews;
CREATE POLICY "source_reviews_delete_admin"
  ON public.source_reviews FOR DELETE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS sources_jurisdiction_category_idx
  ON public.sources (jurisdiction, category, active, verification_status);
CREATE INDEX IF NOT EXISTS sources_verification_idx
  ON public.sources (verification_status, active);
CREATE INDEX IF NOT EXISTS source_chunks_source_idx
  ON public.source_chunks (source_id);
CREATE INDEX IF NOT EXISTS source_reviews_source_idx
  ON public.source_reviews (source_id);
