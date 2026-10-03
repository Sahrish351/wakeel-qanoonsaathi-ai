import React from 'react';
import { ShieldOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PermissionStateProps {
  title?: string;
  message?: string;
  /** Back link URL or callback */
  backHref?: string;
  onBack?: () => void;
  backLabel?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * PermissionState — shown when a user lacks access to a resource.
 */
export function PermissionState({
  title = "You don't have permission to view this",
  message = 'If you believe this is an error, please contact your administrator or return to the previous page.',
  backHref,
  onBack,
  backLabel = 'Go back',
  className,
}: PermissionStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-6 text-center',
        className
      )}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F4F1EC]">
        <ShieldOff className="w-8 h-8 text-[#A8A29E]" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="text-base font-semibold text-[#1C1917] leading-snug">{title}</h3>
        <p className="text-sm text-[#57534E] leading-relaxed">{message}</p>
      </div>

      {/* Back link */}
      {(backHref || onBack) && (
        backHref ? (
          <a
            href={backHref}
            className={cn(
              'text-sm font-medium text-[#7C3AED] hover:underline',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded'
            )}
          >
            ← {backLabel}
          </a>
        ) : (
          <button
            onClick={onBack}
            className={cn(
              'text-sm font-medium text-[#7C3AED] hover:underline',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded'
            )}
          >
            ← {backLabel}
          </button>
        )
      )}
    </div>
  );
}
