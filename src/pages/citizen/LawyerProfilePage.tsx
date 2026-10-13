import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  MapPin,
  Calendar,
  Video,
  Phone,
  MessageSquare,
  Award,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { getVerifiedLawyers, getUserCases, createConsultationRequest } from '@/lib/api/database';
import type { Case } from '@/types';

export default function LawyerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lawyer, setLawyer] = useState<any | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Consultation booking modal
  const [showModal, setShowModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [shareBrief, setShareBrief] = useState(true);
  const [shareTimeline, setShareTimeline] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [consultResult, setConsultResult] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [lawyersList, userCases] = await Promise.all([
          getVerifiedLawyers(),
          getUserCases()
        ]);

        setCases(userCases);

        // Find by id or default to first demo lawyer
        const matched = lawyersList.find(l => l.id === id) || lawyersList[0] || {
          id: id || '00000000-0000-0000-0000-000000000101',
          name: 'Barrister Tariq Mansoor [DEMO]',
          province: 'Punjab',
          city: 'Lahore',
          specialization: 'Cybercrime & Criminal Defense',
          experience_years: 12,
          consultation_modes: ['video', 'phone', 'in_person'],
          languages: ['English', 'Urdu', 'Punjabi'],
          bio: '[DEMO PROFILE] High Court Advocate specializing in PECA cybercrime disputes, digital evidence preservation, and human rights advocacy.',
        };

        setLawyer(matched);
        if (userCases.length > 0) {
          setSelectedCaseId(userCases[0].id);
        }
      } catch (err: any) {
        console.error('[LawyerProfilePage] Load error:', err);
        setError('Could not load advocate details.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lawyer) return;

    setSubmitting(true);
    try {
      const res = await createConsultationRequest({
        lawyerId: lawyer.id,
        caseId: selectedCaseId || undefined,
        notes: notes.trim(),
      });
      setConsultResult(res);
      setSuccess(true);
      setShowModal(false);
    } catch (err: any) {
      alert('Consultation request failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-[#57534E] text-sm">
        <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading advocate profile...
      </div>
    );
  }

  if (error || !lawyer) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <p className="text-red-600 text-sm">{error || 'Advocate not found.'}</p>
        <Link to="/lawyers">
          <Button variant="outline" size="sm">Back to Lawyer Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back button */}
      <div>
        <Link
          to="/lawyers"
          className="inline-flex items-center gap-1.5 text-xs text-[#57534E] hover:text-[#1C1917] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Advocates Directory
        </Link>
      </div>

      {/* Demo Warning */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold">Synthetic Demonstration Profile:</span> This advocate record is synthetically generated for testing Wakeel's consultation matchmaking and RLS privacy barriers.
        </div>
      </div>

      {success && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
          consultResult?.is_simulated
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center gap-2">
            {consultResult?.is_simulated ? (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>
              {consultResult?.is_simulated
                ? 'Demo simulation recorded. This was a synthetic demonstration profile — no real advocate was contacted, and no legal consultation was booked.'
                : 'Consultation request submitted! The advocate has been notified under confidential privilege.'}
            </span>
          </div>
          {!consultResult?.is_simulated && (
            <Link to="/consultations">
              <Button variant="primary" size="sm" className="bg-[#059669] text-white text-xs">
                View Consultations
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Main Profile Card */}
      <Card variant="bordered" className="bg-white">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[#E7E5E4]">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold text-xl shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1C1917]">
                    {lawyer.name || 'Advocate High Court [DEMO]'}
                  </h1>
                  {lawyer.is_demo || lawyer.name?.includes('[DEMO]') ? (
                    <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-800 border-amber-300 font-semibold">
                      Simulated Demo Profile
                    </Badge>
                  ) : lawyer.verified ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Bar Member
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1 text-stone-600">
                      Pending Verification
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-[#57534E] flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-[#A8A29E]" /> {lawyer.city}, {lawyer.province} • High Court Bar Council
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E7E5E4] text-xs text-[#1C1917] font-medium">
                    Specialization: {lawyer.specialization}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E7E5E4] text-xs text-[#57534E]">
                    {lawyer.experience_years} Years Experience
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setShowModal(true)}
              className="bg-[#7C3AED] text-white shrink-0"
              leftIcon={<Calendar className="w-4 h-4" />}
            >
              Request Consultation
            </Button>
          </div>

          {/* Bio & Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-heading text-lg font-bold text-[#1C1917] mb-1">About &amp; Practice Focus</h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                {lawyer.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E7E5E4]">
              <div className="space-y-1">
                <span className="text-xs text-[#A8A29E] font-medium uppercase">Consultation Modes</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {lawyer.consultation_modes?.map((mode: string, idx: number) => (
                    <span key={idx} className="capitalize px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800">
                      {mode.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-[#A8A29E] font-medium uppercase">Languages Spoken</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {lawyer.languages?.map((lang: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultation Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-white shadow-xl border border-stone-200">
            <CardHeader className="border-b border-stone-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-stone-900">Request Consultation</h3>
                <p className="text-xs text-stone-500">With {lawyer.name}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              {cases.length > 0 ? (
                <div>
                  <label className="block font-medium text-stone-800 mb-1">Select Associated Case File</label>
                  <select
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 rounded-lg text-stone-600">
                  No existing cases found. A general consultation matter will be created for you automatically.
                </div>
              )}

              <div className="space-y-2 border p-3 rounded-lg bg-[#FAF8F5]">
                <span className="font-semibold text-stone-800 block">Selective Information Sharing</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareBrief}
                    onChange={(e) => setShareBrief(e.target.checked)}
                    className="rounded text-[#7C3AED]"
                  />
                  <span>Share plain-language case brief and legal classification</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareTimeline}
                    onChange={(e) => setShareTimeline(e.target.checked)}
                    className="rounded text-[#7C3AED]"
                  />
                  <span>Share timeline dates and authority contacts</span>
                </label>
              </div>

              <div>
                <Textarea
                  label="Private Message for Advocate"
                  placeholder="Mention your preferred consultation mode (video/phone) and any immediate court notices or questions."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleBookSubmit}
                  disabled={submitting}
                  className="bg-[#7C3AED] text-white"
                >
                  {submitting ? 'Submitting...' : 'Confirm & Request Consultation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
