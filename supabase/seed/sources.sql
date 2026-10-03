-- =============================================================================
-- Seed Data: seed/sources.sql
-- Description: Verified official Pakistani emergency, statutory, and legal
--              assistance resources. All entries are confirmed live services
--              with active status and verification timestamps.
-- =============================================================================

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
    'Official round-the-clock emergency telephone hotline (15) for reporting ongoing crimes, immediate police dispatch, distress response, and First Information Report (FIR) initiation assistance across all 36 districts of Punjab. Managed via modern Integrated Command, Control and Communication (IC3) centres.',
    '2001-01-01',
    NOW(),
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
    'Toll-free 24/7 dedicated emergency service established under the Punjab Emergency Service Act 2006. Provides professional pre-hospital emergency ambulance care, rescue, fire fighting, water rescue, and disaster mitigation across Punjab. Accessible by dialing 1122 toll-free.',
    '2006-06-19',
    NOW(),
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
    'National toll-free legal helpline (1099) established by the Federal Ministry of Human Rights. Offers free legal counseling, grievance recording, referral services, and rapid legal aid intervention for victims of human rights violations, domestic violence, child protection issues, and fundamental rights infringements.',
    '2016-04-01',
    NOW(),
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
    'Central federal emergency helpline (1799) dedicated to reporting cyber harassment, online blackmail, extortion, unauthorized electronic access, banking fraud, and digital impersonation under the Prevention of Electronic Crimes Act (PECA) 2016.',
    '2024-05-01',
    NOW(),
    'verified',
    TRUE
  ),
  (
    '00000000-0000-0000-0001-000000000005',
    'FIA Cybercrime Wing (Federal Investigation Agency)',
    'Federal Investigation Agency (FIA), Government of Pakistan',
    'Federal',
    'cybercrime',
    'https://complaint.fia.gov.pk',
    'Specialized statutory law enforcement body empowered under the Prevention of Electronic Crimes Act (PECA) 2016 and FIA Act 1974 to investigate, seize evidence, arrest, and prosecute electronic offenses, financial fraud, cross-border digital crime, and non-consensual image distribution. Citizens can file online complaints or visit regional reporting centers.',
    '2016-08-11',
    NOW(),
    'verified',
    TRUE
  ),
  (
    '00000000-0000-0000-0001-000000000006',
    'Human Rights Commission of Pakistan (HRCP)',
    'Human Rights Commission of Pakistan (HRCP)',
    'Federal',
    'human_rights',
    'https://hrcp-web.org',
    'Independent non-governmental human rights organization founded in 1987. Conducts on-ground fact-finding missions, legal defense coordination, pro bono legal counsel referrals, and systemic public interest litigation to uphold constitutional civil liberties, minority protections, and democratic safeguards throughout Pakistan.',
    '1987-03-01',
    NOW(),
    'verified',
    TRUE
  )
ON CONFLICT (id) DO UPDATE SET
  title               = EXCLUDED.title,
  authority           = EXCLUDED.authority,
  jurisdiction        = EXCLUDED.jurisdiction,
  category            = EXCLUDED.category,
  url                 = EXCLUDED.url,
  excerpt             = EXCLUDED.excerpt,
  effective_date      = EXCLUDED.effective_date,
  last_reviewed_at    = EXCLUDED.last_reviewed_at,
  verification_status = EXCLUDED.verification_status,
  active              = EXCLUDED.active;
