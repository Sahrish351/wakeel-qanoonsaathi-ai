/**
 * Cryptographic hash utilities using the native Web Crypto API.
 * These functions are async and only available in secure contexts (HTTPS / localhost).
 */

/**
 * Computes a SHA-256 hex digest of the given File's binary content.
 *
 * @param file - The File object to hash
 * @returns Hex-encoded SHA-256 digest string
 */
export async function sha256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return hashBuffer(arrayBuffer);
}

/**
 * Computes a SHA-256 hex digest of the given plain text string (UTF-8 encoded).
 *
 * @param text - The string to hash
 * @returns Hex-encoded SHA-256 digest string
 */
export async function sha256Text(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const arrayBuffer = encoder.encode(text).buffer;
  return hashBuffer(arrayBuffer);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function hashBuffer(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
