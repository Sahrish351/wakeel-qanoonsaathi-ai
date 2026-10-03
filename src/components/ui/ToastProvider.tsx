import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useReducer,
  useRef,
} from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastState {
  toasts: Toast[];
}

type ToastAction =
  | { type: 'ADD'; toast: Toast }
  | { type: 'REMOVE'; id: string };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

const MAX_VISIBLE = 3;

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD':
      return {
        toasts: [action.toast, ...state.toasts].slice(0, MAX_VISIBLE),
      };
    case 'REMOVE':
      return { toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface ToastContextValue {
  toast: (opts: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ---------------------------------------------------------------------------
// Icon + style map
// ---------------------------------------------------------------------------

const toastConfig: Record<
  ToastType,
  {
    icon: React.ElementType;
    classes: string;
    iconClass: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    classes: 'border-[#A7F3D0] bg-[#ECFDF5]',
    iconClass: 'text-[#059669]',
  },
  error: {
    icon: AlertCircle,
    classes: 'border-[#FECACA] bg-[#FEF2F2]',
    iconClass: 'text-[#DC2626]',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'border-[#FDE68A] bg-[#FFFBEB]',
    iconClass: 'text-[#D97706]',
  },
  info: {
    icon: Info,
    classes: 'border-[#DDD6FE] bg-[#EDE9FE]',
    iconClass: 'text-[#7C3AED]',
  },
};

// ---------------------------------------------------------------------------
// Single Toast item
// ---------------------------------------------------------------------------

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
  reduced: boolean;
}

function ToastItem({ toast, onDismiss, reduced }: ToastItemProps) {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        'flex items-start gap-3 w-80 max-w-full',
        'rounded-xl border p-4 shadow-lg',
        'transition-all duration-300',
        !reduced && 'animate-[toastIn_250ms_ease]',
        config.classes
      )}
    >
      <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', config.iconClass)} aria-hidden="true" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1C1917] leading-snug">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-[#57534E] leading-snug">{toast.description}</p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className={cn(
          'shrink-0 p-0.5 rounded-md',
          'text-[#A8A29E] hover:text-[#1C1917]',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]'
        )}
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });
  const reduced = useReducedMotion();
  // Use a ref-based counter so we can generate unique IDs without React state
  const counter = useRef(0);

  const toast = useCallback((opts: Omit<Toast, 'id'>) => {
    counter.current += 1;
    const id = `toast-${counter.current}`;
    dispatch({ type: 'ADD', toast: { id, ...opts } });

    // Auto-dismiss after 5 s
    setTimeout(() => {
      dispatch({ type: 'REMOVE', id });
    }, 5_000);
  }, []);

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      {/* Portal target — bottom-right */}
      <div
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end"
      >
        {state.toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} reduced={reduced} />
        ))}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access the toast system anywhere inside <ToastProvider>.
 *
 * @example
 * const { toast } = useToast();
 * toast({ type: 'success', title: 'Saved!', description: 'Your case has been saved.' });
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}
