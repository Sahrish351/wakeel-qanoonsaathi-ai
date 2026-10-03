// =============================================================
// WAKEEL — OnboardingGuard
// If profile is complete (has full_name + province): render children.
// Otherwise redirect to /onboarding.
// =============================================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Scale, Loader2 } from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────
interface OnboardingGuardProps {
  children: React.ReactNode;
}

// ─── COMPONENT ────────────────────────────────────────────────
export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { isLoading, profile } = useAuth();

  // ── Still loading auth/profile ───────────────────────────────
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5]"
        role="status"
        aria-label="Loading your profile…"
      >
        <div className="flex items-center gap-3">
          <Scale className="w-5 h-5 text-[#7C3AED]" aria-hidden="true" />
          <Loader2 className="w-5 h-5 text-[#7C3AED] animate-spin" aria-hidden="true" />
          <span className="text-sm font-medium text-[#57534E] font-['DM_Sans']">
            Loading profile…
          </span>
        </div>
      </div>
    );
  }

  // ── Profile is incomplete — redirect to onboarding ──────────
  const isProfileComplete = profile !== null && !!profile.full_name && !!profile.province;

  if (!isProfileComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  // ── Profile complete — render protected content ───────────────
  return <>{children}</>;
}
