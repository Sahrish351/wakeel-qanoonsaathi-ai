// =============================================================
// WAKEEL — Main Navigation Bar
// Sticky, glass-morphism on scroll, role-based menu, accessible
// =============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Scale,
  Home,
  Briefcase,
  MessageCircle,
  BookOpen,
  Users,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Shield,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import type { AppLanguage, UserRole } from '@/types';

// ─── TYPES ────────────────────────────────────────────────────
interface NavLink {
  key: string;
  label: string;
  href: string;
  roles?: UserRole[]; // undefined = public
}

// ─── NAV LINKS ────────────────────────────────────────────────
const NAV_LINKS: NavLink[] = [
  { key: 'home',      label: 'nav.home',    href: '/' },
  { key: 'cases',     label: 'nav.cases',   href: '/cases',    roles: ['citizen', 'lawyer', 'admin'] },
  { key: 'ai',        label: 'nav.ai',      href: '/wakeel',   roles: ['citizen', 'lawyer', 'admin'] },
  { key: 'resources', label: 'nav.resources', href: '/resources' },
  { key: 'lawyers',   label: 'nav.lawyers', href: '/lawyers' },
];

const LANGUAGE_OPTIONS: { value: AppLanguage; label: string; native: string }[] = [
  { value: 'en',       label: 'English',     native: 'English' },
  { value: 'ur',       label: 'Urdu',        native: 'اردو' },
  { value: 'roman_ur', label: 'Roman Urdu',  native: 'Roman Urdu' },
];

