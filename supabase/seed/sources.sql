-- =============================================================================
-- Seed Data: seed/sources.sql
-- Description: Verified official Pakistani emergency, statutory, and legal
--              assistance resources.
--              Audit Standard: Fixed audit timestamp (2025-01-15 00:00:00+00).
--              Transitional Status Flagged: FIA Cybercrime & NCCIA marked 'under_review'
--              reflecting federal administrative jurisdiction transition.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 0. Concurrency Control: Acquire table-level lock to prevent race conditions
-- ---------------------------------------------------------------------------
LOCK TABLE public.sources IN SHARE ROW EXCLUSIVE MODE;

-- ---------------------------------------------------------------------------
-- 1. Helper Function: Abort transaction immediately on conflict violation
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.abort_seed_conflict(p_msg TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'SEED CONFLICT ABORT: %', p_msg;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Pre-Check Collision Guard: Abort if any reserved ID belongs to non-matching source
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.sources s
    WHERE s.id IN (
      '00000000-0000-0000-0001-000000000001',
      '00000000-0000-0000-0001-000000000002',
      '00000000-0000-0000-0001-000000000003',
      '00000000-0000-0000-0001-000000000004',
      '00000000-0000-0000-0001-000000000005',
      '00000000-0000-0000-0001-000000000006'
    )
    AND NOT (
      (s.id = '00000000-0000-0000-0001-000000000001' AND s.url = 'https://punjabpolice.gov.pk' AND s.authority = 'Punjab Police, Government of the Punjab') OR
      (s.id = '00000000-0000-0000-0001-000000000002' AND s.url = 'https://rescue.gov.pk' AND s.authority = 'Punjab Emergency Service Department, Government of the Punjab') OR
      (s.id = '00000000-0000-0000-0001-000000000003' AND s.url = 'https://mohr.gov.pk' AND s.authority = 'Ministry of Human Rights (MoHR), Government of Pakistan') OR
      (s.id = '00000000-0000-0000-0001-000000000004' AND s.url = 'https://nccia.gov.pk' AND s.authority = 'National Cyber Crime Investigation Agency (NCCIA) / Ministry of Interior') OR
      (s.id = '00000000-0000-0000-0001-000000000005' AND s.url = 'https://complaint.fia.gov.pk' AND s.authority = 'Federal Investigation Agency (FIA), Government of Pakistan') OR
      (s.id = '00000000-0000-0000-0001-000000000006' AND s.url = 'https://hrcp-web.org' AND s.authority = 'Human Rights Commission of Pakistan (HRCP)')
    )
  ) THEN
    RAISE EXCEPTION 'SEED ABORTED: One or more reserved source IDs collide with an unrelated source record in public.sources!';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 3. Upsert Official Pakistani Legal Assistance & Statutory Resources
