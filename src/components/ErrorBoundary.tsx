// =============================================================
// WAKEEL — Error Boundary
// Catches React rendering errors and shows a readable fallback.
// =============================================================

import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // In production, send to error tracking (e.g., Sentry)
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'var(--color-danger-muted)' }}>
            <AlertTriangle className="w-8 h-8" style={{ color: 'var(--color-danger)' }} />
          </div>
          <h2 className="font-heading text-h3 mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Something went wrong
          </h2>
          <p className="text-body mb-6 max-w-md" style={{ color: 'var(--color-text-secondary)' }}>
            An unexpected error occurred on this page. Your data has not been affected.
            Please try refreshing or contact support if the problem persists.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-body transition-colors"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-accent-foreground)',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

