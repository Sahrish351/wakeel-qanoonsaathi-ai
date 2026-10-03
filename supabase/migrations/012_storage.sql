-- =============================================================================
-- Migration: 012_storage.sql
-- Description: Initializes private Supabase Storage buckets (avatars, case-documents, evidence)
--              and sets rigorous Row Level Security policies.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. BUCKET REGISTRATION
-- ---------------------------------------------------------------------------

-- Create 'avatars' bucket (private, max 5MB, images only)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  false,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Create 'case-documents' bucket (strictly private, max 20MB, documents & images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'case-documents',
  'case-documents',
  false,
  20971520, -- 20 MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

-- Create 'evidence' bucket (strictly private, max 25MB, multi-media exhibits)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence',
  'evidence',
  false,
  26214400, -- 25 MB
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 26214400,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'video/mp4'];

-- ---------------------------------------------------------------------------
-- 2. STORAGE OBJECT POLICIES (storage.objects RLS)
-- Path format convention: <owner_user_id>/<filename_or_subpath>
-- ---------------------------------------------------------------------------

-- ==================== AVATARS BUCKET POLICIES ====================

DROP POLICY IF EXISTS "avatars_select_own_or_lawyer" ON storage.objects;
CREATE POLICY "avatars_select_own_or_lawyer"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars'
  AND (
    -- User sees their own avatar
    (storage.foldername(name))[1] = auth.uid()::text
    -- Or viewing a registered lawyer's avatar for discovery
    OR EXISTS (
      SELECT 1 FROM public.lawyers l
      JOIN public.profiles p ON l.profile_id = p.id
      WHERE p.id::text = (storage.foldername(name))[1]
    )
    OR public.is_admin()
  )
);

DROP POLICY IF EXISTS "avatars_insert_own" ON storage.objects;
CREATE POLICY "avatars_insert_own"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "avatars_update_own" ON storage.objects;
CREATE POLICY "avatars_update_own"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "avatars_delete_own" ON storage.objects;
CREATE POLICY "avatars_delete_own"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin()
  )
);

-- ==================== CASE-DOCUMENTS BUCKET POLICIES ====================

DROP POLICY IF EXISTS "case_documents_select" ON storage.objects;
CREATE POLICY "case_documents_select"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'case-documents'
  AND (
    -- File owner
    (storage.foldername(name))[1] = auth.uid()::text
    -- Assigned lawyer through an active consultation on the associated case
    OR EXISTS (
      SELECT 1 FROM public.documents d
      JOIN public.consultations c ON d.case_id = c.case_id
      JOIN public.lawyers l ON c.lawyer_id = l.id
      WHERE d.storage_path = name
        AND l.profile_id = auth.uid()
        AND c.status IN ('accepted', 'scheduled', 'completed')
    )
    OR public.is_admin()
  )
);

DROP POLICY IF EXISTS "case_documents_insert_own" ON storage.objects;
CREATE POLICY "case_documents_insert_own"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'case-documents'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "case_documents_update_own" ON storage.objects;
CREATE POLICY "case_documents_update_own"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'case-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'case-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "case_documents_delete_own" ON storage.objects;
CREATE POLICY "case_documents_delete_own"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'case-documents'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin()
  )
);

-- ==================== EVIDENCE BUCKET POLICIES ====================

DROP POLICY IF EXISTS "evidence_select_own" ON storage.objects;
CREATE POLICY "evidence_select_own"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'evidence'
  AND (
    -- Exhibit owner only
    (storage.foldername(name))[1] = auth.uid()::text
    -- Or assigned lawyer with explicit consultation access
    OR EXISTS (
      SELECT 1 FROM public.evidence_items ei
      JOIN public.cases cs ON ei.case_id = cs.id
      JOIN public.consultations c ON cs.id = c.case_id
      JOIN public.lawyers l ON c.lawyer_id = l.id
      WHERE ei.hash = (storage.filename(name))
        AND l.profile_id = auth.uid()
        AND c.status IN ('accepted', 'scheduled')
    )
    OR public.is_admin()
  )
);

DROP POLICY IF EXISTS "evidence_insert_own" ON storage.objects;
CREATE POLICY "evidence_insert_own"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'evidence'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "evidence_delete_own" ON storage.objects;
CREATE POLICY "evidence_delete_own"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'evidence'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin()
  )
);
