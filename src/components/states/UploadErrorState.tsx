import React from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UploadErrorStateProps {
  /** Specific, user-readable error returned by validateDocumentUpload etc. */
  error: string;
  /** Retry / re-select file callback */
  onRetry?: () => void;
  /** Override the default title */
  title?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * UploadErrorState — shown when a file upload fails validation or upload.
 * Displays the specific, human-readable error message (file too large, wrong type, etc.)
 */
export function UploadErrorState({
  error,
  onRetry,
  title = 'Upload failed',
  className,
}: UploadErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-12 px-6 text-center',
        'border-2 border-dashed border-[#FECACA] bg-[#FEF2F2] rounded-xl',
        className
      )}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-[#FECACA]">
        <UploadCloud className="w-7 h-7 text-[#DC2626]" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-1.5 max-w-xs">
        <h3 className="text-sm font-semibold text-[#1C1917]">{title}</h3>
        <p className="text-sm text-[#57534E] leading-relaxed">{error}</p>
      </div>

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Choose a different file
        </Button>
      )}
    </div>
  );
}
