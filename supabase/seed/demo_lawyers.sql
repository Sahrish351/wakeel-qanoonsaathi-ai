-- =============================================================================
-- Seed Data: seed/demo_lawyers.sql
-- Description: Synthetic demo legal practitioner profiles for Wakeel platform.
--              *** ALL DATA IS FICTIONAL AND FOR DEMONSTRATION PURPOSES ONLY ***
--              All profiles are labeled "[DEMO]" with bios prefixed "[DEMO PROFILE - NOT A REAL ADVOCATE]".
--              Covers Punjab, Sindh, KPK, Balochistan, and Islamabad.
--              SECURITY: Does NOT create fake auth.users or fake public.profiles.
--                        Inserts directly into public.lawyers with profile_id = NULL.
--                        verified = FALSE (fictional advocates are NOT marked verified).
--                        is_demo = TRUE (explicitly flagged as synthetic demo entities).
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 0. Concurrency Control: Acquire table-level lock to prevent race conditions
-- ---------------------------------------------------------------------------
LOCK TABLE public.lawyers, public.lawyer_specializations, public.lawyer_availability IN SHARE ROW EXCLUSIVE MODE;

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
-- 2. Pre-Check Collision Guards: Abort before writes if any reserved ID collides
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  -- 2a. Check Lawyer IDs
  IF EXISTS (
    SELECT 1 FROM public.lawyers
    WHERE id IN (
      '00000000-0000-0000-0003-000000000001',
      '00000000-0000-0000-0003-000000000002',
      '00000000-0000-0000-0003-000000000003',
      '00000000-0000-0000-0003-000000000004',
      '00000000-0000-0000-0003-000000000005',
      '00000000-0000-0000-0003-000000000006',
      '00000000-0000-0000-0003-000000000007',
      '00000000-0000-0000-0003-000000000008',
      '00000000-0000-0000-0003-000000000009',
      '00000000-0000-0000-0003-000000000010'
    )
    AND is_demo IS DISTINCT FROM TRUE
  ) THEN
    RAISE EXCEPTION 'SEED ABORTED: One or more reserved demo lawyer IDs already exist and belong to a non-demo record (is_demo is not TRUE)!';
  END IF;

  -- 2b. Check Specialization IDs
  IF EXISTS (
    SELECT 1 FROM public.lawyer_specializations ls
    WHERE ls.id IN (
      '00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0004-000000000003',
      '00000000-0000-0000-0004-000000000004', '00000000-0000-0000-0004-000000000005', '00000000-0000-0000-0004-000000000006',
      '00000000-0000-0000-0004-000000000007', '00000000-0000-0000-0004-000000000008', '00000000-0000-0000-0004-000000000009',
      '00000000-0000-0000-0004-000000000010', '00000000-0000-0000-0004-000000000011', '00000000-0000-0000-0004-000000000012',
      '00000000-0000-0000-0004-000000000013', '00000000-0000-0000-0004-000000000014', '00000000-0000-0000-0004-000000000015',
      '00000000-0000-0000-0004-000000000016', '00000000-0000-0000-0004-000000000017', '00000000-0000-0000-0004-000000000018',
      '00000000-0000-0000-0004-000000000019', '00000000-0000-0000-0004-000000000020', '00000000-0000-0000-0004-000000000021',
      '00000000-0000-0000-0004-000000000022', '00000000-0000-0000-0004-000000000023', '00000000-0000-0000-0004-000000000024',
      '00000000-0000-0000-0004-000000000025', '00000000-0000-0000-0004-000000000026', '00000000-0000-0000-0004-000000000027',
      '00000000-0000-0000-0004-000000000028', '00000000-0000-0000-0004-000000000029', '00000000-0000-0000-0004-000000000030'
    )
    AND (
      NOT EXISTS (
        SELECT 1 FROM public.lawyers l
        WHERE l.id = ls.lawyer_id AND l.is_demo = TRUE
      )
      OR ls.lawyer_id NOT IN (
        '00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0003-000000000002',
        '00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0003-000000000004',
        '00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0003-000000000006',
        '00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0003-000000000008',
        '00000000-0000-0000-0003-000000000009', '00000000-0000-0000-0003-000000000010'
      )
    )
  ) THEN
    RAISE EXCEPTION 'SEED ABORTED: One or more reserved demo specialization IDs collide with an existing non-demo or unexpected record!';
  END IF;

  -- 2c. Check Availability IDs
  IF EXISTS (
    SELECT 1 FROM public.lawyer_availability la
    WHERE la.id IN (
      '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0005-000000000003',
      '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0005-000000000006',
      '00000000-0000-0000-0005-000000000007', '00000000-0000-0000-0005-000000000008', '00000000-0000-0000-0005-000000000009',
      '00000000-0000-0000-0005-000000000010', '00000000-0000-0000-0005-000000000011', '00000000-0000-0000-0005-000000000012',
      '00000000-0000-0000-0005-000000000013', '00000000-0000-0000-0005-000000000014', '00000000-0000-0000-0005-000000000015',
      '00000000-0000-0000-0005-000000000016', '00000000-0000-0000-0005-000000000017', '00000000-0000-0000-0005-000000000018',
      '00000000-0000-0000-0005-000000000019', '00000000-0000-0000-0005-000000000020', '00000000-0000-0000-0005-000000000021',
      '00000000-0000-0000-0005-000000000022', '00000000-0000-0000-0005-000000000023'
    )
    AND (
      NOT EXISTS (
        SELECT 1 FROM public.lawyers l
        WHERE l.id = la.lawyer_id AND l.is_demo = TRUE
      )
      OR la.lawyer_id NOT IN (
        '00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0003-000000000002',
        '00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0003-000000000004',
        '00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0003-000000000006',
        '00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0003-000000000008',
        '00000000-0000-0000-0003-000000000009', '00000000-0000-0000-0003-000000000010'
      )
    )
  ) THEN
    RAISE EXCEPTION 'SEED ABORTED: One or more reserved demo availability IDs collide with an existing non-demo or unexpected record!';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 3. Upsert Synthetic Demo Lawyers Directory Records (Fictional Bios, No Credentials)
