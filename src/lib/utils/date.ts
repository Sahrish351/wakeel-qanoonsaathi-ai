/**
 * Date formatting utilities for the Wakeel application.
 * Locales default to 'en-PK' to surface Pakistani English conventions.
 */

const DEFAULT_LOCALE = 'en-PK';

// ---------------------------------------------------------------------------
// Normalise
// ---------------------------------------------------------------------------

function toDate(date: string | Date): Date {
  return typeof date === 'string' ? new Date(date) : date;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Formats a date as a human-readable long-form string.
 * Example: "2 October 2026"
 */
export function formatDate(date: string | Date, locale = DEFAULT_LOCALE): string {
  const d = toDate(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Returns a relative time string like "2 hours ago", "just now", or "3 days ago".
 * Uses Intl.RelativeTimeFormat when available.
 */
export function formatRelative(date: string | Date, locale = DEFAULT_LOCALE): string {
  const d = toDate(date);
  if (isNaN(d.getTime())) return 'Unknown date';

  const now = Date.now();
  const diffMs = d.getTime() - now; // negative = in the past
  const diffSec = Math.round(diffMs / 1_000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
  if (Math.abs(diffDay) < 7) return rtf.format(diffDay, 'day');
  if (Math.abs(diffWeek) < 5) return rtf.format(diffWeek, 'week');
  if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month');
  return rtf.format(diffYear, 'year');
}

/**
 * Returns a deadline-oriented string.
 * Examples: "Due in 3 days", "Overdue by 2 days", "Due today"
 */
export function formatDeadline(date: string | Date, locale = DEFAULT_LOCALE): string {
  const d = toDate(date);
  if (isNaN(d.getTime())) return 'No deadline';

  const now = new Date();
  // Strip time components for day-level comparison
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDeadline = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffMs = startOfDeadline.getTime() - startOfToday.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffDays === 0) return 'Due today';
  if (diffDays > 0) return `Due ${rtf.format(diffDays, 'day')}`;
  return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
}

/**
 * Returns true if the given date is strictly before now (start of today).
 */
export function isOverdue(date: string | Date): boolean {
  const d = toDate(date);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return d < startOfToday;
}
