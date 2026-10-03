// =============================================================
// WAKEEL — Supabase Storage Helpers
// All file access uses signed URLs — never raw storage paths.
// =============================================================

import { supabase } from './client';

export type StorageBucket = 'avatars' | 'case-documents' | 'evidence';

/**
 * Generate a signed URL for temporary secure file access.
 * Do not return or display raw storage paths.
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to generate signed URL: ${error?.message ?? 'Unknown error'}`);
  }

  return data.signedUrl;
}

/**
 * Upload a file to a private bucket.
 * Returns the storage path (NOT a public URL).
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File,
  options?: { upsert?: boolean; contentType?: string }
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: options?.upsert ?? false,
      contentType: options?.contentType ?? file.type,
    });

  if (error || !data?.path) {
    throw new Error(`Upload failed: ${error?.message ?? 'Unknown error'}`);
  }

  return data.path;
}

/**
 * Delete a file from storage.
 * Caller must verify ownership via RLS before calling.
 */
export async function deleteFile(
  bucket: StorageBucket,
  path: string
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Build a storage path for a user's case document.
 * Format: {userId}/cases/{caseId}/{filename}
 */
export function buildDocumentPath(userId: string, caseId: string, filename: string): string {
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${userId}/cases/${caseId}/${Date.now()}_${sanitized}`;
}

/**
 * Build a storage path for evidence.
 * Format: {userId}/evidence/{caseId}/{filename}
 */
export function buildEvidencePath(userId: string, caseId: string, filename: string): string {
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${userId}/evidence/${caseId}/${Date.now()}_${sanitized}`;
}

/**
 * Build a storage path for avatar.
 * Format: {userId}/avatar.{ext}
 */
export function buildAvatarPath(userId: string, filename: string): string {
  const ext = filename.split('.').pop() ?? 'jpg';
  return `${userId}/avatar.${ext}`;
}

