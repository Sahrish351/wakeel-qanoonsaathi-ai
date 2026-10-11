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
            { heading: 'Our Mission', body: 'Democratise legal knowledge for 220 million Pakistanis through responsible, accurate AI and verified procedure navigation.' },
            { heading: 'Our Methodology', body: 'Grounded in Pakistani statutes, case law, and court procedures — verified by qualified legal professionals and public bar registries.' },
            { heading: 'Safety First', body: 'Wakeel never replaces licensed advocates. We provide structured information and connect you to verified bar council advocates.' },
            { heading: 'Privacy by Design', body: 'End-to-end data segregation with PostgreSQL Row-Level Security, zero data selling, and client-side cryptographic hashing.' },
          ].map(({ heading, body }) => (
            <div key={heading} className="bg-white rounded-2xl border border-[#1C1917]/10 p-6 shadow-sm">
              <h2 className="font-heading text-[#1C1917] text-xl mb-2">{heading}</h2>
              <p className="text-[#1C1917]/60 leading-relaxed text-sm">{body}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#1C1917]/10 p-8 shadow-sm">
          <h2 className="font-heading text-2xl text-[#1C1917] mb-3">Statutory Grounding &amp; Civic Impact</h2>
          <p className="text-sm text-[#1C1917]/70 leading-relaxed mb-4">
            In Pakistan, thousands of citizens face procedural intimidation simply because statutory provisions like Section 160 CrPC (formal written witness summons), Section 498 CrPC (pre-arrest bail), and Section 21 of the Prevention of Electronic Crimes Act 2016 (cyber harassment) are inaccessible in everyday language.
          </p>
          <p className="text-sm text-[#1C1917]/70 leading-relaxed">
            Wakeel bridges this divide through bilingual natural language parsing, automatic evidence hashing (SHA-256), and transparent escalation to licensed human counsel.
          </p>
        </div>
      </main>
    </div>
  );
}
