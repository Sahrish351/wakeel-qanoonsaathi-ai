-- =============================================================================
-- Migration: 014_security_hardening.sql
-- Description: Hardens role protection against client-side privilege escalation.
--              Ensures ordinary users cannot update their own role column to
--              'admin' or 'lawyer'.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- If the role is being altered
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check if executing user has admin role or service role
    IF auth.jwt()->>'role' != 'service_role' AND NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Access denied: Users cannot alter their own account role.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

COMMENT ON FUNCTION public.protect_profile_role() IS 'Prevents unauthorized self-escalation of role in public.profiles.';
