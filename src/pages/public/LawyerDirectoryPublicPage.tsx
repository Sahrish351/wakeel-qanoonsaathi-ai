// Phase 3 implementation
import React from 'react';
import { Link } from 'react-router-dom';

const SPECIALISATIONS = [
  'Criminal Law',
  'Family Law',
  'Cyber Crime',
  'Labour Law',
  'Property Law',
  'Consumer Rights',
  'Constitutional Law',
  'Corporate Law',
] as const;

export default function LawyerDirectoryPublicPage() {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <header className="border-b border-[#1C1917]/10 bg-[#FAF8F5] py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading text-xl text-[#1C1917] hover:text-[#7C3AED] transition-colors">
            Wakeel
          </Link>
          <Link to="/register" className="px-5 py-2 rounded-lg bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9] transition-colors">
            Get Started Free
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          {isDev && (
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-mono px-3 py-1 rounded-full mb-4">
              Coming in Phase 3 — Live lawyer profiles, search &amp; filtering
            </span>
          )}
          <h1 className="font-heading text-[#1C1917] mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Find a Verified Lawyer
          </h1>
          <p className="text-[#1C1917]/60 text-lg max-w-2xl">
            Search our network of verified Pakistani lawyers by specialisation, city, and language.
          </p>
        </div>

        {/* Search bar placeholder */}
        <div className="bg-white border border-[#1C1917]/10 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 h-12 rounded-xl bg-[#FAF8F5] border border-[#1C1917]/15 flex items-center px-4 text-[#1C1917]/30 text-sm select-none">
              Search by name or specialisation…
            </div>
            <div className="w-48 h-12 rounded-xl bg-[#FAF8F5] border border-[#1C1917]/15 flex items-center px-4 text-[#1C1917]/30 text-sm select-none">
              City ▾
            </div>
            <div className="h-12 px-6 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center text-[#7C3AED] text-sm font-medium select-none">
              Search (Phase 3)
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SPECIALISATIONS.map((s) => (
              <span
                key={s}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#EDE9FE] text-[#7C3AED] border border-[#7C3AED]/20 select-none"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Skeleton cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#1C1917]/10 p-5 shadow-sm animate-pulse"
              aria-hidden="true"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#1C1917]/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-[#1C1917]/10 rounded w-3/4" />
                  <div className="h-2 bg-[#1C1917]/8 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-[#1C1917]/8 rounded w-full" />
                <div className="h-2 bg-[#1C1917]/8 rounded w-5/6" />
              </div>
              <div className="mt-4 h-8 rounded-lg bg-[#EDE9FE]/60" />
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[#1C1917]/40">
          Lawyer directory launches in Phase 3. Sign up to be notified.{' '}
          <Link to="/register" className="text-[#7C3AED] hover:underline">Register now →</Link>
        </p>
      </main>
    </div>
  );
}
