// =============================================================
// WAKEEL — Admin Layout
// For admin role only. Clean functional sidebar, no gamification.
// RoleGuard: renders permission error if not admin.
// =============================================================

import React, { useState, useCallback } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  UserCheck,
  Users,
  ScrollText,
  Scale,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { RoleGuard } from '@/features/auth/RoleGuard';
import { useAuth } from '@/contexts/AuthContext';

// ─── TYPES ────────────────────────────────────────────────────
interface AdminLayoutProps {
  children?: React.ReactNode;
}

interface AdminNavItem {
  key: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

// ─── ADMIN NAV ITEMS ──────────────────────────────────────────
const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { key: 'dashboard',   label: 'Dashboard',           href: '/admin',                 icon: LayoutDashboard },
  { key: 'sources',     label: 'Sources',             href: '/admin/sources',         icon: Database },
  { key: 'lawyers',     label: 'Lawyer Verification', href: '/admin/lawyer-verify',   icon: UserCheck },
  { key: 'users',       label: 'Users',               href: '/admin/users',           icon: Users },
  { key: 'audit',       label: 'Audit Logs',          href: '/admin/audit-logs',      icon: ScrollText },
];

// ─── SIDEBAR LINK ─────────────────────────────────────────────
interface AdminNavLinkProps {
  item: AdminNavItem;
  isCollapsed: boolean;
  isActive: boolean;
}

function AdminNavLink({ item, isCollapsed, isActive }: AdminNavLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      aria-label={isCollapsed ? item.label : undefined}
      aria-current={isActive ? 'page' : undefined}
      title={isCollapsed ? item.label : undefined}
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group text-sm font-medium font-["DM_Sans"]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-inset',
        isActive
          ? 'bg-[#7C3AED]/10 text-[#7C3AED]'
          : 'text-[#57534E] hover:bg-[#1C1917]/5 hover:text-[#1C1917]',
        isCollapsed ? 'justify-center' : '',
      ].join(' ')}
    >
      <Icon
        className={[
          'w-5 h-5 shrink-0',
          isActive ? 'text-[#7C3AED]' : 'text-[#78716C] group-hover:text-[#1C1917]',
        ].join(' ')}
        aria-hidden
      />
      {!isCollapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

// ─── COMPONENT ────────────────────────────────────────────────
export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const { profile } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);

  const isActive = useCallback(
    (href: string) =>
      href === '/admin'
        ? location.pathname === '/admin'
        : location.pathname.startsWith(href),
    [location.pathname]
  );

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={['admin']}>
        {/* Skip to content */}
        <a
          href="#admin-content"
          className="sr-only focus:not-sr-only fixed top-2 left-2 z-[999] px-4 py-2 bg-[#7C3AED] text-white rounded-md text-sm font-semibold font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>

        <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
          <Navbar />

          <div className="flex flex-1 pt-14 sm:pt-16">

            {/* ── Admin Sidebar ──────────────────────────────── */}
            <aside
              role="navigation"
              aria-label="Admin navigation"
              className={[
                'hidden md:flex flex-col flex-shrink-0',
                'border-r border-[#E7E5E4] bg-white',
                'sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]',
                'overflow-y-auto transition-all duration-200',
                sidebarCollapsed ? 'w-[60px]' : 'w-[220px] lg:w-[240px]',
              ].join(' ')}
            >
              {/* Admin badge */}
              {!sidebarCollapsed && (
                <div className="px-4 py-3 border-b border-[#E7E5E4]">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
                    <span className="text-xs font-semibold font-['DM_Sans'] text-[#7C3AED] uppercase tracking-wider">
                      Admin Panel
                    </span>
                  </div>
                  {profile?.full_name && (
                    <p className="text-xs text-[#78716C] font-['DM_Sans'] mt-1 truncate">
                      {profile.full_name}
                    </p>
                  )}
                </div>
              )}

              <nav className="flex-1 px-2 py-4 space-y-0.5">
                {ADMIN_NAV_ITEMS.map(item => (
                  <AdminNavLink
                    key={item.key}
                    item={item}
                    isCollapsed={sidebarCollapsed}
                    isActive={isActive(item.href)}
                  />
                ))}
              </nav>

              {/* Collapse toggle */}
              <div className="px-2 py-3 border-t border-[#E7E5E4]">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  className={[
                    'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
                    'text-[#78716C] hover:text-[#1C1917] hover:bg-[#1C1917]/5',
                    'transition-colors text-xs font-medium font-["DM_Sans"]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]',
                    sidebarCollapsed ? 'justify-center' : '',
                  ].join(' ')}
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4" aria-hidden />
                  ) : (
                    <>
                      <ChevronLeft className="w-4 h-4" aria-hidden />
                      <span>Collapse</span>
                    </>
                  )}
                </button>
              </div>
            </aside>

            {/* ── Admin Content ─────────────────────────────── */}
            <main
              id="admin-content"
              className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8"
              tabIndex={-1}
            >
              {children ?? <Outlet />}
            </main>
          </div>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