-- ---------------------------------------------------------------------------
INSERT INTO public.lawyers (
  id,
  name,
  profile_id,
  bio,
  province,
  city,
  languages,
  consultation_modes,
  verified,
  is_demo,
  availability_status
)
VALUES
  (
    '00000000-0000-0000-0003-000000000001',
    'Advocate Ayesha Malik [DEMO]',
    NULL,
    '[DEMO PROFILE - NOT A REAL ADVOCATE] Fictional practitioner profile created exclusively to demonstrate family disputes, khula, child custody, and women''s legal safeguards workflow navigation in the Wakeel platform. This profile is not licensed by the Punjab Bar Council or any regulatory body, does not represent a real legal practitioner, and cannot provide legal advice or court representation.',
    'Punjab',
    'Lahore',
    ARRAY['en', 'ur', 'pa'],
    ARRAY['in_person', 'video', 'phone'],
    FALSE,
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    'Advocate Tariq Mehmood Chaudhry [DEMO]',
    NULL,
    '[DEMO PROFILE - NOT A REAL ADVOCATE] Fictional practitioner profile created exclusively to demonstrate land revenue records, property partition, and criminal defense procedural workflow navigation in the Wakeel platform. This profile is not licensed by any Bar Council, does not represent a real legal practitioner, and cannot provide legal advice or court representation.',
    'Punjab',
    'Rawalpindi',
    ARRAY['en', 'ur', 'pa'],
    ARRAY['in_person', 'phone'],
    FALSE,
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000003',
    'Advocate Zainab Bukhari [DEMO]',
    NULL,
    '[DEMO PROFILE - NOT A REAL ADVOCATE] Fictional practitioner profile created exclusively to demonstrate employment law, industrial disputes, and corporate compliance workflow navigation in the Wakeel platform. This profile is not licensed by any Bar Council, does not represent a real legal practitioner, and cannot provide legal advice or court representation.',
    'Punjab',
    'Faisalabad',
    ARRAY['en', 'ur'],
    ARRAY['in_person', 'video'],
    FALSE,
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000004',
    'Advocate Syed Farhan Rizvi [DEMO]',
    NULL,
    '[DEMO PROFILE - NOT A REAL ADVOCATE] Fictional practitioner profile created exclusively to demonstrate cyber harassment reporting, online financial scams under PECA, and digital evidence recovery workflow navigation in the Wakeel platform. This profile is not licensed by the Sindh Bar Council or any regulatory body, does not represent a real legal practitioner, and cannot provide legal advice or court representation.',
    'Sindh',
    'Karachi',
    ARRAY['en', 'ur', 'sd'],
    ARRAY['in_person', 'video', 'phone'],
    FALSE,
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000005',
    'Advocate Mehnaz Soomro [DEMO]',
    NULL,
    '[DEMO PROFILE - NOT A REAL ADVOCATE] Fictional practitioner profile created exclusively to demonstrate inheritance partition, women''s legal protections, and consumer court grievance workflow navigation in the Wakeel platform. This profile is not licensed by any Bar Council, does not represent a real legal practitioner, and cannot provide legal advice or court representation.',
    'Sindh',
    'Hyderabad',
    ARRAY['en', 'ur', 'sd'],
    ARRAY['in_person', 'phone'],
    FALSE,
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000006',
    'Advocate Arbab Sher Khan [DEMO]',
    NULL,
    '[DEMO PROFILE - NOT A REAL ADVOCATE] Fictional practitioner profile created exclusively to demonstrate bail petitions, criminal procedure guidelines, and police accountability workflow navigation in the Wakeel platform. This profile is not licensed by the Khyber Pakhtunkhwa Bar Council or any regulatory body, does not represent a real legal practitioner, and cannot provide legal advice or court representation.',
    'Khyber Pakhtunkhwa',
    'Peshawar',
    ARRAY['en', 'ur', 'ps'],
    ARRAY['in_person', 'phone'],
    FALSE,
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000007',
    'Advocate Maryam Khattak [DEMO]',
    NULL,
    '[DEMO PROFILE - NOT A REAL ADVOCATE] Fictional practitioner profile created exclusively to demonstrate civil contract analysis, property documentation, and consumer protection workflow navigation in the Wakeel platform. This profile is not licensed by any Bar Council, does not represent a real legal practitioner, and cannot provide legal advice or court representation.',
    'Khyber Pakhtunkhwa',
    'Abbottabad',
    ARRAY['en', 'ur', 'ps'],
    ARRAY['in_person', 'video'],
    FALSE,
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000008',
    'Advocate Mir Jahangir Baloch [DEMO]',
    NULL,
    '[DEMO PROFILE - NOT A REAL ADVOCATE] Fictional practitioner profile created exclusively to demonstrate fundamental civil rights, constitutional remedies, and public interest litigation workflow navigation in the Wakeel platform. This profile is not licensed by the Balochistan Bar Council or any regulatory body, does not represent a real legal practitioner, and cannot provide legal advice or court representation.',
    'Balochistan',
    'Quetta',
    ARRAY['en', 'ur', 'bal'],
    ARRAY['in_person', 'phone'],
    FALSE,
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000009',
    'Advocate Bilal Ahmed Rind [DEMO]',
    NULL,
    '[DEMO PROFILE - NOT A REAL ADVOCATE] Fictional practitioner profile created exclusively to demonstrate commercial agreements, maritime logistics trade compliance, and real estate contract workflow navigation in the Wakeel platform. This profile is not licensed by any Bar Council, does not represent a real legal practitioner, and cannot provide legal advice or court representation.',
    'Balochistan',
    'Gwadar',
    ARRAY['en', 'ur', 'bal'],
    ARRAY['in_person', 'video', 'phone'],
    FALSE,
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000010',
    'Barrister Daniyal Qureshi [DEMO]',
    NULL,
    '[DEMO PROFILE - NOT A REAL ADVOCATE] Fictional practitioner profile created exclusively to demonstrate taxation dispute procedures, regulatory filing compliance, and cyber governance workflow navigation in the Wakeel platform. This profile is not licensed by the Islamabad Bar Council, Lincoln''s Inn, or any bar association, does not represent a real legal practitioner, and cannot provide legal advice or court representation.',
    'Islamabad Capital Territory',
    'Islamabad',
    ARRAY['en', 'ur'],
    ARRAY['in_person', 'video', 'phone'],
    FALSE,
    TRUE,
    'available'
  )
