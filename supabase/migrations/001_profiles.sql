-- =============================================================================
-- Migration: 001_profiles.sql
-- Description: Creates the public.profiles table, RLS policies, and the
--              trigger that auto-creates a profile row when a new auth user
--              registers.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- TABLE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id                 UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name          TEXT,
  avatar_url         TEXT,
  preferred_language TEXT        DEFAULT 'en' CHECK (preferred_language IN ('en', 'ur', 'roman_ur')),
  province           TEXT,
  city               TEXT,
  role               TEXT        NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'lawyer', 'admin')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Extended public profile for every Wakeel user. One row per auth.users row.';
COMMENT ON COLUMN public.profiles.role IS 'citizen | lawyer | admin — used for RLS and feature gating.';

-- ---------------------------------------------------------------------------
-- UPDATED_AT TRIGGER HELPER
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- AUTO-CREATE PROFILE ON NEW AUTH USER
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, preferred_language, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en'),
    'citizen'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT —————————————————————————————————————————————————————————————————————
-- 1. Users can always read their own profile.
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- 2. Lawyer profiles are publicly readable (for the lawyer directory).
DROP POLICY IF EXISTS "profiles_select_lawyers_public" ON public.profiles;
CREATE POLICY "profiles_select_lawyers_public"
  ON public.profiles FOR SELECT
  USING (role = 'lawyer');

-- 3. Admins can read all profiles.
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- INSERT — disabled; handled by the handle_new_user() trigger.
DROP POLICY IF EXISTS "profiles_insert_disabled" ON public.profiles;
CREATE POLICY "profiles_insert_disabled"
  ON public.profiles FOR INSERT
  WITH CHECK (FALSE);

-- UPDATE — users can update their own profile only.
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- DELETE — disabled.
DROP POLICY IF EXISTS "profiles_delete_disabled" ON public.profiles;
CREATE POLICY "profiles_delete_disabled"
  ON public.profiles FOR DELETE
  USING (FALSE);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);
CREATE INDEX IF NOT EXISTS profiles_province_city_idx ON public.profiles (province, city);
