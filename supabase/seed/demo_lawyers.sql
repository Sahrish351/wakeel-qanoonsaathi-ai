-- =============================================================================
-- Seed Data: seed/demo_lawyers.sql
-- Description: Synthetic demo legal practitioner profiles for Wakeel platform.
--              *** ALL DATA IS FICTIONAL AND FOR DEMONSTRATION PURPOSES ONLY ***
--              All bios are prefixed with "[DEMO PROFILE]".
--              Covers Punjab, Sindh, KPK, Balochistan, and Islamabad.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Create Synthetic Demo Auth Users (Supabase auth.users)
-- ---------------------------------------------------------------------------
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES
  (
    '00000000-0000-0000-0002-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo.ayesha.malik@wakeel-demo.local',
    crypt('DemoPassword123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Advocate Ayesha Malik","role":"lawyer"}',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0002-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo.tariq.chaudhry@wakeel-demo.local',
    crypt('DemoPassword123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Advocate Tariq Mehmood Chaudhry","role":"lawyer"}',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0002-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo.zainab.bukhari@wakeel-demo.local',
    crypt('DemoPassword123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Advocate Zainab Bukhari","role":"lawyer"}',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0002-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo.farhan.rizvi@wakeel-demo.local',
    crypt('DemoPassword123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Advocate Syed Farhan Rizvi","role":"lawyer"}',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0002-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo.mehnaz.soomro@wakeel-demo.local',
    crypt('DemoPassword123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Advocate Mehnaz Soomro","role":"lawyer"}',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0002-000000000006',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo.arbab.khan@wakeel-demo.local',
    crypt('DemoPassword123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Advocate Arbab Sher Khan","role":"lawyer"}',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0002-000000000007',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo.maryam.khattak@wakeel-demo.local',
    crypt('DemoPassword123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Advocate Maryam Khattak","role":"lawyer"}',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0002-000000000008',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo.jahangir.baloch@wakeel-demo.local',
    crypt('DemoPassword123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Advocate Mir Jahangir Baloch","role":"lawyer"}',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0002-000000000009',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo.bilal.rind@wakeel-demo.local',
    crypt('DemoPassword123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Advocate Bilal Ahmed Rind","role":"lawyer"}',
    NOW(),
    NOW()
  ),
  (
    '00000000-0000-0000-0002-000000000010',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'demo.daniyal.qureshi@wakeel-demo.local',
    crypt('DemoPassword123!', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Barrister Daniyal Qureshi","role":"lawyer"}',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. Upsert Profiles for Demo Lawyers
-- ---------------------------------------------------------------------------
INSERT INTO public.profiles (id, full_name, role, province, city, preferred_language)
VALUES
  ('00000000-0000-0000-0002-000000000001', 'Advocate Ayesha Malik', 'lawyer', 'Punjab', 'Lahore', 'en'),
  ('00000000-0000-0000-0002-000000000002', 'Advocate Tariq Mehmood Chaudhry', 'lawyer', 'Punjab', 'Rawalpindi', 'ur'),
  ('00000000-0000-0000-0002-000000000003', 'Advocate Zainab Bukhari', 'lawyer', 'Punjab', 'Faisalabad', 'en'),
  ('00000000-0000-0000-0002-000000000004', 'Advocate Syed Farhan Rizvi', 'lawyer', 'Sindh', 'Karachi', 'en'),
  ('00000000-0000-0000-0002-000000000005', 'Advocate Mehnaz Soomro', 'lawyer', 'Sindh', 'Hyderabad', 'ur'),
  ('00000000-0000-0000-0002-000000000006', 'Advocate Arbab Sher Khan', 'lawyer', 'Khyber Pakhtunkhwa', 'Peshawar', 'ur'),
  ('00000000-0000-0000-0002-000000000007', 'Advocate Maryam Khattak', 'lawyer', 'Khyber Pakhtunkhwa', 'Abbottabad', 'en'),
  ('00000000-0000-0000-0002-000000000008', 'Advocate Mir Jahangir Baloch', 'lawyer', 'Balochistan', 'Quetta', 'ur'),
  ('00000000-0000-0000-0002-000000000009', 'Advocate Bilal Ahmed Rind', 'lawyer', 'Balochistan', 'Gwadar', 'en'),
  ('00000000-0000-0000-0002-000000000010', 'Barrister Daniyal Qureshi', 'lawyer', 'Islamabad Capital Territory', 'Islamabad', 'en')
ON CONFLICT (id) DO UPDATE SET
  full_name          = EXCLUDED.full_name,
  role               = EXCLUDED.role,
  province           = EXCLUDED.province,
  city               = EXCLUDED.city,
  preferred_language = EXCLUDED.preferred_language;

-- ---------------------------------------------------------------------------
-- 3. Upsert Lawyers Directory Records
-- ---------------------------------------------------------------------------
INSERT INTO public.lawyers (
  id,
  profile_id,
  bio,
  province,
  city,
  languages,
  consultation_modes,
  verified,
  availability_status
)
VALUES
  (
    '00000000-0000-0000-0003-000000000001',
    '00000000-0000-0000-0002-000000000001',
    '[DEMO PROFILE] High Court Advocate licensed by Punjab Bar Council (Synthetic Reg: PBC-DEMO-2024-001). 10+ years representation in family disputes, khula, child custody, maintenance petitions, and workplace harassment safeguards across Lahore courts.',
    'Punjab',
    'Lahore',
    ARRAY['en', 'ur', 'pa'],
    ARRAY['in_person', 'video', 'phone'],
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000002',
    '00000000-0000-0000-0002-000000000002',
    '[DEMO PROFILE] Senior Advocate practicing at Rawalpindi District Courts and Lahore High Court Rawalpindi Bench (Synthetic Reg: PBC-DEMO-2024-002). Experienced in land revenue records (Fard, Patwari matters), property partition, and criminal defense proceedings.',
    'Punjab',
    'Rawalpindi',
    ARRAY['en', 'ur', 'pa'],
    ARRAY['in_person', 'phone'],
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000003',
    '00000000-0000-0000-0002-000000000003',
    '[DEMO PROFILE] Advocate specializing in employment law, industrial disputes, corporate contracts, and worker welfare compliance in industrial zones of Faisalabad (Synthetic Reg: PBC-DEMO-2024-003). Member Faisalabad Bar Association.',
    'Punjab',
    'Faisalabad',
    ARRAY['en', 'ur'],
    ARRAY['in_person', 'video'],
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000004',
    '00000000-0000-0000-0002-000000000004',
    '[DEMO PROFILE] Advocate High Court enrolled with Sindh Bar Council (Synthetic Reg: SBC-DEMO-2024-004). Focused on cybercrime under PECA 2016, digital banking scams, fintech regulations, and electronic evidence recovery in Karachi.',
    'Sindh',
    'Karachi',
    ARRAY['en', 'ur', 'sd'],
    ARRAY['in_person', 'video', 'phone'],
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000005',
    '00000000-0000-0000-0002-000000000005',
    '[DEMO PROFILE] Advocate District & Sessions Court Hyderabad (Synthetic Reg: SBC-DEMO-2024-005). Passionate about women''s rights, inheritance rights under Islamic jurisprudence, and consumer protection courts in Sindh.',
    'Sindh',
    'Hyderabad',
    ARRAY['en', 'ur', 'sd'],
    ARRAY['in_person', 'phone'],
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000006',
    '00000000-0000-0000-0002-000000000006',
    '[DEMO PROFILE] Advocate High Court enrolled with Khyber Pakhtunkhwa Bar Council (Synthetic Reg: KPBC-DEMO-2024-006). Extensive litigation background in criminal appellate defense, bail applications, police accountability, and constitutional writs in Peshawar.',
    'Khyber Pakhtunkhwa',
    'Peshawar',
    ARRAY['en', 'ur', 'ps'],
    ARRAY['in_person', 'phone'],
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0002-000000000007',
    '00000000-0000-0000-0002-000000000007',
    '[DEMO PROFILE] Advocate practicing across Hazara Division and Peshawar High Court Abbottabad Bench (Synthetic Reg: KPBC-DEMO-2024-007). Specializes in mountainous land titles, inheritance partition, and civil contractual agreements.',
    'Khyber Pakhtunkhwa',
    'Abbottabad',
    ARRAY['en', 'ur', 'ps'],
    ARRAY['in_person', 'video'],
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0002-000000000008',
    '00000000-0000-0000-0002-000000000008',
    '[DEMO PROFILE] Senior Advocate registered with Balochistan Bar Council (Synthetic Reg: BBC-DEMO-2024-008). 14 years litigating fundamental human rights, constitutional petitions, and criminal bail matters before the High Court of Balochistan in Quetta.',
    'Balochistan',
    'Quetta',
    ARRAY['en', 'ur', 'bal'],
    ARRAY['in_person', 'phone'],
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000009',
    '00000000-0000-0000-0002-000000000009',
    '[DEMO PROFILE] Corporate and property advocate licensed with Balochistan Bar Council (Synthetic Reg: BBC-DEMO-2024-009). Advises maritime, commercial trade, logistics, and real estate investments in Gwadar Free Zone and Makran division.',
    'Balochistan',
    'Gwadar',
    ARRAY['en', 'ur', 'bal'],
    ARRAY['in_person', 'video', 'phone'],
    TRUE,
    'available'
  ),
  (
    '00000000-0000-0000-0003-000000000010',
    '00000000-0000-0000-0002-000000000010',
    '[DEMO PROFILE] Barrister-at-Law (Lincoln''s Inn) and Advocate High Court enrolled with Islamabad Bar Council (Synthetic Reg: IBC-DEMO-2024-010). Focuses on cyber laws, corporate compliance, tax petitions, and regulatory litigation before Islamabad High Court.',
    'Islamabad Capital Territory',
    'Islamabad',
    ARRAY['en', 'ur'],
    ARRAY['in_person', 'video', 'phone'],
    TRUE,
    'available'
  )
ON CONFLICT (id) DO UPDATE SET
  bio                 = EXCLUDED.bio,
  province            = EXCLUDED.province,
  city                = EXCLUDED.city,
  languages           = EXCLUDED.languages,
  consultation_modes  = EXCLUDED.consultation_modes,
  verified            = EXCLUDED.verified,
  availability_status = EXCLUDED.availability_status;

-- ---------------------------------------------------------------------------
-- 4. Lawyer Specializations
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
  category = EXCLUDED.category;

-- ---------------------------------------------------------------------------
-- 5. Lawyer Availability Schedules
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
  day        = EXCLUDED.day,
  start_time = EXCLUDED.start_time,
  end_time   = EXCLUDED.end_time;
