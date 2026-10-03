import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  FileSearch,
  Lock,
  Scale,
  BookOpen,
  Languages,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  ChevronRight,
  Eye,
  FileText,
  BadgeAlert,
  Users,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LandingPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'police' | 'blackmail' | 'notice'>('blackmail');

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] selection:bg-[#EDE9FE] selection:text-[#7C3AED]">
      {/* ── 1. HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-[#E7E5E4] bg-gradient-to-b from-[#FAF8F5] via-[#F4F1EC]/60 to-[#FAF8F5]">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#7C3AED]/10 blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-[#059669]/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#7C3AED] text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>QanoonSaathi AI • Built for Pakistan</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1C1917] leading-[1.15]">
                When you don't know your rights,{' '}
                <span className="text-[#7C3AED] italic font-normal">know your next step.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#57534E] leading-relaxed max-w-2xl font-normal">
                Wakeel guides ordinary citizens through legal distress, cyber blackmail, police summons, and complex notices. Understand what happened, verify trusted laws, protect evidence, and connect with licensed counsel.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link to="/ai">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Consult Wakeel AI
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/80 backdrop-blur-sm">
                    How Wakeel Works
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E7E5E4]/80 flex flex-wrap items-center gap-6 text-xs text-[#57534E]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Verified Legal Sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#7C3AED]" />
                  <span>Private & Client-Side Hashing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#1C1917]" />
                  <span>Zero Hallucinated Laws</span>
                </div>
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl border border-[#E7E5E4] p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-[#059669]" />
                    <span className="text-xs font-semibold text-[#1C1917] tracking-wider uppercase">Live Case Intake Simulation</span>
                  </div>
                  <Badge variant="accent">Agentic Loop</Badge>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E7E5E4] text-xs text-[#57534E]">
                  <p className="font-medium text-[#1C1917] mb-1">User Query:</p>
                  "A police station called me and told me to come tonight, but I don't know why."
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#EDE9FE]/50 border border-[#EDE9FE] text-xs text-[#1C1917]">
                    <Sparkles className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[#7C3AED]">Wakeel Triage Protocol:</p>
                      <p className="mt-0.5 text-[#57534E]">Does not say "don't go". Asks verification: station name, rank, officer ID, and written notice status under CrPC.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E7E5E4] text-xs">
                    <Clock className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[#1C1917]">Immediate Action Checklist Created:</p>
                      <p className="text-[#57534E]">1. Record caller details • 2. Check for written summons • 3. Inform trusted family member</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-[#57534E]">
                  <span>Jurisdiction: <strong>Pakistan (CrPC & PECA)</strong></span>
                  <Link to="/ai" className="text-[#7C3AED] font-semibold hover:underline flex items-center gap-1">
                    Try this live <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. THE PROBLEM / GAP SECTION ────────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-[#7C3AED] mb-2">The Structural Inequality</h2>
            <p className="font-heading text-3xl sm:text-4xl text-[#1C1917] font-bold">
              People with money keep lawyers on retainer.
            </p>
            <p className="mt-4 text-base text-[#57534E]">
              Ordinary citizens, students, women, and small merchants face fear and paralysis because they don't know whether a situation is urgent, which authority has jurisdiction, or what evidence to preserve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="bordered" className="bg-[#FAF8F5]/50 hover:border-[#7C3AED]/40 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center mb-3">
                  <BadgeAlert className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[#1C1917]">Fear & Confusion</h3>
              </CardHeader>
              <CardContent className="text-sm text-[#57534E] leading-relaxed">
                When threatened or summoned, panic leads to dangerous mistakes—like deleting evidence, paying extortionists, or missing critical legal deadlines.
              </CardContent>
            </Card>

            <Card variant="bordered" className="bg-[#FAF8F5]/50 hover:border-[#7C3AED]/40 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center mb-3">
                  <FileSearch className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[#1C1917]">Procedural Blindspots</h3>
              </CardHeader>
              <CardContent className="text-sm text-[#57534E] leading-relaxed">
                Formal legal notices (FBR, FIA, Police, Civil) use archaic language designed for professionals, leaving recipients unable to determine required actions.
              </CardContent>
            </Card>

            <Card variant="bordered" className="bg-[#FAF8F5]/50 hover:border-[#7C3AED]/40 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mb-3">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[#1C1917]">The Retainer Gap</h3>
              </CardHeader>
              <CardContent className="text-sm text-[#57534E] leading-relaxed">
                Consulting a lawyer for basic triage costs thousands of rupees upfront before a citizen even understands if they have a real case or urgent exposure.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── 3. HOW WAKEEL WORKS ─────────────────────────────────────── */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-[#7C3AED] mb-2">Guided Navigation</h2>
            <p className="font-heading text-3xl sm:text-4xl text-[#1C1917] font-bold">
              Five clear steps from panic to resolution
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: '01', title: 'Tell Your Situation', desc: 'Type, speak in Urdu/English, or upload an official notice or photo.' },
              { step: '02', title: 'Focused Triage', desc: 'Wakeel asks targeted questions to uncover missing facts and evaluate risk.' },
              { step: '03', title: 'Source Grounding', desc: 'Cross-referenced against verified Pakistani statutes, PECA, and CrPC.' },
              { step: '04', title: 'Action Plan', desc: 'Get an immediate checklist: what to do right now, in 24 hours, and what to avoid.' },
              { step: '05', title: 'Connect to Counsel', desc: 'Export an encrypted case brief and connect with verified licensed lawyers.' },
            ].map((s, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-[#E7E5E4] flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-1 rounded-md">{s.step}</span>
                  <h3 className="font-heading text-lg font-semibold text-[#1C1917] mt-4 mb-2">{s.title}</h3>
                  <p className="text-xs text-[#57534E] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. REAL-LIFE SITUATIONS ──────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs uppercase tracking-widest font-semibold text-[#7C3AED] mb-2">Triage Scenarios</h2>
              <p className="font-heading text-3xl sm:text-4xl text-[#1C1917] font-bold">
                Tested against real-world Pakistani dilemmas
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <button
                onClick={() => setActiveTab('blackmail')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'blackmail' ? 'bg-[#7C3AED] text-white' : 'bg-[#FAF8F5] text-[#57534E] hover:bg-[#E7E5E4]'
                }`}
              >
                Cyber Blackmail
              </button>
              <button
                onClick={() => setActiveTab('police')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'police' ? 'bg-[#7C3AED] text-white' : 'bg-[#FAF8F5] text-[#57534E] hover:bg-[#E7E5E4]'
                }`}
              >
                Police Summons
              </button>
              <button
                onClick={() => setActiveTab('notice')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'notice' ? 'bg-[#7C3AED] text-white' : 'bg-[#FAF8F5] text-[#57534E] hover:bg-[#E7E5E4]'
                }`}
              >
                Business Notice
              </button>
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E7E5E4] rounded-2xl p-6 sm:p-10">
            {activeTab === 'blackmail' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <Badge variant="danger">High Risk • PECA Section 21/24</Badge>
                  <h3 className="font-heading text-2xl font-bold text-[#1C1917]">
                    "Someone has private photos and is threatening to leak them unless I pay."
                  </h3>
                  <div className="space-y-3 text-sm text-[#57534E]">
                    <p><strong>Step 1: Immediate Safety:</strong> Do not pay or escalate. Extortion payments rarely stop blackmail.</p>
                    <p><strong>Step 2: Evidence Preservation:</strong> Export chats with uncropped timestamps, headers, and phone numbers before blocking.</p>
                    <p><strong>Step 3: Official Routing:</strong> Direct connection to NCCIA cybercrime helpline 1799 and secure complaint registration.</p>
                  </div>
                  <div className="pt-2">
                    <Link to="/ai">
                      <Button variant="primary" size="sm">Launch Cybercrime Workflow</Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#E7E5E4] space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-[#059669] font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Evidence Checklist Generated
                  </div>
                  <div className="p-2.5 rounded bg-[#FAF8F5] text-[#57534E]">
                    • Screenshot with sender contact details visible<br />
                    • Bank account or digital wallet payment demands<br />
                    • Timeline of first contact and subsequent threats
                  </div>
                  <div className="text-[11px] text-[#A8A29E]">Official Authority: National Cyber Crime Investigation Agency (NCCIA)</div>
                </div>
              </div>
            )}

            {activeTab === 'police' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <Badge variant="caution">Pre-Investigation Triage • CrPC Section 160</Badge>
                  <h3 className="font-heading text-2xl font-bold text-[#1C1917]">
                    "A police station called me and told me to come tonight."
                  </h3>
                  <div className="space-y-3 text-sm text-[#57534E]">
                    <p><strong>Safety Rule:</strong> Never categorically say "don't go" or "ignore it". Assess immediate safety first.</p>
                    <p><strong>Verification:</strong> Ask whether a formal written summon under CrPC 160 was issued, and record the caller rank and station.</p>
                    <p><strong>Next Step:</strong> Provide legal aid contact and accompany with counsel or a trusted relative.</p>
                  </div>
                  <div className="pt-2">
                    <Link to="/ai">
                      <Button variant="primary" size="sm">Launch Police Verification</Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#E7E5E4] space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-[#D97706] font-medium">
                    <AlertTriangle className="w-4 h-4" /> Critical Verification Steps
                  </div>
                  <div className="p-2.5 rounded bg-[#FAF8F5] text-[#57534E]">
                    • Obtain caller's Belt Number, Rank & Police Station<br />
                    • Ask for FIR or Roznamcha Diary entry number<br />
                    • Verify whether appearance requires presence of a lawyer
                  </div>
                  <div className="text-[11px] text-[#A8A29E]">Governing Statute: Code of Criminal Procedure (CrPC 1898)</div>
                </div>
              </div>
            )}

            {activeTab === 'notice' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <Badge variant="accent">Regulatory Compliance • FBR / Consumer / Labor</Badge>
                  <h3 className="font-heading text-2xl font-bold text-[#1C1917]">
                    "I received a formal show-cause notice from a tax or labor department."
                  </h3>
                  <div className="space-y-3 text-sm text-[#57534E]">
                    <p><strong>OCR Extraction:</strong> Instant extraction of issuing department, statutory deadlines, and reference numbers.</p>
                    <p><strong>Plain Urdu/English:</strong> Breaks down complex legal jargon into plain language obligations.</p>
                    <p><strong>Deadline Guardian:</strong> Automatically adds deadline reminders to prevent ex-parte penalties.</p>
                  </div>
                  <div className="pt-2">
                    <Link to="/cases">
                      <Button variant="primary" size="sm">Upload Document for Analysis</Button>
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#E7E5E4] space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-[#7C3AED] font-medium">
                    <FileText className="w-4 h-4" /> Extracted Parameters
                  </div>
                  <div className="p-2.5 rounded bg-[#FAF8F5] text-[#57534E]">
                    • Authority: Federal Board of Revenue / Punjab Revenue Authority<br />
                    • Response Window: 15 Days from receipt<br />
                    • Action: Written reply or submission of withholding challans
                  </div>
                  <div className="text-[11px] text-[#A8A29E]">Feature: Automated Deadline Calendar & Reminder Sync</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 5. AGENTIC AI WORKFLOW ──────────────────────────────────── */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-[#7C3AED] mb-2">Behind the Technology</h2>
            <p className="font-heading text-3xl sm:text-4xl text-[#1C1917] font-bold">
              Autonomous reasoning with rigid safety rails
            </p>
            <p className="mt-4 text-sm text-[#57534E]">
              Unlike raw chatbots that hallucinate citations, Wakeel functions inside an orchestrated multi-stage agentic workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E4]">
              <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold text-xs mb-4">1</div>
              <h4 className="font-heading text-lg font-semibold text-[#1C1917] mb-2">Fact Extraction</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">Separates proven user statements from missing critical details before providing answers.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E4]">
              <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold text-xs mb-4">2</div>
              <h4 className="font-heading text-lg font-semibold text-[#1C1917] mb-2">Statutory Retrieval</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">Restricts grounding to our curated database of verified Pakistani gazettes and official helplines.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E4]">
              <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold text-xs mb-4">3</div>
              <h4 className="font-heading text-lg font-semibold text-[#1C1917] mb-2">Uncertainty Scoring</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">Explicitly reports confidence scores and alerts users when jurisdictional variations apply.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-[#E7E5E4]">
              <div className="w-8 h-8 rounded-lg bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold text-xs mb-4">4</div>
              <h4 className="font-heading text-lg font-semibold text-[#1C1917] mb-2">Lawyer Briefing</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">Distills messy narratives into standard legal briefs ready for advocate review.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. DOCUMENT INTELLIGENCE ────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-xs uppercase tracking-widest font-semibold text-[#7C3AED]">Document Intelligence</h2>
              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-[#1C1917]">
                Turn confusing legal papers into clear timelines
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Upload photos or PDFs of court notices, police summons, or business letters. Wakeel’s document analyzer parses issuing bodies, reference codes, and deadlines while strictly shielding against prompt-injection attacks.
              </p>
              <ul className="space-y-3 text-sm text-[#57534E]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Authority & Reference Identification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Statutory Deadline Detection & Task Sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <span>Plain Urdu & Roman Urdu Summaries</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link to="/cases">
                  <Button variant="primary">Analyze Document Now</Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-[#E7E5E4]">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E7E5E4] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E4]">
                  <span className="font-mono text-xs text-[#7C3AED] font-semibold">NOTICE_SAMPLE_2024.PDF</span>
                  <Badge variant="success">98% Extraction Confidence</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#A8A29E]">Authority:</span>
                    <p className="font-semibold text-[#1C1917] mt-0.5">Court of Senior Civil Judge, Lahore</p>
                  </div>
                  <div>
                    <span className="text-[#A8A29E]">Deadline:</span>
                    <p className="font-semibold text-[#DC2626] mt-0.5">14 October 2026 (7 Days left)</p>
                  </div>
                  <div>
                    <span className="text-[#A8A29E]">Allegation / Matter:</span>
                    <p className="font-semibold text-[#1C1917] mt-0.5">Summary Suit for Recovery of Money</p>
                  </div>
                  <div>
                    <span className="text-[#A8A29E]">Required Response:</span>
                    <p className="font-semibold text-[#1C1917] mt-0.5">Leave to Defend Application</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. EVIDENCE VAULT ────────────────────────────────────────── */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-[#7C3AED] mb-2">Cryptographic Vault</h2>
            <p className="font-heading text-3xl sm:text-4xl text-[#1C1917] font-bold">
              Organize evidence before it is lost or deleted
            </p>
            <p className="mt-4 text-sm text-[#57534E]">
              Every uploaded screenshot or recording is stamped with a client-side SHA-256 hash and chronological incident timestamp. (Note: Hashing provides integrity verification, not automatic court admissibility).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4]">
              <Lock className="w-8 h-8 text-[#7C3AED] mb-4" />
              <h4 className="font-heading text-lg font-semibold text-[#1C1917] mb-2">Encrypted Vault Storage</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">Protected behind strict Row-Level Security. Only you and lawyers you explicitly authorize can view files.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4]">
              <Compass className="w-8 h-8 text-[#059669] mb-4" />
              <h4 className="font-heading text-lg font-semibold text-[#1C1917] mb-2">SHA-256 Hashing</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">Generates client-side hash upon upload to maintain an unalterable chain of custody record.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4]">
              <Clock className="w-8 h-8 text-[#D97706] mb-4" />
              <h4 className="font-heading text-lg font-semibold text-[#1C1917] mb-2">Timeline Integration</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">Directly tags evidence to case events so counsel can reconstruct what happened without ambiguity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. SAFETY CENTER PREVIEW ─────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF8F5] border border-[#DC2626]/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
            <div className="max-w-2xl space-y-4">
              <Badge variant="danger">Safety Mode & Emergency Access</Badge>
              <h3 className="font-heading text-3xl font-bold text-[#1C1917]">
                Discreet navigation for vulnerable citizens
              </h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                If you are experiencing domestic coercion, stalking, or harassment, toggle Safety Mode for discreet screen notifications and one-click Quick Exit to neutral pages.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link to="/safety">
                  <Button variant="destructive" size="sm" leftIcon={<ShieldAlert className="w-4 h-4" />}>
                    View Safety Center
                  </Button>
                </Link>
                <span className="text-xs text-[#57534E]">
                  Police: <strong>15</strong> • Rescue: <strong>1122</strong> • Human Rights: <strong>1099</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. MULTILINGUAL ACCESSIBILITY ───────────────────────────── */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <Languages className="w-10 h-10 text-[#7C3AED] mx-auto mb-4" />
          <h3 className="font-heading text-3xl font-bold text-[#1C1917]">
            English • اردو • Roman Urdu
          </h3>
          <p className="mt-4 text-sm text-[#57534E] leading-relaxed">
            Legal access should not require fluency in formal English. Wakeel simplifies decisions in conversational Urdu, authentic Noto Nastaliq typography, or Roman Urdu while preserving original statutory text for court accuracy.
          </p>
        </div>
      </section>

      {/* ── 10. LAWYER NETWORK ───────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-[#7C3AED] mb-2">Verified Professional Escalation</h2>
            <p className="font-heading text-3xl sm:text-4xl text-[#1C1917] font-bold">
              When AI reaches its limit, human counsel steps in
            </p>
            <p className="mt-4 text-sm text-[#57534E]">
              Wakeel matches you with advocates based on provincial bar jurisdiction, category specialty, and language.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Barrister Tariq Mansoor [DEMO]', city: 'Lahore, Punjab', spec: 'Cybercrime & Harassment', exp: '12 Yrs' },
              { name: 'Advocate Zainab Baloch [DEMO]', city: 'Karachi, Sindh', spec: 'Family & Women Rights', exp: '9 Yrs' },
              { name: 'Advocate Asadullah Khan [DEMO]', city: 'Peshawar, KPK', spec: 'Criminal Procedure & Bail', exp: '15 Yrs' },
            ].map((lawyer, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E7E5E4] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{lawyer.city}</Badge>
                    <span className="text-xs font-semibold text-[#059669] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Bar Verified
                    </span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-[#1C1917]">{lawyer.name}</h4>
                  <p className="text-xs text-[#7C3AED] font-medium mt-1">{lawyer.spec}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E7E5E4] flex items-center justify-between text-xs">
                  <span className="text-[#57534E]">Exp: {lawyer.exp}</span>
                  <Link to="/lawyers" className="text-[#7C3AED] font-semibold hover:underline">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/lawyers">
              <Button variant="outline">Browse Complete Lawyer Directory</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 11. TRUST & SOURCE GROUNDING ────────────────────────────── */}
      <section className="py-20 bg-[#FAF8F5] border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-[#7C3AED] mb-2">Grounding Policy</h2>
            <p className="font-heading text-3xl font-bold text-[#1C1917]">
              Golden Rule: No verified source, no strong claim.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white border border-[#E7E5E4]">
              <span className="text-xs text-[#A8A29E]">Statute Tier</span>
              <p className="font-semibold text-sm mt-1">Official Gazettes & Federal Acts</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E7E5E4]">
              <span className="text-xs text-[#A8A29E]">Cybercrime Tier</span>
              <p className="font-semibold text-sm mt-1">NCCIA & PECA 2016 Registry</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E7E5E4]">
              <span className="text-xs text-[#A8A29E]">Criminal Tier</span>
              <p className="font-semibold text-sm mt-1">Code of Criminal Procedure 1898</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E7E5E4]">
              <span className="text-xs text-[#A8A29E]">Support Tier</span>
              <p className="font-semibold text-sm mt-1">Ministry of Human Rights Helpline</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. PRIVACY & ARCHITECTURE ───────────────────────────────── */}
      <section className="py-20 bg-white border-b border-[#E7E5E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <Lock className="w-10 h-10 text-[#7C3AED] mx-auto mb-4" />
          <h3 className="font-heading text-3xl font-bold text-[#1C1917]">
            Your data belongs to you
          </h3>
          <p className="mt-4 text-sm text-[#57534E] leading-relaxed">
            Your private case notes, documents, and consult requests are isolated with PostgreSQL Row Level Security. We never sell your legal data or train foundational models on your sensitive submissions.
          </p>
        </div>
      </section>

      {/* ── 13. FINAL CALL TO ACTION ─────────────────────────────────── */}
      <section className="py-24 bg-[#FAF8F5] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-[#1C1917]">
            Start with what happened.
          </h2>
          <p className="text-base text-[#57534E] max-w-xl mx-auto">
            Take two minutes to describe your situation. Wakeel will triage urgency, check verified legal procedures, and give you an immediate next step.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link to="/register">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Create Free Account
              </Button>
            </Link>
            <Link to="/ai">
              <Button variant="outline" size="lg">
                Try AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
