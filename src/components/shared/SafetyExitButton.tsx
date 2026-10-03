// =============================================================
// WAKEEL — Safety Exit Button
// Floating CTA to quickly navigate away from the app.
// DOES NOT clear browser history — this is disclosed to user.
// =============================================================

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { LogOut } from 'lucide-react';
import { useSafety } from '@/contexts/SafetyContext';

// ─── TYPES ────────────────────────────────────────────────────
type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

interface SafetyExitButtonProps {
  /** Force-show regardless of safetyMode (e.g. on safety-sensitive pages) */
  forceVisible?: boolean;
  position?: Position;
}

// ─── POSITION MAP ─────────────────────────────────────────────
const POSITION_CLASSES: Record<Position, string> = {
  'bottom-right': 'bottom-6 right-4 sm:right-6',
  'bottom-left':  'bottom-6 left-4  sm:left-6',
  'top-right':    'top-20  right-4  sm:right-6',
  'top-left':     'top-20  left-4   sm:left-6',
};

// ─── COMPONENT ────────────────────────────────────────────────
export function SafetyExitButton({
  forceVisible = false,
  position = 'bottom-right',
}: SafetyExitButtonProps) {
  const { safetyMode, quickExit } = useSafety();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ── Only render when safetyMode is on OR forceVisible ───────
  const shouldShow = safetyMode || forceVisible;

  // ── Keyboard shortcut: Escape key triggers quick exit ───────
  useEffect(() => {
    if (!shouldShow) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Only trigger if Escape is pressed and no modal/overlay is open
      if (e.key === 'Escape' && document.activeElement === buttonRef.current) {
        e.preventDefault();
        quickExit();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldShow, quickExit]);

  const handleClick = useCallback(() => {
    quickExit();
  }, [quickExit]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      quickExit();
    }
  }, [quickExit]);

  if (!shouldShow) return null;

  return (
    <div
      className={`fixed z-[200] ${POSITION_CLASSES[position]}`}
      // Removed from tab order container — button handles it
    >
      {/* Tooltip / disclaimer */}
      {tooltipVisible && (
        <div
          role="tooltip"
          id="safety-exit-tooltip"
          className={[
            'absolute mb-2 bottom-full',
            position.includes('right') ? 'right-0' : 'left-0',
            'w-64 bg-[#1C1917] text-white text-xs font-["DM_Sans"] rounded-lg px-3 py-2.5 shadow-xl leading-relaxed',
            'before:content-[""] before:absolute before:top-full',
            position.includes('right')
              ? 'before:right-4 before:border-l-4 before:border-r-4 before:border-t-4 before:border-l-transparent before:border-r-transparent before:border-t-[#1C1917]'
              : 'before:left-4 before:border-l-4 before:border-r-4 before:border-t-4 before:border-l-transparent before:border-r-transparent before:border-t-[#1C1917]',
          ].join(' ')}
        >
          <strong className="block mb-1">⚠ Quick Exit</strong>
          This will redirect your browser to Google immediately. It may{' '}
          <strong>not clear your browsing history</strong> or locally stored data.
          For full privacy, clear your browser history manually.
        </div>
      )}

      {/* The button */}
      <button
        ref={buttonRef}
        type="button"
        aria-label="Quick Exit — redirects to Google. Does not clear your browser history."
        aria-describedby={tooltipVisible ? 'safety-exit-tooltip' : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyPress}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        onFocus={() => setTooltipVisible(true)}
        onBlur={() => setTooltipVisible(false)}
        className={[
          'group flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl',
          'bg-red-600 hover:bg-red-700 active:bg-red-800',
          'text-white font-semibold text-sm font-["DM_Sans"]',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-400 focus-visible:ring-offset-2',
          // Subtle entrance animation via CSS class
          'animate-[fade-in-up_0.2s_ease-out]',
          // High contrast ring
          'ring-2 ring-red-400/50',
        ].join(' ')}
      >
        <LogOut
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        <span>Quick Exit</span>
        <span className="sr-only">(Press Escape to activate keyboard shortcut)</span>
      </button>
    </div>
  );
}