ON CONFLICT (id) DO UPDATE SET
  name = CASE
    WHEN public.lawyers.is_demo = TRUE THEN EXCLUDED.name
    ELSE public.abort_seed_conflict('public.lawyers id ' || EXCLUDED.id::text || ' is not a demo record')
  END,
  bio                 = EXCLUDED.bio,
  province            = EXCLUDED.province,
  city                = EXCLUDED.city,
  languages           = EXCLUDED.languages,
  consultation_modes  = EXCLUDED.consultation_modes,
  verified            = EXCLUDED.verified,
  is_demo             = EXCLUDED.is_demo,
  availability_status = EXCLUDED.availability_status
WHERE public.lawyers.is_demo = TRUE;

-- ---------------------------------------------------------------------------
-- 4. Upsert Lawyer Specializations (Guarantees no modification of non-demo rows)
-- ---------------------------------------------------------------------------
INSERT INTO public.lawyer_specializations (id, lawyer_id, category)
VALUES
  -- 1. Advocate Ayesha Malik (Lahore)
  ('00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0003-000000000001', 'family'),
  ('00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0003-000000000001', 'womens_rights'),
  ('00000000-0000-0000-0004-000000000003', '00000000-0000-0000-0003-000000000001', 'harassment_stalking'),

  -- 2. Advocate Tariq Mehmood Chaudhry (Rawalpindi)
  ('00000000-0000-0000-0004-000000000004', '00000000-0000-0000-0003-000000000002', 'property'),
  ('00000000-0000-0000-0004-000000000005', '00000000-0000-0000-0003-000000000002', 'police_criminal'),
  ('00000000-0000-0000-0004-000000000006', '00000000-0000-0000-0003-000000000002', 'contract'),

  -- 3. Advocate Zainab Bukhari (Faisalabad)
  ('00000000-0000-0000-0004-000000000007', '00000000-0000-0000-0003-000000000003', 'employment'),
  ('00000000-0000-0000-0004-000000000008', '00000000-0000-0000-0003-000000000003', 'business_compliance'),
  ('00000000-0000-0000-0004-000000000009', '00000000-0000-0000-0003-000000000003', 'contract'),

  -- 4. Advocate Syed Farhan Rizvi (Karachi)
  ('00000000-0000-0000-0004-000000000010', '00000000-0000-0000-0003-000000000004', 'cybercrime'),
  ('00000000-0000-0000-0004-000000000011', '00000000-0000-0000-0003-000000000004', 'fraud_scam'),
  ('00000000-0000-0000-0004-000000000012', '00000000-0000-0000-0003-000000000004', 'business_compliance'),

  -- 5. Advocate Mehnaz Soomro (Hyderabad)
  ('00000000-0000-0000-0004-000000000013', '00000000-0000-0000-0003-000000000005', 'family'),
  ('00000000-0000-0000-0004-000000000014', '00000000-0000-0000-0003-000000000005', 'womens_rights'),
  ('00000000-0000-0000-0004-000000000015', '00000000-0000-0000-0003-000000000005', 'consumer'),

  -- 6. Advocate Arbab Sher Khan (Peshawar)
  ('00000000-0000-0000-0004-000000000016', '00000000-0000-0000-0003-000000000006', 'police_criminal'),
  ('00000000-0000-0000-0004-000000000017', '00000000-0000-0000-0003-000000000006', 'property'),
  ('00000000-0000-0000-0004-000000000018', '00000000-0000-0000-0003-000000000006', 'human_rights'),

  -- 7. Advocate Maryam Khattak (Abbottabad)
  ('00000000-0000-0000-0004-000000000019', '00000000-0000-0000-0003-000000000007', 'property'),
  ('00000000-0000-0000-0004-000000000020', '00000000-0000-0000-0003-000000000007', 'contract'),
  ('00000000-0000-0000-0004-000000000021', '00000000-0000-0000-0003-000000000007', 'consumer'),

  -- 8. Advocate Mir Jahangir Baloch (Quetta)
  ('00000000-0000-0000-0004-000000000022', '00000000-0000-0000-0003-000000000008', 'human_rights'),
  ('00000000-0000-0000-0004-000000000023', '00000000-0000-0000-0003-000000000008', 'police_criminal'),
  ('00000000-0000-0000-0004-000000000024', '00000000-0000-0000-0003-000000000008', 'property'),

  -- 9. Advocate Bilal Ahmed Rind (Gwadar)
  ('00000000-0000-0000-0004-000000000025', '00000000-0000-0000-0003-000000000009', 'property'),
  ('00000000-0000-0000-0004-000000000026', '00000000-0000-0000-0003-000000000009', 'contract'),
  ('00000000-0000-0000-0004-000000000027', '00000000-0000-0000-0003-000000000009', 'business_compliance'),

  -- 10. Barrister Daniyal Qureshi (Islamabad)
  ('00000000-0000-0000-0004-000000000028', '00000000-0000-0000-0003-000000000010', 'cybercrime'),
  ('00000000-0000-0000-0004-000000000029', '00000000-0000-0000-0003-000000000010', 'tax'),
  ('00000000-0000-0000-0004-000000000030', '00000000-0000-0000-0003-000000000010', 'business_compliance')
