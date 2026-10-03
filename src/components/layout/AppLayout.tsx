// =============================================================
// WAKEEL — App Layout (Authenticated Citizen/Lawyer)
// Desktop side nav (collapsible) + Navbar + MobileNav
// Includes AuthGuard internally — redirects if not authenticated
// =============================================================

import React, { useState, useCallback } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  MessageCircle,
  FileText,
  Camera,
  CheckSquare,
  Users,
  BookOpen,
  Shield,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { SafetyExitButton } from '@/components/shared/SafetyExitButton';
import { AuthGuard } from '@/features/auth/AuthGuard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSafety } from '@/contexts/SafetyContext';
import { useAuth } from '@/contexts/AuthContext';

// ─── TYPES ────────────────────────────────────────────────────
interface AppLayoutProps {
  children?: React.ReactNode;
  /** Optional breadcrumbs to render below the navbar */
  breadcrumbs?: React.ReactNode;
}

interface SideNavItem {
  key: string;
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  badge?: number | string;
}

// ─── SIDE NAV ITEMS ───────────────────────────────────────────
const SIDE_NAV_ITEMS: SideNavItem[] = [
  { key: 'dashboard',  labelKey: 'nav.dashboard', href: '/dashboard',  icon: LayoutDashboard },
  { key: 'cases',      labelKey: 'nav.cases',     href: '/cases',      icon: Briefcase },
  { key: 'ai',         labelKey: 'nav.ai',        href: '/wakeel',     icon: MessageCircle },
  { key: 'documents',  labelKey: 'nav.documents', href: '/documents',  icon: FileText },
  { key: 'evidence',   labelKey: 'nav.evidence',  href: '/evidence',   icon: Camera },
  { key: 'tasks',      labelKey: 'nav.tasks',     href: '/tasks',      icon: CheckSquare },
  { key: 'lawyers',    labelKey: 'nav.lawyers',   href: '/lawyers',    icon: Users },
  { key: 'resources',  labelKey: 'nav.resources', href: '/resources',  icon: BookOpen },
  { key: 'safety',     labelKey: 'nav.safety',    href: '/safety',     icon: Shield },
];

// ─── TRANSLATIONS for sidebar keys not in LanguageContext ─────
const SIDEBAR_LABELS: Record<string, string> = {
  'nav.dashboard': 'Dashboard',
  'nav.documents': 'Documents',
  'nav.evidence':  'Evidence',
  'nav.tasks':     'Tasks',
  'nav.safety':    'Safety',
};

// ─── SIDE NAV LINK ────────────────────────────────────────────
interface SideNavLinkProps {
  item: SideNavItem;
  isCollapsed: boolean;
  isActive: boolean;
  onClick?: () => void;
}