-- ---------------------------------------------------------------------------
INSERT INTO public.sources (
  id,
  title,
  authority,
  jurisdiction,
  category,
  url,
  excerpt,
  effective_date,
  last_reviewed_at,
  verification_status,
  active
)
VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    'Punjab Police Emergency Helpline (15)',
    'Punjab Police, Government of the Punjab',
    'Punjab',
    'police_criminal',
    'https://punjabpolice.gov.pk',
    'Official emergency telephone hotline (15) for reporting ongoing crimes, immediate police dispatch, distress response, and First Information Report (FIR) initiation assistance across all 36 districts of Punjab. Managed via Integrated Command, Control and Communication (IC3) centres.',
    '2001-01-01',
    '2025-01-15 00:00:00+00',
    'verified',
    TRUE
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    'Punjab Emergency Service (Rescue 1122)',
    'Punjab Emergency Service Department, Government of the Punjab',
    'Punjab',
    'other',
    'https://rescue.gov.pk',
    'Toll-free 24/7 emergency service established under the Punjab Emergency Service Act 2006. Provides pre-hospital emergency ambulance care, rescue, firefighting, and disaster mitigation across Punjab. Accessible by dialing 1122 nationwide.',
    '2006-06-19',
    '2025-01-15 00:00:00+00',
    'verified',
    TRUE
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    'Ministry of Human Rights National Helpline (1099)',
    'Ministry of Human Rights (MoHR), Government of Pakistan',
    'Federal',
    'human_rights',
    'https://mohr.gov.pk',
    'National toll-free legal helpline (1099) established by the Federal Ministry of Human Rights. Offers free legal counseling, grievance recording, referral services, and rapid intervention for victims of human rights violations, domestic violence, and fundamental rights infringements.',
    '2016-04-01',
    '2025-01-15 00:00:00+00',
    'verified',
    TRUE
  ),
  (
    '00000000-0000-0000-0001-000000000004',
    'NCCIA Cybercrime Reporting Helpline (1799)',
    'National Cyber Crime Investigation Agency (NCCIA) / Ministry of Interior',
    'Federal',
    'cybercrime',
    'https://nccia.gov.pk',
    'Federal specialized agency notified in 2024 to investigate electronic offenses under the Prevention of Electronic Crimes Act (PECA) 2016. Toll-free helpline 1799 and complaint portal complaint.nccia.gov.pk. [STATUS NOTE: Active institutional transition from FIA Cybercrime Wing is in progress under Ministry of Interior directives].',
    '2024-05-01',
    '2025-01-15 00:00:00+00',
    'under_review',
    TRUE
  ),
  (
    '00000000-0000-0000-0001-000000000005',
    'FIA Cybercrime Wing (Federal Investigation Agency)',
    'Federal Investigation Agency (FIA), Government of Pakistan',
    'Federal',
    'cybercrime',
    'https://complaint.fia.gov.pk',
    'Statutory law enforcement division under the FIA Act 1974 historically handling PECA 2016 complaints. [STATUS NOTE: Jurisdiction over online harassment and electronic fraud is in active administrative transition to the newly constituted NCCIA; citizens can monitor regional reporting centers for current case intake protocols].',
    '2016-08-11',
    '2025-01-15 00:00:00+00',
    'under_review',
    TRUE
  ),
  (
    '00000000-0000-0000-0001-000000000006',
    'Human Rights Commission of Pakistan (HRCP)',
    'Human Rights Commission of Pakistan (HRCP)',
    'Federal',
    'human_rights',
    'https://hrcp-web.org',
    'Independent non-governmental human rights organization founded in 1987. Conducts on-ground fact-finding missions, legal defense coordination, pro bono legal counsel referrals, and systemic public interest advocacy to uphold constitutional civil liberties and democratic safeguards.',
    '1987-03-01',
    '2025-01-15 00:00:00+00',
    'verified',
    TRUE
  )
ON CONFLICT (id) DO UPDATE SET
  title = CASE
    WHEN public.sources.url = EXCLUDED.url AND public.sources.authority = EXCLUDED.authority
    THEN EXCLUDED.title
    ELSE public.abort_seed_conflict('public.sources id ' || EXCLUDED.id::text || ' collides with non-matching authority/url')
  END,
  authority           = EXCLUDED.authority,
  jurisdiction        = EXCLUDED.jurisdiction,
  category            = EXCLUDED.category,
  url                 = EXCLUDED.url,
  excerpt             = EXCLUDED.excerpt,
  effective_date      = EXCLUDED.effective_date,
  last_reviewed_at    = EXCLUDED.last_reviewed_at,
  verification_status = EXCLUDED.verification_status,
  active              = EXCLUDED.active
WHERE public.sources.url = EXCLUDED.url AND public.sources.authority = EXCLUDED.authority;

-- ---------------------------------------------------------------------------
-- 4. Post-Write Assertion Check: Verify exactly 6 sources exist
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_count INT;
BEGIN
  SELECT count(*) INTO v_count FROM public.sources
  WHERE id IN (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0001-000000000004',
    '00000000-0000-0000-0001-000000000005',
    '00000000-0000-0000-0001-000000000006'
  );
  IF v_count <> 6 THEN
    RAISE EXCEPTION 'SEED INTEGRITY FAILURE: Expected 6 seeded sources, found %', v_count;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 5. Cleanup: Drop temporary helper function within the transaction
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.abort_seed_conflict(TEXT);

COMMIT;
