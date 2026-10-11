import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  ShieldCheck,
  Scale,
  PhoneCall,
  FileText,
  Filter,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

interface LegalGuide {
  id: string;
  category: string;
  title: string;
  statute: string;
  sections: string;
  summary: string;
  practicalSteps: string[];
  officialUrl: string;
}

const GUIDES: LegalGuide[] = [
  {
    id: 'crpc-160',
    category: 'police_criminal',
    title: 'Police Summons & Witness Attendance Protocol',
    statute: 'Code of Criminal Procedure 1898 (CrPC)',
    sections: 'Section 160 & 161',
    summary: 'Investigating officers requiring the attendance of any person acquainted with the facts of a case are directed to issue a written order. Verbal telephone inquiries require careful verification.',
    practicalSteps: [
      'Politely request the caller’s name, designation, police station, and the FIR / Roznamcha number.',
      'Call the official district police control room (via 15) to verify the officer’s active posting.',
      'Never attend a police station alone or at irregular nighttime hours without informing family or counsel.'
    ],
    officialUrl: 'http://pakistancode.gov.pk'
  },
  {
    id: 'crpc-498',
    category: 'police_criminal',
    title: 'Pre-Arrest Bail (Bail Before Arrest)',
    statute: 'Code of Criminal Procedure 1898 (CrPC)',
    sections: 'Section 498',
    summary: 'Protection against imminent arrest intended for harassment, political victimization, or false implication in non-bailable cognizable offenses.',
    practicalSteps: [
      'Must be moved before the Sessions Court or High Court before physical arrest takes place.',
      'Requires demonstrating mala fide (bad faith/ulterior motive) on the part of the complainant or police.',
      'Accused must physically surrender before the court at the time of hearing.'
    ],
    officialUrl: 'http://pakistancode.gov.pk'
  },
  {
    id: 'peca-21',
    category: 'cybercrime',
    title: 'Non-Consensual Distribution of Intimate Images & Extortion',
    statute: 'Prevention of Electronic Crimes Act 2016 (PECA)',
    sections: 'Section 21 & Section 24',
    summary: 'Criminalizes transmitting, displaying, or threatening to share private photos or videos without consent, punishable by up to 5 years imprisonment and heavy fines.',
    practicalSteps: [
      'Do NOT pay extortion demands or delete WhatsApp/Telegram chat logs.',
      'Capture complete uncropped screenshots with phone numbers, international prefixes, and timestamps visible.',
      'Report directly to National Cyber Crime Investigation Agency (NCCIA) Helpline 1799.'
    ],
    officialUrl: 'https://www.nccia.gov.pk'
  },
  {
    id: 'harassment-workplace',
    category: 'womens_rights',
    title: 'Workplace Sexual Harassment & Ombudsman Relief',
    statute: 'Protection Against Harassment of Women at the Workplace Act 2010',
    sections: 'Sections 4, 8 & 9',
    summary: 'Guarantees a safe working environment. Every workplace is legally mandated to constitute an Inquiry Committee. Victims can petition the Federal or Provincial Ombudsman directly.',
    practicalSteps: [
      'Submit written complaint to workplace Inquiry Committee or Ombudsman within 30 days.',
      'Preserve emails, call records, messages, and witness testimonies.',
      'Workplace Ombudsman has powers of a Civil Court to enforce penalties and protection.'
    ],
    officialUrl: 'https://www.fowh.gov.pk'
  },
  {
    id: 'family-khula',
    category: 'family',
    title: 'Khula, Maintenance (Nafaqah) & Child Custody',
    statute: 'West Pakistan Family Courts Act 1964',
    sections: 'Sections 5 & 9',
    summary: 'Family Courts have exclusive jurisdiction for dissolution of marriage by Khula, recovery of dower, maintenance for wife and children, and custody (Hizanat) applications.',
    practicalSteps: [
      'File suit before the Family Court of the district where the wife normally resides.',
      'Court must conduct mandatory pre-trial reconciliation before decreeing Khula.',
      'Interim maintenance for minor children is ordered expeditiously during trial.'
    ],
    officialUrl: 'http://pakistancode.gov.pk'
  },
  {
    id: 'labor-termination',
    category: 'employment',
    title: 'Wrongful Employment Termination & Gratuity',
    statute: 'Industrial and Commercial Employment (Standing Orders) Ordinance 1968',
    sections: 'Standing Order 12 & 15',
    summary: 'Employers cannot terminate permanent employees without written order explicitly stating reasons. Terminated employees are entitled to one month notice or pay plus statutory gratuity.',
    practicalSteps: [
      'Serve a formal Grievance Notice in writing upon the employer within 3 months.',
      'If unresolved within 15 days, petition the Labour Court under Section 33 of IRO.',
      'Keep copies of appointment letter, payslips, and resignation/termination letters.'
    ],
    officialUrl: 'http://pakistancode.gov.pk'
  }
];

