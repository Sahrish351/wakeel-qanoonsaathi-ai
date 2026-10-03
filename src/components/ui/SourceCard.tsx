import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/date';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SourceCardProps {
  /** Name of the authoritative body (e.g., "Supreme Court of Pakistan") */
  authority: string;
  /** Human-readable title of the source */
  title: string;
  /** Public URL to the source */
  url: string;
  /** Jurisdiction label (e.g., "Federal", "Punjab") */
  jurisdiction?: string;
  /** ISO date string when the source was last reviewed */
  last_reviewed_at?: string;
  /** Whether the source has been verified by Wakeel */
  verified?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * SourceCard — displays a legal source citation with left plum accent border.
 * The internal source_id is intentionally never exposed.
 */
export function SourceCard({
  authority,
  title,
  url,
  jurisdiction,
  last_reviewed_at,
  verified = false,
  className,
}: SourceCardProps) {
  return (
    <div
      className={cn(
        'relative flex gap-3 bg-white rounded-lg border border-[#E7E5E4]',
        'shadow-sm pl-4 pr-4 py-3 overflow-hidden',
        className
      )}
    >
      {/* Left accent border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-[#7C3AED]"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-1 min-w-0 w-full">
        {/* Authority row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#7C3AED] truncate">
            {authority}
          </span>
          {jurisdiction && (
            <Badge variant="outline" className="text-[10px]">
              {jurisdiction}
            </Badge>
          )}
          {verified && (
            <Badge variant="accent" icon={ShieldCheck} className="text-[10px]">
              Verified
            </Badge>
          )}
        </div>

        {/* Title */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'text-sm font-medium text-[#1C1917] leading-snug',
            'hover:text-[#7C3AED] hover:underline transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded'
          )}
          aria-label={`${title} — opens in new tab`}
        >
          <span className="inline-flex items-center gap-1 flex-wrap">
            {title}
            <ExternalLink className="w-3 h-3 shrink-0 text-[#A8A29E]" aria-hidden="true" />
          </span>
        </a>

        {/* Footer metadata */}
        {last_reviewed_at && (
          <p className="text-[10px] text-[#A8A29E] mt-0.5">
            Last reviewed: {formatDate(last_reviewed_at)}
          </p>
        )}
      </div>
    </div>
  );
}
