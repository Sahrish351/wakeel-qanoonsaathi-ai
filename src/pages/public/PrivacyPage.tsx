// Phase 1 implementation — Legal text placeholder
import React from 'react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  { title: '1. Information We Collect', body: 'We collect information you provide directly (account details, case descriptions) and information generated through your use of the service (AI conversation history, documents you upload). We do not sell your personal data.' },
  { title: '2. How We Use Your Information', body: 'Your information is used solely to provide, improve, and personalise the Wakeel service, including AI responses, case management, and lawyer matching. We do not use your data for advertising.' },
  { title: '3. Data Storage & Security', body: 'All data is stored in encrypted form. Documents in your Evidence Vault are encrypted at rest and in transit. We use industry-standard security practices and conduct regular audits.' },
  { title: '4. Data Retention', body: 'You may delete your account and all associated data at any time. We retain anonymised, aggregated usage data for service improvement.' },
  { title: '5. Sharing with Lawyers', body: 'If you initiate a consultation with a lawyer through Wakeel, only the information you explicitly share in that consultation is visible to the lawyer.' },
  { title: '6. Children\'s Privacy', body: 'Wakeel is not intended for users under 18. We do not knowingly collect data from minors.' },
  { title: '7. Changes to This Policy', body: 'We will notify registered users of material changes to this policy by email and in-app notification at least 30 days before changes take effect.' },
  { title: '8. Contact', body: 'For privacy concerns, contact privacy@wakeel.pk. For data deletion requests, use the Privacy Settings page in your account.' },
] as const;

export default function PrivacyPage() {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <header className="border-b border-[#1C1917]/10 bg-[#FAF8F5] py-6 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-heading text-xl text-[#1C1917] hover:text-[#7C3AED] transition-colors">
            Wakeel
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {isDev && (
          <span className="inline-block bg-amber-100 text-amber-700 text-xs font-mono px-3 py-1 rounded-full mb-6">
            Coming in Phase 1 — Lawyer-reviewed final policy text
          </span>
        )}

        <h1 className="font-heading text-[#1C1917] mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
          Privacy Policy
        </h1>
        <p className="text-[#1C1917]/40 text-sm mb-10">
          Last updated: {new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="bg-[#EDE9FE] rounded-xl p-4 mb-8 border border-[#7C3AED]/20">
          <p className="text-sm text-[#1C1917]/70 leading-relaxed">
            <strong className="text-[#7C3AED]">Summary:</strong> We collect only what we need, encrypt your
            data, never sell it, and give you full control. Read the full policy below.
          </p>
        </div>

        <div className="space-y-8">
          {SECTIONS.map(({ title, body }) => (
            <section key={title} aria-labelledby={`section-${title.replace(/\s/g, '-')}`}>
              <h2
                id={`section-${title.replace(/\s/g, '-')}`}
                className="font-heading text-[#1C1917] text-xl mb-3"
              >
                {title}
              </h2>
              <p className="text-[#1C1917]/65 leading-relaxed">{body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
