-- =============================================================================
-- Migration: 015_demo_lawyers_nullable_profile.sql
-- Description: Supports synthetic demo directory advocates safely:
--              1. Makes profile_id nullable for synthetic demo directory entries.
--              2. Adds explicit name column.
--              3. Adds explicit is_demo boolean column (default false).
--              4. Updates RLS policies so synthetic demo records (is_demo = true)
--                 can be viewed publicly without falsely marking them verified.
--              5. Ensures unverified real lawyers remain strictly private.
-- =============================================================================

-- 1. Make profile_id nullable on public.lawyers so directory entries can exist without auth accounts
ALTER TABLE public.lawyers ALTER COLUMN profile_id DROP NOT NULL;

-- 2. Add explicit name column if it doesn't already exist
ALTER TABLE public.lawyers ADD COLUMN IF NOT EXISTS name TEXT;

-- 3. Add explicit is_demo column (default FALSE) to distinguish synthetic records
ALTER TABLE public.lawyers ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

-- 4. Document column changes
COMMENT ON COLUMN public.lawyers.profile_id IS 'Associated public.profiles(id). NULL for synthetic directory demo advocates who do not have auth accounts.';
COMMENT ON COLUMN public.lawyers.name IS 'Practitioner display name. Used directly for demo directory advocates or as fallback when profile_id is NULL.';
COMMENT ON COLUMN public.lawyers.is_demo IS 'Flag indicating synthetic demonstration practitioner. Distinguishes mock demo profiles from genuine advocates.';

-- 5. Update RLS policies to allow public reading of verified real advocates OR simulated demo advocates,
--    while strictly ensuring that unverified real advocates remain private.
DROP POLICY IF EXISTS "lawyers_select_public_verified" ON public.lawyers;
CREATE POLICY "lawyers_select_public_verified"
  ON public.lawyers FOR SELECT
  USING (verified = TRUE OR is_demo = TRUE);

-- Update specializations select policy
DROP POLICY IF EXISTS "lawyer_specializations_select" ON public.lawyer_specializations;
CREATE POLICY "lawyer_specializations_select"
  ON public.lawyer_specializations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id
        AND (l.verified = TRUE OR l.is_demo = TRUE OR l.profile_id = auth.uid())
    )
    OR public.is_admin()
  );

-- Update availability select policy
DROP POLICY IF EXISTS "lawyer_availability_select" ON public.lawyer_availability;
CREATE POLICY "lawyer_availability_select"
  ON public.lawyer_availability FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lawyers l
      WHERE l.id = lawyer_id
        AND (l.verified = TRUE OR l.is_demo = TRUE OR l.profile_id = auth.uid())
    )
    OR public.is_admin()
  );
