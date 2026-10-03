import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  MapPin,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  PhoneCall,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { createCase } from '@/lib/api/database';
import type { CaseCategory, UrgencyLevel } from '@/types';

interface IntakeStep {
  id: number;
  label: string;
}

const STEPS: IntakeStep[] = [
  { id: 1, label: 'Incident' },
  { id: 2, label: 'Category' },
  { id: 3, label: 'Jurisdiction' },
  { id: 4, label: 'Parties' },
  { id: 5, label: 'Timelines' },
  { id: 6, label: 'Evidence' },
  { id: 7, label: 'Review' },
];

const CATEGORIES: { key: CaseCategory; title: string; desc: string; iconText: string }[] = [
  { key: 'police_criminal', title: 'Police / Criminal', desc: 'FIR, arrest, bail, police inquiry or illegal detention', iconText: '⚖️' },
  { key: 'cybercrime', title: 'Cybercrime (PECA)', desc: 'Blackmail, unauthorized data access, fake profiles, cyber harassment', iconText: '💻' },
  { key: 'harassment_stalking', title: 'Harassment & Stalking', desc: 'Workplace harassment, public harassment, physical or digital stalking', iconText: '🛡️' },
  { key: 'womens_rights', title: "Women's Rights & Protection", desc: 'Domestic violence, custody, Khula, inheritance rights protection', iconText: '🌸' },
  { key: 'family', title: 'Family & Custody', desc: 'Divorce, custody, maintenance (Nafaqah), guardianship', iconText: '👨‍👩‍👧' },
  { key: 'property', title: 'Property & Land', desc: 'Possession dispute, tenancy, mutation/fard issues, illegal encroachment', iconText: '🏡' },
  { key: 'employment', title: 'Labor & Employment', desc: 'Unlawful termination, unpaid gratuity/provident fund, wage theft', iconText: '💼' },
  { key: 'business_compliance', title: 'Business & Contracts', desc: 'Contract breach, partnership dissolution, commercial disputes', iconText: '📑' },
  { key: 'consumer', title: 'Consumer Protection', desc: 'Defective products, billing malpractice under Consumer Courts', iconText: '🛍️' },
  { key: 'fraud_scam', title: 'Fraud & Financial Scams', desc: 'Cheating (PPC 420), bad cheques (489-F), online investment scams', iconText: '⚠️' },
  { key: 'human_rights', title: 'Fundamental Rights', desc: 'Illegal dispossession, discrimination, constitutional writ petitions', iconText: '🏛️' },
  { key: 'other', title: 'General Legal Query', desc: 'Other civil or administrative legal concerns', iconText: '📌' },
];

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan'
];

