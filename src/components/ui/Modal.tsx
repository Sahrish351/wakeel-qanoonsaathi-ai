import React, {
  useCallback,
  useEffect,
  useId,
  useRef,
} from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when the modal requests close (Escape, backdrop click, close button) */
  onClose: () => void;
  /** Accessible title for the dialog */
  title?: string;
  /** Extra classes on the dialog panel */
  className?: string;
  /** Close on backdrop click (default: true) */
  closeOnBackdrop?: boolean;
  children?: React.ReactNode;
}

export interface ModalSectionProps {
  className?: string;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Focus trap
// ---------------------------------------------------------------------------

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function trapFocus(container: HTMLElement, event: KeyboardEvent) {
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

// ---------------------------------------------------------------------------
// Modal root
// ---------------------------------------------------------------------------

/**
 * Wakeel Modal — accessible dialog with focus trap, Escape key, backdrop close,
 * and smooth enter/exit animation that respects reduced motion preferences.
 */
export function Modal({
  open,
  onClose,
  title,
  className,
  closeOnBackdrop = true,
  children,
}: ModalProps) {
  const prefersReduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  // Save & restore focus
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement;
      // Focus the dialog panel on next tick
      requestAnimationFrame(() => {
        const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE);
        (first ?? dialogRef.current)?.focus();
      });
    } else {
      previouslyFocused.current?.focus();
    }
  }, [open]);

  // Keyboard handling
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab' && dialogRef.current) {
        trapFocus(dialogRef.current, e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        prefersReduced ? 'bg-black/50' : 'bg-black/50 animate-[fadeIn_150ms_ease]'
      )}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? titleId : undefined}
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-lg bg-white rounded-xl shadow-2xl',
          'focus:outline-none overflow-hidden',
          !prefersReduced && 'animate-[slideUp_200ms_ease]',
          className
        )}
      >
        {/* Close button — always present for pointer users */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className={cn(
            'absolute top-3 right-3 p-1.5 rounded-lg z-10',
            'text-[#A8A29E] hover:text-[#1C1917] hover:bg-[#F4F1EC]',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]'
          )}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        {children}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

export function ModalHeader({ className, children }: ModalSectionProps) {
  return (
    <div className={cn('px-5 py-4 border-b border-[#E7E5E4] pr-12', className)}>
      {children}
    </div>
  );
}

export function ModalBody({ className, children }: ModalSectionProps) {
  return (
    <div className={cn('px-5 py-4 overflow-y-auto max-h-[65vh]', className)}>
      {children}
    </div>
  );
}

export function ModalFooter({ className, children }: ModalSectionProps) {
  return (
    <div
      className={cn(
        'px-5 py-3 border-t border-[#E7E5E4] bg-[#FAF8F5]',
        'flex items-center justify-end gap-3',
        className
      )}
    >
      {children}
    </div>
  );
}
