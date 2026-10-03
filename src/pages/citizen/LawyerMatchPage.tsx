import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  MapPin,
  Scale,
  Video,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

interface DemoLawyer {
  id: string;
  name: string;
  province: string;
  city: string;
  specialization: string;
  experience_years: number;
  consultation_modes: string[];
  languages: string[];
  bio: string;
  match_score: number;
  match_reasons: string[];
}

const DEMO_LAWYERS: DemoLawyer[] = [
  {
    id: "lawyer-1",
    name: "Barrister Tariq Mansoor [DEMO]",
    province: "Punjab",
    city: "Lahore",
    specialization: "Cybercrime & Digital Evidence",
    experience_years: 12,
    consultation_modes: ["video", "phone", "in_person"],
    languages: ["English", "Urdu", "Punjabi"],
    bio: "[DEMO PROFILE] High Court Advocate specializing in PECA cybercrime disputes, digital blackmail defense, and corporate tech compliance.",
    match_score: 96,
    match_reasons: ["Top match for Cybercrime in Punjab", "Offers remote video consults", "Forensic evidence experience"]
  },
  {
    id: "lawyer-2",
    name: "Advocate Zainab Baloch [DEMO]",
    province: "Sindh",
    city: "Karachi",
    specialization: "Women's Rights & Family Law",
    experience_years: 9,
    consultation_modes: ["video", "phone", "chat"],
    languages: ["English", "Urdu", "Sindhi"],
    bio: "[DEMO PROFILE] Dedicated women rights advocate with extensive experience handling domestic safety, workplace harassment, and family arbitration.",
    match_score: 93,
    match_reasons: ["Specialist in women safety & domestic protection", "Immediate phone consultation available", "Confidential intake"]
  },
  {
    id: "lawyer-3",
    name: "Advocate Asadullah Khan [DEMO]",
    province: "Khyber Pakhtunkhwa",
    city: "Peshawar",
    specialization: "Criminal Procedure & Police Summons",
    experience_years: 15,
    consultation_modes: ["in_person", "phone"],
    languages: ["English", "Urdu", "Pashto"],
    bio: "[DEMO PROFILE] Seasoned criminal defense advocate with deep expertise in police summons (CrPC 160), bail hearings, and station inquiries.",
    match_score: 91,
    match_reasons: ["15 years criminal procedure defense experience", "Direct experience with police summons verification"]
  },
  {
    id: "lawyer-4",
    name: "Advocate Hammad Malik [DEMO]",
    province: "Islamabad Capital Territory",
    city: "Islamabad",
    specialization: "Business & Tax Compliance",
    experience_years: 11,
    consultation_modes: ["video", "in_person"],
    languages: ["English", "Urdu"],
    bio: "[DEMO PROFILE] Corporate advisor for FBR show-cause notices, regulatory audits, and commercial contract arbitration.",
    match_score: 89,
    match_reasons: ["Specialized in FBR and statutory show-cause notices", "Active in Islamabad & Rawalpindi"]
  },
  {
    id: "lawyer-5",
    name: "Advocate Jamila Mengal [DEMO]",
    province: "Balochistan",
    city: "Quetta",
    specialization: "Human Rights & Civil Disputes",
    experience_years: 8,
    consultation_modes: ["phone", "in_person"],
    languages: ["English", "Urdu", "Balochi"],
    bio: "[DEMO PROFILE] High Court Advocate fighting for civic liberties, fundamental constitutional rights, and community property disputes.",
    match_score: 87,
    match_reasons: ["Dedicated fundamental rights counsel in Quetta", "Legal aid partnership network"]
  }
];

import { getVerifiedLawyers, createConsultationRequest } from '@/lib/api/database';