function SideNavLink({ item, isCollapsed, isActive, onClick }: SideNavLinkProps) {
  const { t } = useLanguage();
  const label = SIDEBAR_LABELS[item.labelKey] ?? t(item.labelKey);
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      aria-label={isCollapsed ? label : undefined}
      aria-current={isActive ? 'page' : undefined}
      title={isCollapsed ? label : undefined}
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-inset',
        isActive
          ? 'bg-[#7C3AED]/10 text-[#7C3AED]'
          : 'text-[#57534E] hover:bg-[#1C1917]/5 hover:text-[#1C1917]',
        isCollapsed ? 'justify-center' : '',
      ].join(' ')}
    >
      <Icon
        className={[
          'w-5 h-5 shrink-0 transition-colors',
          isActive ? 'text-[#7C3AED]' : 'text-[#78716C] group-hover:text-[#1C1917]',
        ].join(' ')}
        aria-hidden
      />
      {!isCollapsed && (
        <span className="text-sm font-medium font-['DM_Sans'] truncate">{label}</span>
      )}
      {!isCollapsed && item.badge !== undefined && (
        <span className="ml-auto text-xs bg-[#7C3AED] text-white font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ─── MAIN LAYOUT ──────────────────────────────────────────────
export function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  const location = useLocation();
  const { safetyMode } = useSafety();
  const { profile } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);

  const isActive = useCallback(
    (href: string) =>
      href === '/dashboard'
        ? location.pathname === '/dashboard' || location.pathname === '/'
        : location.pathname.startsWith(href),
    [location.pathname]
  );

  return (
    <AuthGuard>
      {/* Skip to content */}
      <a
        href="#app-content"
        className="sr-only focus:not-sr-only fixed top-2 left-2 z-[999] px-4 py-2 bg-[#7C3AED] text-white rounded-md text-sm font-semibold font-['DM_Sans'] focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        {/* ── Sticky top Navbar ─────────────────────────────── */}
        <Navbar />

        {/* ── Body: sidebar + content ───────────────────────── */}
        <div className="flex flex-1 pt-14 sm:pt-16">

          {/* ── Mobile sidebar overlay ──────────────────────── */}
          {mobileSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-[#1C1917]/40 backdrop-blur-sm md:hidden"
              aria-hidden="true"
              onClick={closeMobileSidebar}
            />
          )}

          {/* ── Desktop sidebar ─────────────────────────────── */}
          <aside
            role="navigation"
            aria-label="Application navigation"
            className={[
              // Desktop: fixed height sidebar
              'hidden md:flex flex-col flex-shrink-0',
              'border-r border-[#E7E5E4] bg-white',
              'transition-all duration-200 ease-in-out',
              // Sticky below navbar
              'sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)]',
              'overflow-y-auto overflow-x-hidden',
              sidebarCollapsed ? 'w-[60px]' : 'w-[220px] lg:w-[240px]',
            ].join(' ')}
          >
            {/* Nav items */}
            <nav className="flex-1 px-2 py-4 space-y-0.5">
              {SIDE_NAV_ITEMS.map(item => (
                <SideNavLink
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
                  'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]',
                  sidebarCollapsed ? 'justify-center' : '',
                ].join(' ')}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" aria-hidden />
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4" aria-hidden />
                    <span className="text-xs font-medium font-['DM_Sans']">Collapse</span>
                  </>
                )}
              </button>
            </div>
          </aside>

          {/* ── Mobile slide-over sidebar ───────────────────── */}
          <aside
            role="navigation"
            aria-label="Application navigation"
            aria-hidden={!mobileSidebarOpen}
            className={[
              'fixed inset-y-0 left-0 z-40 flex flex-col w-[260px]',
              'bg-white border-r border-[#E7E5E4] shadow-xl',
              'md:hidden transition-transform duration-200 ease-in-out',
              'pt-14', // below navbar height
              mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
            ].join(' ')}
          >
            {/* Close button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E7E5E4]">
              <span className="font-['Cormorant_Garamond'] text-lg font-bold text-[#1C1917]">
                Menu
              </span>
              <button
                type="button"
                onClick={closeMobileSidebar}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              >
                <X className="w-5 h-5" aria-hidden />
              </button>
            </div>
            <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
              {SIDE_NAV_ITEMS.map(item => (
                <SideNavLink
                  key={item.key}
                  item={item}
                  isCollapsed={false}
                  isActive={isActive(item.href)}
                  onClick={closeMobileSidebar}
                />
              ))}
            </nav>

            {/* Profile snippet at bottom */}
            {profile && (
              <div className="px-4 py-3 border-t border-[#E7E5E4]">
                <p className="text-xs text-[#78716C] font-['DM_Sans'] truncate">{profile.full_name}</p>
                <p className="text-xs text-[#A8A29E] font-['DM_Sans'] capitalize">{profile.role}</p>
              </div>
            )}
          </aside>

          {/* ── Main content ─────────────────────────────────── */}
          <main
            id="app-content"
            className="flex-1 min-w-0 flex flex-col"
            tabIndex={-1}
          >
            {/* Mobile sidebar toggle button */}
            <div className="md:hidden flex items-center gap-2 px-4 py-2 border-b border-[#E7E5E4] bg-white sticky top-14 z-20">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileSidebarOpen}
                className="p-1.5 rounded-lg text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              >
                <Menu className="w-5 h-5" aria-hidden />
              </button>
            </div>

            {/* Breadcrumbs */}
            {breadcrumbs && (
              <div className="px-4 sm:px-6 lg:px-8 py-3 border-b border-[#E7E5E4] bg-white/80">
                {breadcrumbs}
              </div>
            )}

            {/* Page content */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 sm:pb-8">
              {children ?? <Outlet />}
            </div>
          </main>
        </div>

        {/* ── Mobile bottom nav ─────────────────────────────── */}
        <MobileNav />

        {/* ── Safety exit button ────────────────────────────── */}
        {safetyMode && <SafetyExitButton position="bottom-right" />}
      </div>
    </AuthGuard>
  );
}