ON CONFLICT (id) DO UPDATE SET
  category = CASE
    WHEN public.lawyer_specializations.lawyer_id = EXCLUDED.lawyer_id
     AND EXISTS (
       SELECT 1 FROM public.lawyers l
       WHERE l.id = EXCLUDED.lawyer_id AND l.is_demo = TRUE
     )
    THEN EXCLUDED.category
    ELSE public.abort_seed_conflict('public.lawyer_specializations id ' || EXCLUDED.id::text || ' collides with an unexpected record')
  END
WHERE public.lawyer_specializations.lawyer_id = EXCLUDED.lawyer_id;

-- ---------------------------------------------------------------------------
-- 5. Upsert Lawyer Availability (Guarantees no modification of non-demo rows)
-- ---------------------------------------------------------------------------
INSERT INTO public.lawyer_availability (id, lawyer_id, day, start_time, end_time)
VALUES
  -- 1. Advocate Ayesha Malik (Lahore)
  ('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0003-000000000001', 'monday', '14:00:00', '18:00:00'),
  ('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0003-000000000001', 'wednesday', '14:00:00', '18:00:00'),
  ('00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0003-000000000001', 'friday', '10:00:00', '13:00:00'),

  -- 2. Advocate Tariq Mehmood Chaudhry (Rawalpindi)
  ('00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0003-000000000002', 'tuesday', '11:00:00', '16:00:00'),
  ('00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0003-000000000002', 'thursday', '11:00:00', '16:00:00'),

  -- 3. Advocate Zainab Bukhari (Faisalabad)
  ('00000000-0000-0000-0005-000000000006', '00000000-0000-0000-0003-000000000003', 'monday', '09:00:00', '13:00:00'),
  ('00000000-0000-0000-0005-000000000007', '00000000-0000-0000-0003-000000000003', 'wednesday', '09:00:00', '13:00:00'),

  -- 4. Advocate Syed Farhan Rizvi (Karachi)
  ('00000000-0000-0000-0005-000000000008', '00000000-0000-0000-0003-000000000004', 'monday', '15:00:00', '19:00:00'),
  ('00000000-0000-0000-0005-000000000009', '00000000-0000-0000-0003-000000000004', 'tuesday', '15:00:00', '19:00:00'),
  ('00000000-0000-0000-0005-000000000010', '00000000-0000-0000-0003-000000000004', 'saturday', '10:00:00', '14:00:00'),

  -- 5. Advocate Mehnaz Soomro (Hyderabad)
  ('00000000-0000-0000-0005-000000000011', '00000000-0000-0000-0003-000000000005', 'wednesday', '10:00:00', '15:00:00'),
  ('00000000-0000-0000-0005-000000000012', '00000000-0000-0000-0003-000000000005', 'thursday', '10:00:00', '15:00:00'),

  -- 6. Advocate Arbab Sher Khan (Peshawar)
  ('00000000-0000-0000-0005-000000000013', '00000000-0000-0000-0003-000000000006', 'monday', '11:00:00', '15:00:00'),
  ('00000000-0000-0000-0005-000000000014', '00000000-0000-0000-0003-000000000006', 'friday', '09:00:00', '12:00:00'),

  -- 7. Advocate Maryam Khattak (Abbottabad)
  ('00000000-0000-0000-0005-000000000015', '00000000-0000-0000-0003-000000000007', 'tuesday', '10:00:00', '14:00:00'),
  ('00000000-0000-0000-0005-000000000016', '00000000-0000-0000-0003-000000000007', 'thursday', '10:00:00', '14:00:00'),

  -- 8. Advocate Mir Jahangir Baloch (Quetta)
  ('00000000-0000-0000-0005-000000000017', '00000000-0000-0000-0003-000000000008', 'monday', '10:00:00', '14:00:00'),
  ('00000000-0000-0000-0005-000000000018', '00000000-0000-0000-0003-000000000008', 'wednesday', '10:00:00', '14:00:00'),

  -- 9. Advocate Bilal Ahmed Rind (Gwadar)
  ('00000000-0000-0000-0005-000000000019', '00000000-0000-0000-0003-000000000009', 'tuesday', '14:00:00', '18:00:00'),
  ('00000000-0000-0000-0005-000000000020', '00000000-0000-0000-0003-000000000009', 'thursday', '14:00:00', '18:00:00'),

  -- 10. Barrister Daniyal Qureshi (Islamabad)
  ('00000000-0000-0000-0005-000000000021', '00000000-0000-0000-0003-000000000010', 'monday', '16:00:00', '20:00:00'),
  ('00000000-0000-0000-0005-000000000022', '00000000-0000-0000-0003-000000000010', 'wednesday', '16:00:00', '20:00:00'),
  ('00000000-0000-0000-0005-000000000023', '00000000-0000-0000-0003-000000000010', 'saturday', '11:00:00', '15:00:00')
