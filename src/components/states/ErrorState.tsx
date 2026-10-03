import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ErrorStateProps {
  title?: string;
  /** Human-readable description — never raw technical errors */
  description?: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Retry button label */
  retryLabel?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ErrorState — friendly error placeholder.
 * Never surfaces raw technical error messages directly to users.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We ran into an unexpected problem. Please try again, and if the issue persists, contact support.',
  onRetry,
  retryLabel = 'Try again',
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-6 text-center',
        className
      )}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FEF2F2]">
        <AlertCircle className="w-8 h-8 text-[#DC2626]" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="text-base font-semibold text-[#1C1917] leading-snug">{title}</h3>
        <p className="text-sm text-[#57534E] leading-relaxed">{description}</p>
      </div>

      {onRetry && (
        <Button variant="outline" size="md" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
