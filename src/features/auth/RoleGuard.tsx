// =============================================================
// WAKEEL — RoleGuard
// Protects role-restricted routes. Shows a permission error
// if the user's role is not in allowedRoles.
// =============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

// ─── TYPES ────────────────────────────────────────────────────
interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

// ─── PERMISSION DENIED STATE ──────────────────────────────────
function PermissionState({ role }: { role: UserRole | null }) {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center"
      role="main"
      aria-labelledby="permission-heading"
    >
      <div className="max-w-sm">
        {/* Icon */}
        <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 border border-red-100">
          <ShieldOff className="w-8 h-8 text-red-500" aria-hidden="true" />
        </div>

        {/* Heading */}
        <h1
          id="permission-heading"
          className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#1C1917] mb-3"
        >
          Access Restricted
        </h1>

        {/* Description */}
        <p className="text-sm text-[#57534E] font-['DM_Sans'] leading-relaxed mb-2">
          Your account{role ? ` (${role})` : ''} does not have permission to access this section.
        </p>
        <p className="text-xs text-[#78716C] font-['DM_Sans'] leading-relaxed mb-8">
          If you believe this is a mistake, please contact support or sign in with the appropriate account.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium font-['DM_Sans'] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Go to Home
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#E7E5E4] text-[#57534E] hover:text-[#1C1917] hover:border-[#D6D3D1] text-sm font-medium font-['DM_Sans'] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    return <PermissionState role={role} />;
  }

  return <>{children}</>;
}
