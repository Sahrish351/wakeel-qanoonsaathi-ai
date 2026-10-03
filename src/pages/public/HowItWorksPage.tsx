// Phase 2 implementation
import React from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
  {
    step: 1,
    title: 'Describe Your Situation',
    description:
      'Tell Wakeel what happened in plain language — Urdu or English. No legal jargon needed.',
    icon: '💬',
  },
  {
    step: 2,
    title: 'AI Analyses Your Case',
    description:
      'Wakeel maps your situation to Pakistani law, identifies the relevant statutes, and classifies your legal matter.',
    icon: '🔍',
  },
  {
    step: 3,
    title: 'Get a Step-by-Step Action Plan',
    description:
      'Receive a clear, prioritised action plan — from gathering evidence to filing complaints — with deadlines and templates.',
    icon: '📋',
  },
  {
    step: 4,
    title: 'Organise Evidence & Documents',
    description:
      'Upload and store evidence securely in your encrypted Evidence Vault. Wakeel helps you understand what to collect.',
    icon: '🔒',
  },
  {
    step: 5,
    title: 'Connect with a Verified Lawyer',
    description:
      'When you need formal representation, Wakeel matches you with a verified, rated lawyer in your area.',
    icon: '⚖️',
  },
] as const;

export default function HowItWorksPage() {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="border-b border-[#1C1917]/10 bg-[#FAF8F5] py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading text-xl text-[#1C1917] hover:text-[#7C3AED] transition-colors">
            Wakeel
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-lg bg-[#7C3AED] text-white text-sm font-semibold hover:bg-[#6D28D9] transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Title block */}
        <div className="text-center mb-16">
          {isDev && (
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-mono px-3 py-1 rounded-full mb-4">
              Coming in Phase 2 — Full Animations
            </span>
          )}
          <h1 className="font-heading text-[#1C1917] mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            How Wakeel Works
          </h1>
          <p className="text-[#1C1917]/60 max-w-xl mx-auto text-lg leading-relaxed">
            From confusion to clarity in five straightforward steps.
          </p>
        </div>

        {/* Steps */}
        <ol className="relative space-y-8" aria-label="How Wakeel works — 5 steps">
          {/* Vertical connector line */}
          <div
            aria-hidden="true"
            className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#7C3AED]/40 to-transparent hidden md:block"
          />

          {STEPS.map(({ step, title, description, icon }) => (
            <li
              key={step}
              className="relative flex items-start gap-6 bg-white rounded-2xl border border-[#1C1917]/10 p-6 shadow-sm"
            >
              {/* Step number */}
              <div
                className="flex-shrink-0 w-16 h-16 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-2xl"
                aria-hidden="true"
              >
                {icon}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-[#7C3AED] uppercase tracking-widest">
                    Step {step}
                  </span>
                </div>
                <h2 className="font-heading text-[#1C1917] text-xl mb-2">{title}</h2>
                <p className="text-[#1C1917]/60 leading-relaxed">{description}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#7C3AED] text-white font-semibold hover:bg-[#6D28D9] transition-colors"
          >
            Start Your First Case
          </Link>
          <p className="mt-4 text-sm text-[#1C1917]/40">
            Free forever for basic legal guidance.
          </p>
        </div>
      </main>
    </div>
  );
}