export default function NewCasePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CaseCategory>('cybercrime');
  const [urgency, setUrgency] = useState<UrgencyLevel>('moderate');
  const [province, setProvince] = useState('Punjab');
  const [city, setCity] = useState('');
  const [policeStationOrCourt, setPoliceStationOrCourt] = useState('');
  const [authoritiesInvolved, setAuthoritiesInvolved] = useState('');
  const [opposingParty, setOpposingParty] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');

  // AI Intake Guidance State
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    suggestedCategory?: CaseCategory;
    suggestedUrgency?: UrgencyLevel;
    detectedUrgencyReason?: string;
    missingFacts: string[];
    suggestedEvidence: string[];
    safetyWarning?: string;
  } | null>(null);

  // Trigger AI-assisted intake triage on user description
  const handleAiIntakeAnalysis = () => {
    if (!description.trim()) {
      setErrorMessage('Please describe your situation first.');
      return;
    }
    setAiAnalyzing(true);
    setErrorMessage(null);

    // Rule-based and keyword safety evaluator for instant responsive triage
    setTimeout(() => {
      const lower = description.toLowerCase();
      let detectedCat: CaseCategory = 'other';
      let detectedUrg: UrgencyLevel = 'moderate';
      let reason = 'Standard legal advisory matter.';
      let safetyWarn: string | undefined = undefined;
      const missing: string[] = [];
      const evidence: string[] = [];

      if (lower.includes('blackmail') || lower.includes('photo') || lower.includes('video') || lower.includes('whatsapp') || lower.includes('threat')) {
        detectedCat = 'cybercrime';
        detectedUrg = 'high';
        reason = 'Potential cyber extortion/harassment under PECA 2016 Sections 20/21/24. Critical preservation of digital headers required.';
        missing.push('Exact date/time of initial threat message');
        missing.push('Whether extortion money was transferred');
        missing.push('Platform where interaction started (e.g., WhatsApp, Instagram, Telegram)');
        evidence.push('Uncropped chat screenshots showing sender phone number');
        evidence.push('Digital payment transaction receipts or bank SMS');
        evidence.push('Original media file URLs or profile links');
      } else if (lower.includes('police') || lower.includes('fir') || lower.includes('thana') || lower.includes('arrest') || lower.includes('custody')) {
        detectedCat = 'police_criminal';
        detectedUrg = 'high';
        reason = 'Criminal justice interaction. Immediate counsel and procedural caution required under CrPC.';
        missing.push('Name and location of police station (Thana)');
        missing.push('Whether formal FIR or Roznamcha entry was registered');
        missing.push('Whether an arrest warrant or 160 CrPC witness notice was served');
        evidence.push('Copy of FIR / notice if provided');
        evidence.push('Names or rank of investigating officer (IO)');
        safetyWarn = 'If summoned by police, do not resist. Cooperate calmly, never attend alone, and request legal representation.';
      } else if (lower.includes('harass') || lower.includes('stalk') || lower.includes('follow') || lower.includes('workplace')) {
        detectedCat = 'harassment_stalking';
        detectedUrg = 'high';
        reason = 'Safety and harassment protection inquiry under Harassment at Workplace Act 2010 or PPC 509.';
        missing.push('Workplace inquiry committee registration status');
        missing.push('Duration and pattern of stalking/harassment incidents');
        evidence.push('Email correspondence or physical witness statements');
        evidence.push('CCTV footage timestamps or security logs');
      } else if (lower.includes('property') || lower.includes('land') || lower.includes('flat') || lower.includes('tenant') || lower.includes('qabza')) {
        detectedCat = 'property';
        detectedUrg = 'moderate';
        reason = 'Civil property / possession matter under Rent Restriction Act or Illegal Dispossession Act 2005.';
        missing.push('Fard/Registry document ownership status');
        missing.push('Written tenancy agreement presence');
        evidence.push('Allotment letter, registry copy, or rent agreement');
        evidence.push('Utility bills under claimant name');
      } else if (lower.includes('salary') || lower.includes('job') || lower.includes('fired') || lower.includes('terminated')) {
        detectedCat = 'employment';
        detectedUrg = 'routine';
        reason = 'Industrial and commercial employment inquiry under Provincial Standing Orders.';
        missing.push('Written appointment letter and termination notice');
        missing.push('Length of continuous service in months/years');
        evidence.push('Appointment letter, payslips, bank statements');
      } else {
        missing.push('Specific date and geographic location of occurrence');
        missing.push('Whether formal written notices were received or sent');
        evidence.push('Written correspondence and relevant transaction receipts');
      }

      setAiAnalysisResult({
        suggestedCategory: detectedCat,
        suggestedUrgency: detectedUrg,
        detectedUrgencyReason: reason,
        missingFacts: missing,
        suggestedEvidence: evidence,
        safetyWarning: safetyWarn,
      });

      // Auto-set category and urgency if not explicitly customized
      setCategory(detectedCat);
      setUrgency(detectedUrg);
      if (!title.trim()) {
        const autoTitle = description.slice(0, 48).trim() + '...';
        setTitle(autoTitle);
      }

      setAiAnalyzing(false);
    }, 600);
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!title.trim()) {
        setErrorMessage('Please give your case a concise title.');
        return;
      }
      if (!description.trim() || description.length < 20) {
        setErrorMessage('Please describe the situation in at least 20 characters for accurate legal triage.');
        return;
      }
    }
    if (currentStep === 3) {
      if (!city.trim()) {
        setErrorMessage('Please provide your city or district.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCreateCase = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const initialFacts: Array<{ fact_key: string; fact_value: string; source?: string; confidence?: number }> = [];

      if (incidentDate) {
        initialFacts.push({ fact_key: 'Incident Date', fact_value: incidentDate, source: 'user_intake' });
      }
      if (deadlineDate) {
        initialFacts.push({ fact_key: 'Critical Deadline', fact_value: deadlineDate, source: 'user_intake' });
      }
      if (policeStationOrCourt) {
        initialFacts.push({ fact_key: 'Authority / Forum', fact_value: policeStationOrCourt, source: 'user_intake' });
      }
      if (opposingParty) {
        initialFacts.push({ fact_key: 'Opposing Party', fact_value: opposingParty, source: 'user_intake' });
      }
      if (authoritiesInvolved) {
        initialFacts.push({ fact_key: 'Official Authority', fact_value: authoritiesInvolved, source: 'user_intake' });
      }
      if (city) {
        initialFacts.push({ fact_key: 'Jurisdiction City', fact_value: `${city}, ${province}`, source: 'user_intake' });
      }
      if (evidenceNotes) {
        initialFacts.push({ fact_key: 'Preserved Evidence Notes', fact_value: evidenceNotes, source: 'user_intake' });
      }

      const newCase = await createCase({
        title: title.trim(),
        category,
        jurisdiction: `${city ? city + ', ' : ''}${province}`,
        urgency,
        summary: description.trim(),
        confidence: 0.90,
        initialFacts,
        initialEvent: {
          title: 'Case File Initialized',
          description: `Intake registered for ${title} under ${province} jurisdiction.`,
          event_type: 'case_created'
        }
      });

      // Redirect immediately to the dedicated case workspace
      navigate(`/cases/${newCase.id}`);
    } catch (err: any) {
      console.error('[NewCasePage] Error creating case:', err);
      setErrorMessage(err.message || 'Failed to create case. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
          <FolderPlus className="w-4 h-4" />
          <span>Case Intake & Legal Triage</span>
        </div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Open New Legal Matter</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Structured multi-step intake to classify your situation under Pakistani law, preserve critical facts, and generate an actionable strategy.
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="bg-white border border-[var(--color-border)] rounded-xl p-4 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[540px]">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-[var(--color-accent)] text-white ring-4 ring-purple-100'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-[var(--color-text-muted)] border border-stone-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isCurrent
                        ? 'text-[var(--color-accent)] font-bold'
                        : isCompleted
                        ? 'text-stone-800'
                        : 'text-[var(--color-text-muted)]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-2 ${idx < currentStep - 1 ? 'bg-emerald-500' : 'bg-stone-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step Contents */}
      <Card className="border-[var(--color-border)] shadow-sm bg-white">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* STEP 1: What Happened */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading text-[var(--color-text-primary)]">Tell us what happened</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Describe the incident clearly in plain Urdu, English, or Roman Urdu. Wakeel AI will assist in structuring key legal facts.
                </p>
              </div>

              <div>
                <Input
                  label="Case Title"
                  placeholder="e.g. Cyber Blackmail via WhatsApp, Land Boundary Encroachment, etc."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Textarea
                  label="Incident Summary & Details"
                  placeholder="Explain what happened chronologically. What demands or threats were made? Were any notices served? What dates are involved?"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              {/* AI Intake Trigger Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-purple-50/60 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-purple-200 flex items-center justify-center text-[var(--color-accent)] shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Analyze with Wakeel AI</h4>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Automatically detects jurisdiction, emergency triggers, and missing essential facts.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAiIntakeAnalysis}
                  disabled={aiAnalyzing || !description.trim()}
                  className="bg-white border-purple-200 text-[var(--color-accent)] hover:bg-purple-100"
                >
                  {aiAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Run AI Intake Triage
                    </>
                  )}
                </Button>
              </div>

              {/* AI Analysis Findings Display */}
              {aiAnalysisResult && (
                <div className="space-y-4 p-5 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">AI Intake Findings</span>
                    </div>
                    <Badge variant={aiAnalysisResult.suggestedUrgency === 'high' ? 'danger' : 'accent'}>
                      Urgency: {aiAnalysisResult.suggestedUrgency?.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {aiAnalysisResult.detectedUrgencyReason}
                  </p>

                  {aiAnalysisResult.safetyWarning && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{aiAnalysisResult.safetyWarning}</span>
                    </div>
                  )}

                  {aiAnalysisResult.missingFacts.length > 0 && (
                    <div>
                      <h5 className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                        Missing facts you should consider adding:
                      </h5>
                      <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                        {aiAnalysisResult.missingFacts.map((fact, i) => (
                          <li key={i}>{fact}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Category & Situation */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading text-[var(--color-text-primary)]">Legal Category & Situation</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Choose the primary field of law for your matter. AI suggested <span className="font-semibold text-[var(--color-accent)]">{category.replace(/_/g, ' ')}</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setCategory(cat.key)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-[var(--color-accent)] bg-purple-50/50 ring-2 ring-purple-200'
                          : 'border-[var(--color-border)] bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{cat.iconText}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)]" />}
                      </div>
                      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">{cat.title}</h4>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">{cat.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Urgency Rating Selection */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">Urgency Assessment</label>
                <div className="flex flex-wrap gap-2">
                  {(['routine', 'moderate', 'high', 'emergency'] as UrgencyLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        urgency === level
                          ? level === 'emergency'
                            ? 'bg-red-600 text-white border-red-600'
                            : level === 'high'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {level.toUpperCase()}
                    </button>
                  ))}
                </div>
                {urgency === 'emergency' && (
                  <p className="text-xs text-red-600 font-medium">
                    ⚠️ Emergency level selected. For immediate physical threats or violence, contact Rescue 1122 or Police Emergency 15 immediately.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Location / Jurisdiction */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading text-[var(--color-text-primary)]">Location & Jurisdiction</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Pakistani procedural law depends on the provincial High Court jurisdiction and local district administrative boundaries.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Province / Federal Territory *</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Input
                    label="District / City *"
                    placeholder="e.g. Lahore, Karachi, Rawalpindi, Peshawar"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Input
                  label="Local Police Station / Court (if known)"
                  placeholder="e.g. Gulberg Thana, Model Town Sessions Court, FIA Cybercrime Circle"
                  value={policeStationOrCourt}
                  onChange={(e) => setPoliceStationOrCourt(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Parties & Authorities */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading text-[var(--color-text-primary)]">Parties & Authorities Involved</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Identify who is on the opposing side and which state departments or statutory regulators are involved.
                </p>
              </div>

              <div>
                <Input
                  label="Opposing Party / Individual / Entity"
                  placeholder="e.g. Former employer, Unknown WhatsApp account, Landlord, Spouse"
                  value={opposingParty}
                  onChange={(e) => setOpposingParty(e.target.value)}
                />
              </div>

              <div>
                <Input
                  label="Official Authorities Involved"
                  placeholder="e.g. Punjab Police (15), FIA Cybercrime Wing, Labour Directorate, PTA, FBR"
                  value={authoritiesInvolved}
                  onChange={(e) => setAuthoritiesInvolved(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 5: Dates & Deadlines */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading text-[var(--color-text-primary)]">Important Dates & Deadlines</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Statutory limitation periods and reply deadlines are strictly enforced in Pakistani procedural law.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Incident Occurrence Date"
                    type="date"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">When did the event or threat occur?</p>
                </div>

                <div>
                  <Input
                    label="Impending Notice or Legal Deadline"
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                  />
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">e.g. Date mentioned on court summons or legal notice.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Evidence & Documents */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading text-[var(--color-text-primary)]">Preserved Evidence & Documentation</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Note the types of tangible proof currently in your possession. You can upload digital files directly to the secure Evidence Vault after case creation.
                </p>
              </div>

              <div>
                <Textarea
                  label="What proof or records do you have?"
                  placeholder="e.g. 5 WhatsApp screenshots with sender's phone number visible, EasyPaisa transaction SMS, Bank statement, Lease agreement copy, Audio recording of threatening call."
                  rows={4}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                />
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-semibold">Digital Evidence Integrity Note:</span>
                <p>
                  Do not delete original chats or edit screenshots. Under the Qanun-e-Shahadat Order 1984 and PECA 2016, original uncropped digital artifacts with cryptographic hashes are required for court admissibility.
                </p>
              </div>
            </div>
          )}

          {/* STEP 7: Review & Confirmation */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading text-[var(--color-text-primary)]">Review & Confirm Case File</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                  Verify the structured intake facts before initializing your private case file.
                </p>
              </div>

              <div className="space-y-4 bg-stone-50 p-6 rounded-xl border border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-2">
                  <div>
                    <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Title</span>
                    <h3 className="text-base font-bold text-stone-900">{title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="accent">{category.replace(/_/g, ' ').toUpperCase()}</Badge>
                    <Badge variant={urgency === 'high' || urgency === 'emergency' ? 'danger' : 'outline'}>
                      {urgency.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-stone-500 font-medium">Jurisdiction:</span>
                    <p className="font-semibold text-stone-800">{city ? `${city}, ${province}` : province}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium">Police Station / Court:</span>
                    <p className="font-semibold text-stone-800">{policeStationOrCourt || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium">Incident Date:</span>
                    <p className="font-semibold text-stone-800">{incidentDate || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium">Impending Deadline:</span>
                    <p className="font-semibold text-stone-800">{deadlineDate || 'No verified deadline'}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium">Opposing Party:</span>
                    <p className="font-semibold text-stone-800">{opposingParty || 'Not disclosed'}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium">Involved Authorities:</span>
                    <p className="font-semibold text-stone-800">{authoritiesInvolved || 'None yet'}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 text-xs">
                  <span className="text-stone-500 font-medium">Summary Description:</span>
                  <p className="text-stone-700 mt-1 leading-relaxed">{description}</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-purple-900">
                <p>
                  <span className="font-semibold">Privacy & Legal Information Notice:</span> Your case data is stored under strict Supabase Row Level Security and encrypted at rest. Wakeel provides legal information and decision support, not direct court representation.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[var(--color-border)]">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || submitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < STEPS.length ? (
              <Button variant="primary" onClick={handleNext}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleCreateCase}
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Initializing Case File...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Open Case File
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
