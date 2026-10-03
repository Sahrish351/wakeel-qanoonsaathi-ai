import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EmptyStateProps {
  /** Lucide icon component (not JSX) — defaults to Inbox */
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** CTA button label */
  actionLabel?: string;
  /** CTA button click handler */
  onAction?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * EmptyState — warm, human empty-data placeholder.
 * Avoids technical jargon; uses encouraging, helpful language.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-6 text-center',
        className
      )}
      aria-label={title}
    >
      {/* Icon container */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#EDE9FE]">
        <Icon className="w-8 h-8 text-[#7C3AED]" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-2 max-w-xs">
        <h3 className="text-base font-semibold text-[#1C1917] leading-snug">{title}</h3>
        {description && (
          <p className="text-sm text-[#57534E] leading-relaxed">{description}</p>
        )}
      </div>

      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