// ─── COMPONENT ────────────────────────────────────────────────
export function Navbar() {
  const { user, profile, role, isAuthenticated, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const [isScrolled, setIsScrolled]         = useState(false);
  const [profileOpen, setProfileOpen]        = useState(false);
  const [languageOpen, setLanguageOpen]      = useState(false);
  const profileRef  = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // ── Scroll handler for glass effect ─────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Close dropdowns on outside click ────────────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(e.target as Node)) {
        setLanguageOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Close dropdowns on route change ─────────────────────────
  useEffect(() => {
    setProfileOpen(false);
    setLanguageOpen(false);
  }, [location.pathname]);

  // ── Keyboard: close on Escape ────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setProfileOpen(false);
      setLanguageOpen(false);
    }
  }, []);

  // ── Sign out ─────────────────────────────────────────────────
  const handleSignOut = useCallback(async () => {
    setProfileOpen(false);
    await signOut();
  }, [signOut]);

  // ── Filter links by role ─────────────────────────────────────
  const visibleLinks = NAV_LINKS.filter(link => {
    if (!link.roles) return true;
    if (!isAuthenticated) return false;
    return role ? link.roles.includes(role) : false;
  });

  // ── Active link check ────────────────────────────────────────
  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'User';
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const currentLangLabel = LANGUAGE_OPTIONS.find(o => o.value === language)?.native ?? 'EN';

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[#FAF8F5]/90 backdrop-blur-md shadow-sm border-b border-[#E7E5E4]'
          : 'bg-[#FAF8F5]',
      ].join(' ')}
    >
      <nav
        role="navigation"
        aria-label="Main navigation"
        onKeyDown={handleKeyDown}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 rounded-md"
            aria-label="Wakeel — go to homepage"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#7C3AED] shadow-sm group-hover:bg-[#6D28D9] transition-colors">
              <Scale className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <span className="block font-['Cormorant_Garamond'] text-xl font-bold text-[#1C1917] tracking-tight">
                Wakeel
              </span>
              <span className="hidden sm:block text-[10px] font-['DM_Sans'] text-[#57534E] leading-none -mt-0.5">
                {t('app.tagline')}
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ────────────────────────────── */}
          <div className="hidden md:flex items-center gap-1" role="list">
            {visibleLinks.map(link => (
              <div key={link.key} role="listitem">
                <Link
                  to={link.href}
                  className={[
                    'px-3 py-2 rounded-md text-sm font-medium font-["DM_Sans"] transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1',
                    isActive(link.href)
                      ? 'text-[#7C3AED] bg-[#7C3AED]/8 font-semibold'
                      : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#1C1917]/5',
                  ].join(' ')}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {t(link.label)}
                </Link>
              </div>
            ))}
          </div>

          {/* ── Right Controls ───────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Language Selector */}
            <div ref={languageRef} className="relative">
              <button
                type="button"
                aria-label={`Language: ${currentLangLabel}. Click to change`}
                aria-expanded={languageOpen}
                aria-haspopup="listbox"
                onClick={() => setLanguageOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-[#57534E] hover:text-[#1C1917] hover:bg-[#1C1917]/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1"
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline font-['DM_Sans'] text-xs font-medium">
                  {currentLangLabel}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${languageOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {languageOpen && (
                <div
                  role="listbox"
                  aria-label="Select language"
                  className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#E7E5E4] rounded-lg shadow-lg py-1 z-50"
                >
                  {LANGUAGE_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      role="option"
                      aria-selected={language === opt.value}
                      type="button"
                      onClick={() => { setLanguage(opt.value); setLanguageOpen(false); }}
                      className={[
                        'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                        'focus-visible:outline-none focus-visible:bg-[#7C3AED]/8',
                        language === opt.value
                          ? 'bg-[#7C3AED]/8 text-[#7C3AED] font-medium'
                          : 'text-[#57534E] hover:bg-[#FAF8F5] hover:text-[#1C1917]',
                      ].join(' ')}
                    >
                      <span className="font-['DM_Sans']">{opt.label}</span>
                      <span className="ml-auto text-xs text-[#78716C]">{opt.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Center */}
            {isAuthenticated && <NotificationCenter />}

            {/* Auth: Profile menu or Sign In */}
            {isAuthenticated ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  aria-label={`Account menu for ${displayName}`}
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  onClick={() => setProfileOpen(prev => !prev)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#1C1917]/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1"
                >
                  {/* Avatar */}
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={displayName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E7E5E4]"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full bg-[#7C3AED] flex items-center justify-center text-white text-xs font-semibold font-['DM_Sans'] shrink-0"
                      aria-hidden="true"
                    >
                      {avatarInitial}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-[#1C1917] font-['DM_Sans'] max-w-[100px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`hidden sm:block w-3.5 h-3.5 text-[#57534E] transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    aria-label="Account menu"
                    className="absolute right-0 top-full mt-1 w-52 bg-white border border-[#E7E5E4] rounded-lg shadow-lg py-1 z-50"
                  >
                    {/* User info header */}
                    <div className="px-3 py-2 border-b border-[#E7E5E4] mb-1">
                      <p className="text-sm font-semibold text-[#1C1917] font-['DM_Sans'] truncate">{displayName}</p>
                      <p className="text-xs text-[#78716C] truncate">{user?.email}</p>
                      {role && (
                        <span className="inline-flex mt-1 items-center gap-1 px-1.5 py-0.5 bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-medium rounded capitalize font-['DM_Sans']">
                          {role}
                        </span>
                      )}
                    </div>

                    <ProfileMenuItem
                      role="menuitem"
                      to="/profile"
                      icon={<User className="w-4 h-4" />}
                      label="My Profile"
                      onClick={() => setProfileOpen(false)}
                    />
                    <ProfileMenuItem
                      role="menuitem"
                      to="/settings"
                      icon={<Settings className="w-4 h-4" />}
                      label="Settings"
                      onClick={() => setProfileOpen(false)}
                    />
                    {role === 'admin' && (
                      <ProfileMenuItem
                        role="menuitem"
                        to="/admin"
                        icon={<Shield className="w-4 h-4" />}
                        label="Admin Panel"
                        onClick={() => setProfileOpen(false)}
                      />
                    )}

                    <div className="border-t border-[#E7E5E4] mt-1 pt-1">
                      <button
                        role="menuitem"
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-['DM_Sans'] focus-visible:outline-none focus-visible:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" aria-hidden="true" />
                        {t('auth.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium text-[#57534E] hover:text-[#1C1917] font-['DM_Sans'] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-1 rounded-md"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium font-['DM_Sans'] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 shadow-sm"
                >
                  {t('auth.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

// ─── PROFILE MENU ITEM ────────────────────────────────────────
interface ProfileMenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  role?: string;
}

function ProfileMenuItem({ to, icon, label, onClick, role }: ProfileMenuItemProps) {
  return (
    <Link
      to={to}
      role={role}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 text-sm text-[#57534E] hover:bg-[#FAF8F5] hover:text-[#1C1917] transition-colors font-['DM_Sans'] focus-visible:outline-none focus-visible:bg-[#FAF8F5]"
    >
      <span className="text-[#78716C]" aria-hidden="true">{icon}</span>
      {label}
    </Link>
  );
}
