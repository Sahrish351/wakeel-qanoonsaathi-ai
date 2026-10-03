import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'outline';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Alias for loading */
  isLoading?: boolean;
  /** Stretch to fill container width */
  fullWidth?: boolean;
  /** Icon rendered before label */
  leftIcon?: React.ReactNode;
  /** Icon rendered after label */
  rightIcon?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Variant + size maps
// ---------------------------------------------------------------------------

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-[#1C1917] text-white hover:bg-[#292524] active:bg-[#1C1917] focus-visible:ring-[#1C1917]',
  primary:
    'bg-[#7C3AED] text-white hover:bg-[#6D28D9] active:bg-[#5B21B6] focus-visible:ring-[#7C3AED]',
  secondary:
    'bg-[#EDE9FE] text-[#7C3AED] hover:bg-[#DDD6FE] active:bg-[#C4B5FD] focus-visible:ring-[#7C3AED]',
  ghost:
    'bg-transparent text-[#57534E] hover:bg-[#F4F1EC] active:bg-[#E7E5E4] focus-visible:ring-[#7C3AED]',
  destructive:
    'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] focus-visible:ring-[#DC2626]',
  outline:
    'bg-transparent border border-[#D6D3D1] text-[#1C1917] hover:bg-[#F4F1EC] active:bg-[#E7E5E4] focus-visible:ring-[#7C3AED]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Wakeel Button — use `variant` + `size` props to control appearance.
 * Supports loading state, icons, and full accessibility.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      loading = false,
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isBusy = loading || isLoading;
    const isDisabled = disabled || isBusy;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isBusy}
        className={cn(
          // Base
          'inline-flex items-center justify-center font-medium rounded-lg',
          'transition-colors duration-150',
          // Focus ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          // Disabled / loading
          'disabled:opacity-50 disabled:cursor-not-allowed',
          // Variant
          variantClasses[variant],
          // Size
          sizeClasses[size],
          // Width
          fullWidth && 'w-full',
          className
        )}
        {...rest}
      >
        {isBusy ? (
          <Loader2
            className={cn('animate-spin shrink-0', iconSizeClasses[size])}
            aria-hidden="true"
          />
        ) : (
          leftIcon && (
            <span className={cn('shrink-0', iconSizeClasses[size])} aria-hidden="true">
              {leftIcon}
            </span>
          )
        )}

        {children && <span>{children}</span>}

        {!isBusy && rightIcon && (
          <span className={cn('shrink-0', iconSizeClasses[size])} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
