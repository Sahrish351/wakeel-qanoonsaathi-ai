// Phase 1 implementation — Legal text placeholder
import React from 'react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  { title: '1. Acceptance of Terms', body: 'By accessing or using Wakeel — QanoonSaathi AI, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.' },
  { title: '2. Description of Service', body: 'Wakeel provides AI-generated legal information based on Pakistani law. This information is educational in nature and does not constitute legal advice. No lawyer-client relationship is formed by using Wakeel.' },
  { title: '3. Important Legal Disclaimer', body: 'WAKEEL IS NOT A LAW FIRM AND DOES NOT PROVIDE LEGAL ADVICE. The information provided through this service is for general informational and educational purposes only. You should always consult a qualified lawyer for advice specific to your situation. Do not delay seeking legal counsel based on information obtained from Wakeel.' },
  { title: '4. Eligibility', body: 'You must be at least 18 years of age to use Wakeel. By using the service, you represent that you meet this requirement.' },
  { title: '5. User Responsibilities', body: 'You are responsible for maintaining the security of your account, providing accurate information, and using the service in accordance with Pakistani law. Misuse, including attempting to generate content that facilitates illegal activity, is strictly prohibited.' },
  { title: '6. Intellectual Property', body: 'The Wakeel platform, including its AI system, design, and content, is owned by Wakeel Technologies. You retain ownership of the information you provide and documents you upload.' },
  { title: '7. Limitation of Liability', body: 'To the maximum extent permitted by law, Wakeel shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid for the service in the past 12 months.' },
  { title: '8. Termination', body: 'We reserve the right to suspend or terminate accounts that violate these terms. You may close your account at any time through your account settings.' },
  { title: '9. Governing Law', body: 'These terms are governed by the laws of the Islamic Republic of Pakistan. Disputes shall be subject to the jurisdiction of courts in Lahore, Pakistan.' },
  { title: '10. Changes to Terms', body: 'We may update these terms from time to time. We will provide at least 30 days\' notice of material changes. Continued use after that period constitutes acceptance of the updated terms.' },
] as const;

export default function TermsPage() {
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
            Coming in Phase 1 — Lawyer-reviewed final ToS
          </span>
        )}

        <h1 className="font-heading text-[#1C1917] mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
          Terms of Service
        </h1>
        <p className="text-[#1C1917]/40 text-sm mb-10">
          Last updated: {new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {/* Prominent disclaimer box */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-10">
          <div className="flex items-start gap-3">
            <span className="text-xl mt-0.5" aria-hidden="true">⚠️</span>
            <div>
              <h2 className="font-semibold text-red-800 mb-1">Legal Information Disclaimer</h2>
              <p className="text-sm text-red-700 leading-relaxed">
                Wakeel provides <strong>legal information</strong>, not legal advice. Using this service
                does not create a lawyer-client relationship. For legal advice specific to your situation,
                consult a qualified Pakistani lawyer.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {SECTIONS.map(({ title, body }) => (
            <section key={title} aria-labelledby={`section-${title.replace(/[\s.]/g, '-')}`}>
              <h2
                id={`section-${title.replace(/[\s.]/g, '-')}`}
                className="font-heading text-[#1C1917] text-xl mb-3"
              >
                {title}
              </h2>
              <p className="text-[#1C1917]/65 leading-relaxed">{body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#1C1917]/10">
          <p className="text-sm text-[#1C1917]/40">
            Questions about these terms?{' '}
            <a href="mailto:legal@wakeel.pk" className="text-[#7C3AED] hover:underline">
              legal@wakeel.pk
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