ON CONFLICT (id) DO UPDATE SET
  day = CASE
    WHEN public.lawyer_availability.lawyer_id = EXCLUDED.lawyer_id
     AND EXISTS (
       SELECT 1 FROM public.lawyers l
       WHERE l.id = EXCLUDED.lawyer_id AND l.is_demo = TRUE
     )
    THEN EXCLUDED.day
    ELSE public.abort_seed_conflict('public.lawyer_availability id ' || EXCLUDED.id::text || ' collides with an unexpected record')
  END,
  start_time = CASE
    WHEN public.lawyer_availability.lawyer_id = EXCLUDED.lawyer_id
     AND EXISTS (
       SELECT 1 FROM public.lawyers l
       WHERE l.id = EXCLUDED.lawyer_id AND l.is_demo = TRUE
     )
    THEN EXCLUDED.start_time
    ELSE public.abort_seed_conflict('public.lawyer_availability id ' || EXCLUDED.id::text || ' collides with an unexpected record')
  END,
  end_time = CASE
    WHEN public.lawyer_availability.lawyer_id = EXCLUDED.lawyer_id
     AND EXISTS (
       SELECT 1 FROM public.lawyers l
       WHERE l.id = EXCLUDED.lawyer_id AND l.is_demo = TRUE
     )
    THEN EXCLUDED.end_time
    ELSE public.abort_seed_conflict('public.lawyer_availability id ' || EXCLUDED.id::text || ' collides with an unexpected record')
  END
