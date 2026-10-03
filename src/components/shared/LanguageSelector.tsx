import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import type { AppLanguage } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Language option descriptors.
 * Each option maps to a locale/language key recognised by LanguageContext.
 */
export interface LanguageOption {
  /** Value passed to setLanguage */
  value: AppLanguage;
  /** Display label (short) */
  label: string;
  /** Optional ARIA label for screen readers */
  ariaLabel: string;
  /** ISO language code for the HTML lang attribute */
  lang: string;
}

const LANGUAGES: LanguageOption[] = [
  { value: 'en', label: 'EN', ariaLabel: 'English', lang: 'en' },
  { value: 'ur', label: 'اردو', ariaLabel: 'Urdu', lang: 'ur' },
  { value: 'roman_ur', label: 'Roman Ur', ariaLabel: 'Roman Urdu', lang: 'ur-Latn' },
];

export interface LanguageSelectorProps {
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * LanguageSelector — compact button group for switching between EN, Urdu, and Roman Urdu.
 * Uses the useLanguage hook from LanguageContext.
 * Suitable for placement in the navbar or header.
 */
export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  const handleSelect = useCallback(
    (value: AppLanguage) => {
      setLanguage(value);
    },
    [setLanguage]
  );

  return (
    <div
      role="group"
      aria-label="Select language"
      className={cn(
        'inline-flex items-center rounded-lg border border-[#D6D3D1] overflow-hidden bg-white',
        className
      )}
    >
      {LANGUAGES.map((opt, index) => {
        const isActive = language === opt.value;
        const isFirst = index === 0;
        const isLast = index === LANGUAGES.length - 1;

        return (
          <button
            key={opt.value}
            type="button"
            lang={opt.lang}
            onClick={() => handleSelect(opt.value)}
            aria-label={opt.ariaLabel}
            aria-pressed={isActive}
            className={cn(
              'px-2.5 py-1.5 text-xs font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7C3AED]',
              // Dividers between buttons
              !isFirst && 'border-l border-[#D6D3D1]',
              // Active state
              isActive
                ? 'bg-[#7C3AED] text-white'
                : 'text-[#57534E] hover:bg-[#F4F1EC] hover:text-[#1C1917]',
              // Round outer corners only
              isFirst && 'rounded-l-[7px]',
              isLast && 'rounded-r-[7px]'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
