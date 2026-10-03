// Phase 1 implementation
import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <header className="border-b border-[#1C1917]/10 bg-[#FAF8F5] py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading text-xl text-[#1C1917] hover:text-[#7C3AED] transition-colors">
            Wakeel
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {isDev && (
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-mono px-3 py-1 rounded-full mb-6">
            Coming in Phase 2 — Full mission story, team, and methodology
          </span>
        )}

        <h1 className="font-heading text-[#1C1917] mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
          About Wakeel
        </h1>

        <p className="text-[#1C1917]/60 text-lg leading-relaxed mb-10 max-w-2xl">
          Wakeel — QanoonSaathi AI was built to close the justice gap in Pakistan by giving
          every citizen, regardless of education or income, access to clear legal guidance
          in their own language.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {[
            { heading: 'Our Mission', body: 'Democratise legal knowledge for 220 million Pakistanis through responsible, accurate AI.' },
            { heading: 'Our Methodology', body: 'Grounded in Pakistani statutes, case law, and court procedures — verified by qualified legal professionals.' },
            { heading: 'Safety First', body: 'Wakeel never provides legal advice. We provide information and connect you to verified lawyers.' },
            { heading: 'Privacy by Design', body: 'End-to-end encryption, zero data selling, and full user control over all stored information.' },
          ].map(({ heading, body }) => (
            <div key={heading} className="bg-white rounded-2xl border border-[#1C1917]/10 p-6 shadow-sm">
              <h2 className="font-heading text-[#1C1917] text-xl mb-2">{heading}</h2>
              <p className="text-[#1C1917]/60 leading-relaxed text-sm">{body}</p>
            </div>
          ))}
        </div>

        <div className="border-2 border-dashed border-[#7C3AED]/30 rounded-2xl p-10 text-center">
          <p className="text-[#1C1917]/30 font-heading text-xl">[Section: Team &amp; Partners — Phase 2]</p>
        </div>
      </main>
    </div>
  );
}
