/**
 * File upload validation utilities for Wakeel.
 * All size limits and accepted types are defined as named constants
 * so they can be updated in one place.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MB = 1024 * 1024;

const DOCUMENT_ACCEPTED_TYPES: string[] = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];
const DOCUMENT_ACCEPTED_EXTENSIONS = '.pdf, .doc, .docx, .txt';
const DOCUMENT_MAX_SIZE_MB = 20;

const EVIDENCE_ACCEPTED_TYPES: string[] = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];
const EVIDENCE_ACCEPTED_EXTENSIONS = '.pdf, .doc, .docx, .txt, .jpg, .jpeg, .png, .webp, .heic, .heif';
const EVIDENCE_MAX_SIZE_MB = 25;

const AVATAR_ACCEPTED_TYPES: string[] = ['image/jpeg', 'image/png', 'image/webp'];
const AVATAR_ACCEPTED_EXTENSIONS = '.jpg, .jpeg, .png, .webp';
const AVATAR_MAX_SIZE_MB = 5;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function validate(
  file: File,
  acceptedTypes: string[],
  acceptedExtensions: string,
  maxSizeMB: number
): ValidationResult {
  if (!acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type. Please upload one of: ${acceptedExtensions}.`,
    };
  }

  if (file.size > maxSizeMB * MB) {
    return {
      valid: false,
      error: `File is too large. Maximum allowed size is ${maxSizeMB} MB (your file is ${(
        file.size / MB
      ).toFixed(1)} MB).`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected file is empty.' };
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validates a legal document upload.
 * Allowed: PDF, DOC, DOCX, TXT — max 20 MB.
 */
export function validateDocumentUpload(file: File): ValidationResult {
  return validate(file, DOCUMENT_ACCEPTED_TYPES, DOCUMENT_ACCEPTED_EXTENSIONS, DOCUMENT_MAX_SIZE_MB);
}

/**
 * Validates an evidence file upload (documents + images).
 * Allowed: PDF, DOC, DOCX, TXT, JPEG, PNG, WEBP, HEIC/HEIF — max 25 MB.
 */
export function validateEvidenceUpload(file: File): ValidationResult {
  return validate(file, EVIDENCE_ACCEPTED_TYPES, EVIDENCE_ACCEPTED_EXTENSIONS, EVIDENCE_MAX_SIZE_MB);
}

/**
 * Validates a user avatar upload.
 * Allowed: JPEG, PNG, WEBP — max 5 MB.
 */
export function validateAvatarUpload(file: File): ValidationResult {
  return validate(file, AVATAR_ACCEPTED_TYPES, AVATAR_ACCEPTED_EXTENSIONS, AVATAR_MAX_SIZE_MB);
}
