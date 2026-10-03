// =============================================================
// WAKEEL — AuthGuard
// Protects authenticated routes. Handles loading, unauth, and
// incomplete onboarding states.
// =============================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Scale, Loader2 } from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────
interface AuthGuardProps {
  children: React.ReactNode;
}

// ─── LOADING STATE ────────────────────────────────────────────
function AuthLoadingState() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5]"
      role="status"
      aria-label="Verifying your session…"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#7C3AED] shadow-lg">
          <Scale className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-2">
          <Loader2
            className="w-5 h-5 text-[#7C3AED] animate-spin"
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-[#57534E] font-['DM_Sans']">
            Verifying session…
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────
export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, isAuthenticated, profile } = useAuth();
  const location = useLocation();

  // ── Still resolving auth state ───────────────────────────────
  if (isLoading) {
    return <AuthLoadingState />;
  }

  // ── Not authenticated — redirect to login ───────────────────
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  // ── Onboarding incomplete — must complete profile first ──────
  // profile could be loading still (non-null user but null profile briefly)
  // We only redirect if profile has definitively loaded (not null) and is missing data.
  if (profile !== null && !profile.full_name) {
    return <Navigate to="/onboarding" replace />;
  }

  // ── All checks passed — render protected content ─────────────
  return <>{children}</>;
}
