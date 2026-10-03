import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  /** Accessible label text */
  label?: string;
  /** Validation error message — sets red border and aria-describedby */
  error?: string;
  /** Helper / hint text below the textarea */
  hint?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Wakeel Textarea — accessible multi-line text input with the same label/error/hint
 * API as the Input component.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      required,
      disabled,
      className,
      rows = 4,
      ...rest
    },
    ref
  ) => {
    const uid = useId();
    const textareaId = `textarea-${uid}`;
    const errorId = `textarea-error-${uid}`;
    const hintId = `textarea-hint-${uid}`;

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
            htmlFor={textareaId}
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

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          disabled={disabled}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            // Base
            'w-full rounded-lg border bg-white text-sm text-[#1C1917]',
            'placeholder:text-[#A8A29E]',
            'transition-colors duration-150 resize-y',
            // Default border + focus
            'border-[#D6D3D1] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent',
            // Padding
            'px-3 py-2.5',
            // Error state
            error && 'border-[#DC2626] focus:ring-[#DC2626]',
            // Disabled state
            'disabled:bg-[#F4F1EC] disabled:text-[#A8A29E] disabled:cursor-not-allowed disabled:resize-none',
            className
          )}
          {...rest}
        />

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

Textarea.displayName = 'Textarea';
