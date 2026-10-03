/**
 * Toast.tsx
 *
 * Re-exports the public Toast API from ToastProvider so consumers can
 * import everything from a single path:
 *
 *   import { useToast } from '@/components/ui/Toast';
 *   import { ToastProvider } from '@/components/ui/Toast';
 */
export { ToastProvider, useToast } from './ToastProvider';
export type { Toast, ToastType, ToastProviderProps } from './ToastProvider';
