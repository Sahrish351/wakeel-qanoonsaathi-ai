// =============================================================
// WAKEEL — Mobile Bottom Navigation
// 5-tab bottom bar, iOS safe-area aware, accessible
// =============================================================

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Briefcase, MessageCircle, BookOpen, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

// ─── TYPES ────────────────────────────────────────────────────
interface MobileTab {
  key: string;
  labelKey: string;
  href: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  isAccent?: boolean; // centre CTA tab
  requiresAuth?: boolean;
}

// ─── TABS ─────────────────────────────────────────────────────
const TABS: MobileTab[] = [
  { key: 'home',      labelKey: 'nav.home',      href: '/',         icon: Home },
  { key: 'cases',     labelKey: 'nav.cases',     href: '/cases',    icon: Briefcase, requiresAuth: true },
  { key: 'ai',        labelKey: 'nav.ai',        href: '/wakeel',   icon: MessageCircle, isAccent: true },
  { key: 'resources', labelKey: 'nav.resources', href: '/resources', icon: BookOpen },
  { key: 'profile',   labelKey: 'nav.profile',   href: '/profile',  icon: User, requiresAuth: true },
];

// ─── COMPONENT ────────────────────────────────────────────────
export function MobileNav() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <nav
      role="navigation"
      aria-label="Mobile navigation"
      className={[
        // Only visible on mobile
        'sm:hidden fixed bottom-0 left-0 right-0 z-40',
        'bg-white/95 backdrop-blur-sm border-t border-[#E7E5E4]',
        // iOS safe-area inset
        'pb-[env(safe-area-inset-bottom)]',
      ].join(' ')}
    >
      <div className="flex items-stretch" role="list">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          // For auth-required tabs, still show but indicate they link to login if not authenticated
          const href = tab.requiresAuth && !isAuthenticated ? `/login?redirect=${tab.href}` : tab.href;

          if (tab.isAccent) {
            return (
              <div key={tab.key} role="listitem" className="flex-1 flex items-center justify-center -mt-4">
                <NavLink
                  to={href}
                  aria-label={t(tab.labelKey)}
                  aria-current={active ? 'page' : undefined}
                  className={({ isActive: navActive }) => [
                    'flex flex-col items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2',
                    navActive
                      ? 'bg-[#6D28D9] shadow-[#7C3AED]/30'
                      : 'bg-[#7C3AED] hover:bg-[#6D28D9]',
                  ].join(' ')}
                >
                  <Icon className="w-6 h-6 text-white" aria-hidden />
                  <span className="sr-only">{t(tab.labelKey)}</span>
                </NavLink>
              </div>
            );
          }

          return (
            <div key={tab.key} role="listitem" className="flex-1">
              <NavLink
                to={href}
                aria-label={t(tab.labelKey)}
                aria-current={active ? 'page' : undefined}
                className="flex flex-col items-center justify-center gap-0.5 py-2.5 px-1 w-full h-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-inset group"
              >
                {({ isActive: navActive }) => (
                  <>
                    <span
                      className={[
                        'flex items-center justify-center w-6 h-6 transition-transform',
                        'group-active:scale-90',
                      ].join(' ')}
                    >
                      <Icon
                        className={[
                          'w-5 h-5 transition-colors',
                          navActive ? 'text-[#7C3AED]' : 'text-[#78716C] group-hover:text-[#57534E]',
                        ].join(' ')}
                        aria-hidden
                      />
                    </span>
                    <span
                      className={[
                        'text-[10px] font-medium leading-none font-["DM_Sans"] truncate max-w-full px-1',
                        navActive ? 'text-[#7C3AED]' : 'text-[#78716C] group-hover:text-[#57534E]',
                      ].join(' ')}
                    >
                      {t(tab.labelKey)}
                    </span>
                    {/* Active indicator dot */}
                    <span
                      className={[
                        'w-1 h-1 rounded-full transition-all',
                        navActive ? 'bg-[#7C3AED]' : 'bg-transparent',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                  </>
                )}
              </NavLink>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
