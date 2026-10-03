import React, { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DISMISS_KEY = 'wakeel_disclaimer_dismissed';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DisclaimerBannerProps {
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * DisclaimerBanner — compact, dismissible legal disclaimer strip.
 * Dismissed state is persisted in sessionStorage so it clears on tab close.
 * Soft, non-intrusive design — uses muted background so it doesn't compete
 * with primary content.
 */
export function DisclaimerBanner({ className }: DisclaimerBannerProps) {
  const [visible, setVisible] = useState(false);

  // Initialise after mount to avoid SSR mismatch
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(DISMISS_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      // sessionStorage unavailable (private mode) — show banner anyway
      setVisible(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // Fail silently
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="note"
      aria-label="Legal disclaimer"
      className={cn(
        'w-full bg-[#F4F1EC] border-b border-[#E7E5E4]',
        'px-4 py-2',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <p className="text-xs text-[#57534E] leading-relaxed">
          <span className="font-semibold text-[#1C1917]">Wakeel</span> provides legal
          information and decision support — not legal advice. It is not a lawyer or law
          firm.{' '}
          <a
            href="/terms"
            className="underline hover:text-[#7C3AED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded"
          >
            Learn more
          </a>
        </p>

        <button
          onClick={dismiss}
          aria-label="Dismiss disclaimer"
          className={cn(
            'shrink-0 p-1 rounded',
            'text-[#A8A29E] hover:text-[#57534E] hover:bg-[#E7E5E4]',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]'
          )}
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