const HELPLINES = [
  { name: 'Police Emergency', number: '15', authority: 'Provincial Police', desc: 'Immediate emergency dispatch and crime response.' },
  { name: 'Rescue Emergency', number: '1122', authority: 'Emergency Rescue Service', desc: 'Medical emergency, fire, and disaster rescue.' },
  { name: 'NCCIA Cyber Harassment', number: '1799', authority: 'Federal Cybercrime Agency', desc: 'PECA reporting, digital extortion, and takedown.' },
  { name: 'Human Rights Helpline', number: '1099', authority: 'Ministry of Human Rights', desc: 'Free legal advice and fundamental rights protection.' },
  { name: 'Punjab Women Protection', number: '1043', authority: 'Women Protection Authority', desc: '24/7 dedicated helpline for women safety.' },
];

export default function ResourcesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredGuides = GUIDES.filter((g) => {
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.statute.toLowerCase().includes(search.toLowerCase()) ||
      g.sections.toLowerCase().includes(search.toLowerCase()) ||
      g.summary.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E4]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold text-[#1C1917]">Legal Resources &amp; Guides</h1>
            <Badge variant="accent">Statutory Knowledgebase</Badge>
          </div>
          <p className="text-sm text-[#57534E] mt-1">
            Plain-language procedural guides, statutory references, and verified Pakistani helplines.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#059669] bg-white px-3 py-1.5 rounded-lg border border-[#E7E5E4]">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>Pakistan Code Grounded</span>
        </div>
      </div>

      {/* Emergency Helplines Carousel / Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#78716C] flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-[#059669]" /> Verified National Helplines
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {HELPLINES.map((h, i) => (
            <div key={i} className="p-3 bg-white rounded-xl border border-[#E7E5E4] shadow-xs space-y-1">
              <span className="text-[10px] text-[#A8A29E] block uppercase font-medium">{h.authority}</span>
              <p className="font-semibold text-xs text-[#1C1917] line-clamp-1">{h.name}</p>
              <p className="font-mono text-base font-bold text-[#059669]">{h.number}</p>
              <p className="text-[10px] text-[#57534E] line-clamp-2">{h.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search statutes (e.g. Section 160 CrPC, PECA 21, Khula, Bail)..."
            className="pl-9 bg-white"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Guides' },
            { id: 'police_criminal', label: 'Police & Criminal' },
            { id: 'cybercrime', label: 'Cybercrime (PECA)' },
            { id: 'womens_rights', label: "Women's Protection" },
            { id: 'family', label: 'Family & Custody' },
            { id: 'employment', label: 'Labor Law' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#7C3AED] text-white font-medium'
                  : 'bg-white border border-[#E7E5E4] text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} variant="bordered" className="bg-white hover:border-[#7C3AED]/40 transition-all flex flex-col justify-between">
            <div>
              <CardHeader className="pb-3 border-b border-[#E7E5E4]/60">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C3AED]">
                      {guide.statute} • {guide.sections}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-[#1C1917] mt-1">
                      {guide.title}
                    </h3>
                  </div>
                  <Scale className="w-5 h-5 text-[#7C3AED] shrink-0" />
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 text-xs">
                <p className="text-[#57534E] leading-relaxed">
                  {guide.summary}
                </p>

                <div className="space-y-1.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E5E4]">
                  <span className="font-semibold text-[#1C1917] block text-[11px]">Procedural Checklist:</span>
                  <ul className="space-y-1.5 text-[#57534E]">
                    {guide.practicalSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </div>

            <div className="p-4 border-t border-[#E7E5E4] flex items-center justify-between text-xs bg-[#FAF8F5]/50">
              <span className="text-[#A8A29E] text-[11px]">Verified Source: Pakistan Code</span>
              <a
                href={guide.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#7C3AED] hover:underline flex items-center gap-1 font-medium"
              >
                Official Gazette <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