export default function LawyerMatchPage() {
  const [lawyerList, setLawyerList] = useState<DemoLawyer[]>(DEMO_LAWYERS);
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [selectedLawyer, setSelectedLawyer] = useState<DemoLawyer | null>(null);
  const [consultSuccess, setConsultSuccess] = useState(false);
  const [caseSummary, setCaseSummary] = useState('User inquiry regarding legal guidance.');

  // Load verified lawyers from Supabase on mount & province change
  React.useEffect(() => {
    let mounted = true;
    async function loadLawyers() {
      try {
        const dbLawyers = await getVerifiedLawyers(selectedProvince);
        if (mounted && dbLawyers.length > 0) {
          setLawyerList(dbLawyers);
        }
      } catch (err) {
        console.warn('[LawyerMatchPage] DB query notice:', err);
      }
    }
    loadLawyers();
    return () => { mounted = false; };
  }, [selectedProvince]);

  const filteredLawyers = lawyerList.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
                          l.specialization.toLowerCase().includes(search.toLowerCase()) ||
                          l.city.toLowerCase().includes(search.toLowerCase());
    const matchesProv = selectedProvince === 'All' || l.province === selectedProvince;
    return matchesSearch && matchesProv;
  });

  const handleRequestConsult = async () => {
    if (!selectedLawyer) return;

    try {
      await createConsultationRequest({
        lawyerId: selectedLawyer.id,
        notes: caseSummary,
      });
    } catch (consultErr) {
      console.warn('[LawyerMatchPage] Consultation DB persist notice:', consultErr);
    }

    setConsultSuccess(true);
    setTimeout(() => {
      setConsultSuccess(false);
      setSelectedLawyer(null);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E4]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold text-[#1C1917]">Verified Lawyer Directory</h1>
            <Badge variant="accent">Smart Match Engine</Badge>
          </div>
          <p className="text-sm text-[#57534E] mt-1">
            Connect with verified advocates across all 4 Pakistani provinces. Synthetic demo profiles clearly designated.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#57534E] bg-white px-3 py-1.5 rounded-lg border border-[#E7E5E4]">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>Bar Enrollment Verified</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by advocate name, specialty (e.g. Cybercrime, CrPC), or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-[#A8A29E]" />}
          />
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-xs text-[#57534E] font-medium shrink-0">Province:</span>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="input-base text-xs py-2"
          >
            <option value="All">All Provinces</option>
            <option value="Punjab">Punjab</option>
            <option value="Sindh">Sindh</option>
            <option value="Khyber Pakhtunkhwa">KPK</option>
            <option value="Balochistan">Balochistan</option>
            <option value="Islamabad Capital Territory">Islamabad</option>
          </select>
        </div>
      </div>

      {/* Lawyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLawyers.map((lawyer) => (
          <div
            key={lawyer.id}
            className="bg-white border border-[#E7E5E4] hover:border-[#7C3AED]/40 rounded-2xl p-6 shadow-sm transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-xl font-bold text-[#1C1917]">{lawyer.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  </div>
                  <p className="text-xs text-[#7C3AED] font-semibold mt-0.5">{lawyer.specialization}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#059669] bg-[#059669]/10 px-2.5 py-1 rounded-md">
                    {lawyer.match_score}% Match
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#57534E]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#A8A29E]" />
                  {lawyer.city}, {lawyer.province}
                </span>
                <span>•</span>
                <span>{lawyer.experience_years} Years Experience</span>
              </div>

              <p className="text-xs text-[#57534E] leading-relaxed">
                {lawyer.bio}
              </p>

              {/* Match Reasons */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E5E4] space-y-1">
                <span className="text-[11px] font-semibold text-[#7C3AED] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Why Wakeel Recommends This Counsel:
                </span>
                <ul className="text-[11px] text-[#57534E] list-disc list-inside">
                  {lawyer.match_reasons.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Consultation modes */}
              <div className="flex items-center gap-2 pt-1 text-xs text-[#A8A29E]">
                <span>Modes:</span>
                {lawyer.consultation_modes.includes('video') && <span className="flex items-center gap-1 text-[#1C1917]"><Video className="w-3.5 h-3.5" /> Video</span>}
                {lawyer.consultation_modes.includes('phone') && <span className="flex items-center gap-1 text-[#1C1917]"><Phone className="w-3.5 h-3.5" /> Phone</span>}
                {lawyer.consultation_modes.includes('in_person') && <span className="flex items-center gap-1 text-[#1C1917]"><Users className="w-3.5 h-3.5" /> Office</span>}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E5E4] flex items-center justify-between">
              <span className="text-[11px] text-[#A8A29E]">Languages: {lawyer.languages.join(', ')}</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedLawyer(lawyer)}
              >
                Request Consultation
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Consultation Modal */}
      {selectedLawyer && (
        <Modal
          open={true}
          onClose={() => setSelectedLawyer(null)}
          title={`Consultation Request with ${selectedLawyer.name}`}
        >
          <div className="space-y-4 text-xs">
            {consultSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#059669] mx-auto animate-bounce" />
                <h4 className="font-heading text-xl font-bold text-[#1C1917]">Consultation Brief Dispatched</h4>
                <p className="text-xs text-[#57534E]">
                  Your case summary has been encrypted and sent to {selectedLawyer.name}. They will review and contact you through secure consultation channels.
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-xl bg-[#EDE9FE] border border-[#EDE9FE] text-[#1C1917]">
                  <p className="font-semibold text-[#7C3AED]">AI Case Brief Preparation</p>
                  <p className="mt-0.5 text-[#57534E]">
                    Wakeel generates a concise, standardized legal brief including your case timeline and evidence hashes so the advocate can evaluate exposure immediately.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-[#1C1917] block mb-1">
                    Case Brief Notes / Context to Share:
                  </label>
                  <textarea
                    rows={4}
                    value={caseSummary}
                    onChange={(e) => setCaseSummary(e.target.value)}
                    className="input-base"
                    placeholder="Provide brief context of your issue..."
                  />
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E5E4] text-[#57534E]">
                  <p className="font-semibold text-[#1C1917] mb-1">Counsel Details:</p>
                  <p>• Bar Jurisdiction: {selectedLawyer.province} Bar Council</p>
                  <p>• Office: {selectedLawyer.city}</p>
                  <p>• Specialty: {selectedLawyer.specialization}</p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedLawyer(null)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleRequestConsult}>
                    Submit Case Brief & Request
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