WHERE public.lawyer_availability.lawyer_id = EXCLUDED.lawyer_id;

-- ---------------------------------------------------------------------------
-- 6. Post-Write Assertion Check: Verify all expected demo records exist
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_lawyers_count INT;
  v_specs_count INT;
  v_avail_count INT;
BEGIN
  SELECT count(*) INTO v_lawyers_count FROM public.lawyers WHERE is_demo = TRUE;
  SELECT count(*) INTO v_specs_count FROM public.lawyer_specializations ls
    JOIN public.lawyers l ON ls.lawyer_id = l.id WHERE l.is_demo = TRUE;
  SELECT count(*) INTO v_avail_count FROM public.lawyer_availability la
    JOIN public.lawyers l ON la.lawyer_id = l.id WHERE l.is_demo = TRUE;

  IF v_lawyers_count <> 10 OR v_specs_count <> 30 OR v_avail_count <> 23 THEN
    RAISE EXCEPTION 'SEED INTEGRITY FAILURE: Expected 10 demo lawyers, 30 specs, 23 availabilities. Found: % lawyers, % specs, % availabilities.',
      v_lawyers_count, v_specs_count, v_avail_count;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 7. Cleanup: Drop temporary helper function within the transaction
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.abort_seed_conflict(TEXT);

COMMIT;
