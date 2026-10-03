import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'caution'
  | 'danger'
  | 'accent'
  | 'outline';

export interface BadgeProps {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Optional Lucide icon rendered before the label */
  icon?: LucideIcon;
  /** Badge label */
  children: React.ReactNode;
  /** Additional Tailwind classes */
  className?: string;
}

// ---------------------------------------------------------------------------
// Variant map
// ---------------------------------------------------------------------------

const variantClasses: Record<BadgeVariant, string> = {
  default:
    'bg-[#F4F1EC] text-[#57534E] border-transparent',
  success:
    'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
  caution:
    'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
  danger:
    'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  accent:
    'bg-[#EDE9FE] text-[#7C3AED] border-[#DDD6FE]',
  outline:
    'bg-transparent text-[#57534E] border-[#D6D3D1]',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Wakeel Badge — small status / category indicator.
 * Pass a Lucide `icon` component directly (not JSX): `icon={CheckCircle}`
 */
export function Badge({
  variant = 'default',
  icon: Icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full border',
        'text-xs font-medium leading-none whitespace-nowrap',
        variantClasses[variant],
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />}
      {children}
    </span>
  );
}
