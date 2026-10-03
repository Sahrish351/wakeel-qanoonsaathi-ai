import React from 'react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'ghost';

export interface CardProps {
  variant?: CardVariant;
  /** Apply subtle scale + shadow on hover */
  hoverable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface CardSectionProps {
  className?: string;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Variant map
// ---------------------------------------------------------------------------

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-white border border-[#E7E5E4] shadow-sm',
  elevated:
    'bg-white border border-[#E7E5E4] shadow-md',
  bordered:
    'bg-white border-2 border-[#D6D3D1] shadow-none',
  ghost:
    'bg-[#FAF8F5] border border-transparent shadow-none',
};

// ---------------------------------------------------------------------------
// Card root
// ---------------------------------------------------------------------------

/**
 * Wakeel Card — base surface container.
 */
export function Card({ variant = 'default', hoverable = false, className, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden transition-all duration-200',
        variantClasses[variant],
        hoverable &&
          'cursor-pointer hover:shadow-lg hover:-translate-y-0.5 focus-within:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * Optional header section for a Card — adds bottom border and standard padding.
 */
export function CardHeader({ className, children }: CardSectionProps) {
  return (
    <div
      className={cn(
        'px-5 py-4 border-b border-[#E7E5E4]',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Main content area of a Card.
 */
export function CardContent({ className, children }: CardSectionProps) {
  return (
    <div className={cn('px-5 py-4', className)}>
      {children}
    </div>
  );
}

/**
 * Optional footer section — adds top border and standard padding.
 */
export function CardFooter({ className, children }: CardSectionProps) {
  return (
    <div
      className={cn(
        'px-5 py-3 border-t border-[#E7E5E4] bg-[#FAF8F5]',
        className
      )}
    >
      {children}
    </div>
  );
}
