-- =============================================================================
-- Migration: 009_lawyers.sql
-- Description: Creates public.lawyers, public.lawyer_specializations, and
--              public.lawyer_availability tables with full RLS policies,
--              indexes, and triggers for the lawyer directory and profiles.
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
-- public.lawyers
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lawyers (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  bio                 TEXT,
  province            TEXT        NOT NULL,
  city                TEXT        NOT NULL,
  languages           TEXT[]      DEFAULT '{en}',
  consultation_modes  TEXT[]      DEFAULT '{in_person}',
  verified            BOOLEAN     NOT NULL DEFAULT FALSE,
  availability_status TEXT        DEFAULT 'available' CHECK (availability_status IN ('available','busy','unavailable')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.lawyers IS 'Verified advocates and legal counsel directory profile linked to public.profiles.';
COMMENT ON COLUMN public.lawyers.languages IS 'Supported communication languages (e.g. en, ur, pa, sd, ps, bal).';
COMMENT ON COLUMN public.lawyers.consultation_modes IS 'Available consultation formats (e.g. in_person, video, phone, written).';
COMMENT ON COLUMN public.lawyers.verified IS 'Verification status verified by Wakeel admins against provincial Bar Councils.';

-- Trigger to maintain updated_at
DROP TRIGGER IF EXISTS lawyers_set_updated_at ON public.lawyers;
CREATE TRIGGER lawyers_set_updated_at
  BEFORE UPDATE ON public.lawyers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- public.lawyer_specializations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lawyer_specializations (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id UUID NOT NULL REFERENCES public.lawyers(id) ON DELETE CASCADE,
  category  TEXT NOT NULL,
  CONSTRAINT lawyer_specialization_unique UNIQUE (lawyer_id, category)
);

COMMENT ON TABLE public.lawyer_specializations IS 'Legal practice areas and case categories handled by the lawyer.';
COMMENT ON COLUMN public.lawyer_specializations.category IS 'Matches cases.category taxonomy.';

-- ---------------------------------------------------------------------------
-- public.lawyer_availability
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lawyer_availability (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id  UUID NOT NULL REFERENCES public.lawyers(id) ON DELETE CASCADE,
  day        TEXT NOT NULL CHECK (day IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  start_time TIME NOT NULL,
  end_time   TIME NOT NULL,
  CONSTRAINT lawyer_availability_time_valid CHECK (end_time > start_time)
);

COMMENT ON TABLE public.lawyer_availability IS 'Weekly availability calendar time slots for consultations.';

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS lawyers_profile_idx ON public.lawyers (profile_id);
CREATE INDEX IF NOT EXISTS lawyers_location_idx ON public.lawyers (province, city);
CREATE INDEX IF NOT EXISTS lawyers_status_idx ON public.lawyers (verified, availability_status);
CREATE INDEX IF NOT EXISTS lawyer_specializations_lawyer_idx ON public.lawyer_specializations (lawyer_id);
CREATE INDEX IF NOT EXISTS lawyer_specializations_category_idx ON public.lawyer_specializations (category);
CREATE INDEX IF NOT EXISTS lawyer_availability_lawyer_day_idx ON public.lawyer_availability (lawyer_id, day);

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — public.lawyers
-- ---------------------------------------------------------------------------
ALTER TABLE public.lawyers ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Anyone can view verified lawyers; lawyers can view their own profile; admins view all
DROP POLICY IF EXISTS "lawyers_select_public_verified" ON public.lawyers;
CREATE POLICY "lawyers_select_public_verified"
  ON public.lawyers FOR SELECT
  USING (verified = TRUE);

DROP POLICY IF EXISTS "lawyers_select_own" ON public.lawyers;
CREATE POLICY "lawyers_select_own"
  ON public.lawyers FOR SELECT
  USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "lawyers_select_admin" ON public.lawyers;
CREATE POLICY "lawyers_select_admin"
  ON public.lawyers FOR SELECT
  USING (public.is_admin());

-- 2. INSERT: A user with lawyer role can create their lawyer profile; admins can create any
DROP POLICY IF EXISTS "lawyers_insert_own" ON public.lawyers;
CREATE POLICY "lawyers_insert_own"
  ON public.lawyers FOR INSERT
  WITH CHECK (
    profile_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'lawyer'
    )
  );

DROP POLICY IF EXISTS "lawyers_insert_admin" ON public.lawyers;
CREATE POLICY "lawyers_insert_admin"
  ON public.lawyers FOR INSERT
  WITH CHECK (public.is_admin());

-- 3. UPDATE: Lawyers can update their own profile; admins can update all
DROP POLICY IF EXISTS "lawyers_update_own" ON public.lawyers;
CREATE POLICY "lawyers_update_own"
  ON public.lawyers FOR UPDATE
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "lawyers_update_admin" ON public.lawyers;
CREATE POLICY "lawyers_update_admin"
  ON public.lawyers FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. DELETE: Admins only (lawyer records are archived, not deleted by users)
DROP POLICY IF EXISTS "lawyers_delete_admin" ON public.lawyers;
CREATE POLICY "lawyers_delete_admin"
  ON public.lawyers FOR DELETE
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — public.lawyer_specializations
-- ---------------------------------------------------------------------------
ALTER TABLE public.lawyer_specializations ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Public can view specializations of verified lawyers; lawyers view own; admin views all
DROP POLICY IF EXISTS "lawyer_specializations_select" ON public.lawyer_specializations;
CREATE POLICY "lawyer_specializations_select"
  ON public.lawyer_specializations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id
        AND (l.verified = TRUE OR l.profile_id = auth.uid())
    )
    OR public.is_admin()
  );

