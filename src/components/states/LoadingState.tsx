import React from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LoadingStateProps {
  /** Optional message displayed beneath the spinner */
  message?: string;
  /** Extra classes on the container */
  className?: string;
  /** Spinner size: sm = 24px, md = 40px (default), lg = 56px */
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { svg: 24, stroke: 3 },
  md: { svg: 40, stroke: 3.5 },
  lg: { svg: 56, stroke: 4 },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * LoadingState — centred animated SVG ring with accessible live region.
 * Animation is disabled when the user prefers reduced motion.
 */
export function LoadingState({
  message = 'Loading…',
  className,
  size = 'md',
}: LoadingStateProps) {
  const reduced = useReducedMotion();
  const { svg, stroke } = sizeMap[size];
  const r = (svg - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-12 px-4',
        className
      )}
    >
      {/* Animated SVG ring */}
      <svg
        width={svg}
        height={svg}
        viewBox={`0 0 ${svg} ${svg}`}
        fill="none"
        aria-hidden="true"
        className={cn(!reduced && 'animate-spin')}
        style={{ animationDuration: '900ms', animationTimingFunction: 'linear' }}
      >
        {/* Track */}
        <circle
          cx={svg / 2}
          cy={svg / 2}
          r={r}
          stroke="#E7E5E4"
          strokeWidth={stroke}
        />
        {/* Progress arc */}
        <circle
          cx={svg / 2}
          cy={svg / 2}
          r={r}
          stroke="#7C3AED"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75}
          transform={`rotate(-90 ${svg / 2} ${svg / 2})`}
        />
      </svg>

      {message && (
        <p className="text-sm text-[#57534E] text-center max-w-xs">{message}</p>
      )}
    </div>
  );
}
