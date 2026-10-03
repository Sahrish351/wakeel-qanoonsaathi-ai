// =============================================================
// WAKEEL — Public Layout
// Navbar + children + Footer. No auth required.
// Includes skip-to-content link for accessibility.
// =============================================================

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ─── TYPES ────────────────────────────────────────────────────
interface PublicLayoutProps {
  children?: React.ReactNode;
  /** Hide footer for specific pages (e.g. auth pages) */
  hideFooter?: boolean;
  /** Hide navbar for specific pages */
  hideNavbar?: boolean;
}

// ─── COMPONENT ────────────────────────────────────────────────
export function PublicLayout({
  children,
  hideFooter = false,
  hideNavbar = false,
}: PublicLayoutProps = {}) {
  return (
    <>
      {/* ── Skip to main content (accessibility) ─────────────── */}
      <a
        href="#main-content"
        className={[
          'sr-only focus:not-sr-only',
          'fixed top-2 left-2 z-[999]',
          'px-4 py-2 bg-[#7C3AED] text-white rounded-md',
          'text-sm font-semibold font-["DM_Sans"]',
          'focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#7C3AED]',
        ].join(' ')}
      >
        Skip to main content
      </a>

      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        {/* Navbar */}
        {!hideNavbar && <Navbar />}

        {/* Page content */}
        <main
          id="main-content"
          className={[
            'flex-1 w-full',
            // Push content below sticky navbar (64px desktop, 56px mobile)
            !hideNavbar ? 'pt-14 sm:pt-16' : '',
          ].join(' ')}
          tabIndex={-1}
        >
          {children ?? <Outlet />}
        </main>

        {/* Footer */}
        {!hideFooter && <Footer />}
      </div>
    </>
  );
}
