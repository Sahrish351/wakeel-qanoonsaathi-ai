import React from 'react';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AIUnavailableStateProps {
  /** Override the default title */
  title?: string;
  /** Override the default description */
  description?: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Whether a retry is currently in progress */
  retrying?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * AIUnavailableState — friendly fallback when Gemini / Edge Functions are
 * temporarily unreachable. Avoids technical error codes.
 */
export function AIUnavailableState({
  title = 'AI assistant is unavailable right now',
  description = 'Our AI service is temporarily unable to respond. This is usually brief — please try again in a few moments. If the problem continues, our support team is here to help.',
  onRetry,
  retrying = false,
  className,
}: AIUnavailableStateProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-6 text-center',
        className
      )}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EDE9FE]">
        <WifiOff className="w-8 h-8 text-[#7C3AED]" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="text-base font-semibold text-[#1C1917] leading-snug">{title}</h3>
        <p className="text-sm text-[#57534E] leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            loading={retrying}
            disabled={retrying}
          >
            {retrying ? 'Retrying…' : 'Try again'}
          </Button>
        )}
        <a
          href="mailto:support@wakeel.ai"
          className={cn(
            'inline-flex items-center justify-center h-10 px-4',
            'text-sm font-medium text-[#57534E] hover:text-[#1C1917]',
            'border border-[#D6D3D1] rounded-lg hover:bg-[#F4F1EC]',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]'
          )}
        >
          Contact support
        </a>
      </div>
    </div>
  );
}
