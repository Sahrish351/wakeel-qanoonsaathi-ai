// Phase 2 implementation
import React from 'react';
import { Link } from 'react-router-dom';

const RESOURCE_CATEGORIES = [
  {
    title: 'Emergency Contacts',
    icon: '🚨',
    items: ['Rescue 1122', 'Police 15', 'Edhi Foundation 115', 'Umang Helpline 0317-4288665'],
  },
  {
    title: 'Legal Aid Organisations',
    icon: '⚖️',
    items: ['Legal Aid Society Karachi', 'Foundation for Fundamental Rights', 'AGHS Legal Aid Cell', 'Rozan Counseling Center'],
  },
  {
    title: 'Women & Children Safety',
    icon: '🛡️',
    items: ['Panah Shelter Home', 'Darul Aman', 'FIA Cyber Crime Wing', 'NCHR Pakistan'],
  },
  {
    title: 'Domestic Violence Support',
    icon: '💙',
    items: ['Edhi Women Shelter', 'Shirkat Gah', 'Aurat Foundation', 'War Against Rape (WAR)'],
  },
] as const;

export default function SafetyCenterPage() {
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
        <div className="mb-12">
          {isDev && (
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-mono px-3 py-1 rounded-full mb-4">
              Coming in Phase 2 — Verified resource links & helpline status
            </span>
          )}
          <h1 className="font-heading text-[#1C1917] mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Safety Center
          </h1>
          <p className="text-[#1C1917]/60 text-lg leading-relaxed max-w-2xl">
            If you are in immediate danger, call <strong>15</strong> (Police) or <strong>1122</strong> (Rescue).
            Below are trusted organisations that can provide support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {RESOURCE_CATEGORIES.map(({ title, icon, items }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-[#1C1917]/10 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl" aria-hidden="true">{icon}</span>
                <h2 className="font-heading text-[#1C1917] text-lg">{title}</h2>
              </div>
              <ul className="space-y-2" aria-label={`${title} resources`}>
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[#1C1917]/70 text-sm">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#7C3AED] flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-[#EDE9FE] rounded-2xl p-6 border border-[#7C3AED]/20">
          <p className="text-sm text-[#1C1917]/70 leading-relaxed">
            <strong className="text-[#7C3AED]">Disclaimer:</strong> Wakeel does not directly provide emergency
            services. If you or someone you know is in danger, please contact emergency services immediately.
            Resource listings are for informational purposes and may change.
          </p>
        </div>
      </main>
    </div>
  );
}
