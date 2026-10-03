// Phase 1 implementation — Hero + section scaffolding
import React from 'react';
import { Link } from 'react-router-dom';

const SECTION_LABELS = [
  'Problem Statement',
  'How It Works',
  'Key Features',
  'AI Capabilities',
  'Evidence Vault',
  'Lawyer Matching',
  'Safety & Privacy',
  'Testimonials',
  'Legal Domains Covered',
  'Pricing / Free Tier',
  'FAQs',
  'Partners & Certifications',
  'Blog / Resources Preview',
  'Final CTA',
] as const;

function SectionPlaceholder({ label }: { label: string }) {
  const isDev = import.meta.env.DEV;
  return (
    <section
      aria-label={label}
      className="border-2 border-dashed border-[#7C3AED]/30 rounded-2xl p-10 text-center bg-white/50"
    >
      {isDev && (
        <p className="text-xs font-mono text-[#7C3AED]/60 uppercase tracking-widest mb-2 select-none">
          [Section: {label}]
        </p>
      )}
      <div className="h-24 flex items-center justify-center">
        <span className="text-[#1C1917]/30 font-heading text-2xl">{label}</span>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FAF8F5 0%, #EDE9FE 60%, #DDD6FE 100%)',
        }}
      >
        {/* Decorative background blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 md:py-40 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-[#7C3AED]/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
            <span className="text-xs font-medium text-[#7C3AED] tracking-wide uppercase">
              AI-Powered Legal Guidance for Pakistan
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="font-heading text-[#1C1917] leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}
          >
            When you don't know your rights,
            <br />
            <span className="text-[#7C3AED]">know your next step.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-[#1C1917]/70 max-w-2xl mx-auto mb-10"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: 1.7 }}
          >
            Wakeel — QanoonSaathi AI gives every Pakistani citizen instant access to
            clear, step-by-step legal guidance in Urdu and English — completely free.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#7C3AED] text-white font-semibold text-base shadow-lg hover:bg-[#6D28D9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
              aria-label="Talk to Wakeel AI — get started"
            >
              Talk to Wakeel
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-[#1C1917]/20 bg-white/60 backdrop-blur-sm text-[#1C1917] font-semibold text-base hover:bg-white hover:border-[#7C3AED]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
              aria-label="Learn how Wakeel works"
            >
              How it works
            </Link>
          </div>

          {/* Sign-in link */}
          <p className="mt-6 text-sm text-[#1C1917]/50">
            Already have an account?{' '}
            <Link to="/login" className="text-[#7C3AED] hover:underline font-medium">
              Sign in
            </Link>
          </p>

          {/* Legal disclaimer */}
          <p className="mt-10 text-xs text-[#1C1917]/40 max-w-md mx-auto leading-relaxed">
            Wakeel provides legal information — not legal advice. For formal legal
            representation, connect with a verified lawyer through our platform.
          </p>
        </div>
      </section>

      {/* ── Section Placeholders ──────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-8" aria-label="Page sections">
        {SECTION_LABELS.map((label) => (
          <SectionPlaceholder key={label} label={label} />
        ))}
      </main>

      {/* ── Footer strip ─────────────────────────────────────────── */}
      <footer className="border-t border-[#1C1917]/10 bg-[#FAF8F5] py-8 text-center">
        <p className="text-xs text-[#1C1917]/40">
          © {new Date().getFullYear()} Wakeel — QanoonSaathi AI. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-6 mt-3">
          <Link to="/privacy" className="text-xs text-[#1C1917]/50 hover:text-[#7C3AED] transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-xs text-[#1C1917]/50 hover:text-[#7C3AED] transition-colors">
            Terms of Service
          </Link>
          <Link to="/safety" className="text-xs text-[#1C1917]/50 hover:text-[#7C3AED] transition-colors">
            Safety Center
          </Link>
        </div>
      </footer>
    </div>
  );
}
