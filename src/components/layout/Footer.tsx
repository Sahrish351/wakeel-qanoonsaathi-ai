// =============================================================
// WAKEEL — Footer
// Warm background, 4-column desktop / 1-column mobile
// No fake social proof, genuine disclaimer
// =============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// ─── LINK COLUMNS ─────────────────────────────────────────────
interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'How it Works',   href: '/how-it-works' },
      { label: 'Features',       href: '/features' },
      { label: 'Safety Center',  href: '/safety' },
      { label: 'Find a Lawyer',  href: '/lawyers' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use',   href: '/terms' },
      { label: 'Disclaimer',     href: '/disclaimer' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'About Wakeel',   href: '/about' },
      { label: 'Contact Us',     href: '/contact' },
      { label: 'Resources',      href: '/resources' },
      { label: 'Pakistan Citizen Portal', href: 'https://citizenportal.gov.pk', external: true },
    ],
  },
];

// ─── COMPONENT ────────────────────────────────────────────────
export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-[#F5F3EF] border-t border-[#E7E5E4]"
      aria-label="Site footer"
    >
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* ── Brand column ──────────────────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 rounded-md"
              aria-label="Wakeel — go to homepage"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#7C3AED] shadow-sm group-hover:bg-[#6D28D9] transition-colors">
                <Scale className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#1C1917] tracking-tight">
                Wakeel
              </span>
            </Link>

            <p className="mt-3 text-sm text-[#57534E] font-['DM_Sans'] leading-relaxed max-w-[220px]">
              {t('app.tagline')} — QanoonSaathi AI for every Pakistani.
            </p>

            {/* Emergency contacts */}
            <div className="mt-5 space-y-1.5">
              <p className="text-xs font-semibold text-[#78716C] font-['DM_Sans'] uppercase tracking-wide">
                Emergency Helplines
              </p>
              <p className="text-xs text-[#57534E] font-['DM_Sans']">
                <span className="font-semibold text-[#1C1917]">15</span> — Police
              </p>
              <p className="text-xs text-[#57534E] font-['DM_Sans']">
                <span className="font-semibold text-[#1C1917]">1122</span> — Rescue
              </p>
              <p className="text-xs text-[#57534E] font-['DM_Sans']">
                <span className="font-semibold text-[#1C1917]">1099</span> — Human Rights
              </p>
            </div>
          </div>

          {/* ── Link columns ──────────────────────────────── */}
          {FOOTER_COLUMNS.map(column => (
            <div key={column.heading}>
              <h3 className="text-xs font-semibold text-[#78716C] font-['DM_Sans'] uppercase tracking-wide mb-4">
                {column.heading}
              </h3>
              <ul className="space-y-2.5" role="list">
                {column.links.map(link => (
                  <li key={link.href} role="listitem">
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-[#57534E] hover:text-[#7C3AED] font-['DM_Sans'] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED] rounded"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 shrink-0" aria-label="(opens in new tab)" />
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-[#57534E] hover:text-[#7C3AED] font-['DM_Sans'] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7C3AED] rounded"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[#78716C] font-['DM_Sans']">
            © {currentYear} Wakeel — QanoonSaathi AI. All rights reserved.
          </p>
          <p className="text-xs text-[#78716C] font-['DM_Sans'] sm:text-right max-w-xs sm:max-w-sm leading-relaxed">
            Wakeel is <strong className="text-[#57534E]">not a law firm</strong>. This is legal information, not legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