-- 2. INSERT: Lawyer can add their own specializations; admins can add any
DROP POLICY IF EXISTS "lawyer_specializations_insert" ON public.lawyer_specializations;
CREATE POLICY "lawyer_specializations_insert"
  ON public.lawyer_specializations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id AND l.profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- 3. UPDATE: Lawyer can update own specializations; admin can update all
DROP POLICY IF EXISTS "lawyer_specializations_update" ON public.lawyer_specializations;
CREATE POLICY "lawyer_specializations_update"
  ON public.lawyer_specializations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id AND l.profile_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id AND l.profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- 4. DELETE: Lawyer can delete own specializations; admin can delete any
DROP POLICY IF EXISTS "lawyer_specializations_delete" ON public.lawyer_specializations;
CREATE POLICY "lawyer_specializations_delete"
  ON public.lawyer_specializations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id AND l.profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY — public.lawyer_availability
-- ---------------------------------------------------------------------------
ALTER TABLE public.lawyer_availability ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Public can view availability of verified lawyers; lawyers view own; admin views all
DROP POLICY IF EXISTS "lawyer_availability_select" ON public.lawyer_availability;
CREATE POLICY "lawyer_availability_select"
  ON public.lawyer_availability FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id
        AND (l.verified = TRUE OR l.profile_id = auth.uid())
    )
    OR public.is_admin()
  );

-- 2. INSERT: Lawyer can manage own availability; admin can manage any
DROP POLICY IF EXISTS "lawyer_availability_insert" ON public.lawyer_availability;
CREATE POLICY "lawyer_availability_insert"
  ON public.lawyer_availability FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id AND l.profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- 3. UPDATE: Lawyer can update own availability; admin can update any
DROP POLICY IF EXISTS "lawyer_availability_update" ON public.lawyer_availability;
CREATE POLICY "lawyer_availability_update"
  ON public.lawyer_availability FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id AND l.profile_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id AND l.profile_id = auth.uid()
    )
    OR public.is_admin()
  );

-- 4. DELETE: Lawyer can delete own availability; admin can delete any
DROP POLICY IF EXISTS "lawyer_availability_delete" ON public.lawyer_availability;
CREATE POLICY "lawyer_availability_delete"
  ON public.lawyer_availability FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id AND l.profile_id = auth.uid()
    )
    OR public.is_admin()
  );
