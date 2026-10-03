import React, { forwardRef, useId } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  /** Accessible label text */
  label?: string;
  /** Validation error message — sets red border and aria-describedby */
  error?: string;
  /** Helper / hint text below the input */
  hint?: string;
  /** Lucide icon rendered on the left inside the input */
  leftIcon?: LucideIcon;
  /** Lucide icon rendered on the right inside the input */
  rightIcon?: LucideIcon;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Wakeel Input — fully accessible text input with label, error, and hint support.
 * Uses forwardRef so parent components can control focus.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      required,
      disabled,
      className,
      ...rest
    },
    ref
  ) => {
    const uid = useId();
    const inputId = `input-${uid}`;
    const errorId = `input-error-${uid}`;
    const hintId = `input-hint-${uid}`;

    const describedBy = [
      error ? errorId : undefined,
      hint ? hintId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#1C1917] leading-none"
          >
            {label}
            {required && (
              <span className="ml-1 text-[#DC2626]" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {LeftIcon && (
            <LeftIcon
              className="absolute left-3 w-4 h-4 text-[#A8A29E] pointer-events-none shrink-0"
              aria-hidden="true"
            />
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              // Base
              'w-full rounded-lg border bg-white text-sm text-[#1C1917]',
              'placeholder:text-[#A8A29E]',
              'transition-colors duration-150',
              // Default border + focus
              'border-[#D6D3D1] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent',
              // Height + padding
              'h-10 py-2.5',
              LeftIcon ? 'pl-9' : 'pl-3',
              RightIcon ? 'pr-9' : 'pr-3',
              // Error state
              error &&
                'border-[#DC2626] focus:ring-[#DC2626]',
              // Disabled state
              'disabled:bg-[#F4F1EC] disabled:text-[#A8A29E] disabled:cursor-not-allowed',
              className
            )}
            {...rest}
          />

          {RightIcon && (
            <RightIcon
              className="absolute right-3 w-4 h-4 text-[#A8A29E] pointer-events-none shrink-0"
              aria-hidden="true"
            />
          )}
        </div>

        {error && (
          <p id={errorId} className="text-xs text-[#DC2626] leading-none" role="alert">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="text-xs text-[#A8A29E] leading-none">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
