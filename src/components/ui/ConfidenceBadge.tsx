import React from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';

export interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  /** Show a short explanatory label beside the indicator dot */
  showLabel?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Level config
// ---------------------------------------------------------------------------

const config: Record<
  ConfidenceLevel,
  { label: string; dot: string; text: string; explanation: string }
> = {
  high: {
    label: 'High confidence',
    dot: 'bg-[#059669]',
    text: 'text-[#059669]',
    explanation: 'Strongly supported by Pakistani law',
  },
  medium: {
    label: 'Medium confidence',
    dot: 'bg-[#D97706]',
    text: 'text-[#D97706]',
    explanation: 'Partially supported — verify with a lawyer',
  },
  low: {
    label: 'Low confidence',
    dot: 'bg-[#DC2626]',
    text: 'text-[#DC2626]',
    explanation: 'Limited legal backing — seek professional advice',
  },
  unknown: {
    label: 'Confidence unknown',
    dot: 'bg-[#A8A29E]',
    text: 'text-[#A8A29E]',
    explanation: 'Insufficient data to assess confidence',
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ConfidenceBadge — compact inline indicator of AI response confidence.
 * Colour-coded: emerald = high, amber = medium, red = low, gray = unknown.
 */
export function ConfidenceBadge({
  level,
  showLabel = true,
  className,
}: ConfidenceBadgeProps) {
  const c = config[level];

  return (
    <span
      className={cn('inline-flex items-center gap-1.5', className)}
      title={c.explanation}
      aria-label={`${c.label}: ${c.explanation}`}
    >
      {/* Pulsing dot for high, static for others */}
      <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
        {level === 'high' && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-60',
              c.dot
            )}
          />
        )}
        <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', c.dot)} />
      </span>

      {showLabel && (
        <span className={cn('text-xs font-medium leading-none', c.text)}>
          {c.label}
        </span>
      )}
    </span>
  );
}
