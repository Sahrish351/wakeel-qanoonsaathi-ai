import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ShieldCheck,
  ListChecks,
  Lock,
  UserCheck,
  ArrowRight,
  Scale,
  Sparkles,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Incident Intake in Your Language',
    subtitle: 'Urdu (اردو), English, or Roman Urdu',
    desc: 'Describe your situation in natural colloquial words without legal jargon. Wakeel AI normalizes language, extracts chronologies, and prompts for missing critical details.',
    icon: MessageSquare,
    badge: 'Stage 1: Intake'
  },
  {
    step: 2,
    title: 'Statutory Grounding & Urgency Triage',
    subtitle: 'PECA 2016, PPC, CrPC, Family Courts Act',
    desc: 'The agent cross-references your narrative with official Pakistani federal and provincial statutes. It enforces safety boundaries, identifies emergency risks, and flags statutory sections.',
    icon: ShieldCheck,
    badge: 'Stage 2: Grounding'
  },
  {
    step: 3,
    title: 'Sequenced Procedural Action Plan',
    subtitle: 'Do Now, Next 24 Hours, and What to Avoid',
    desc: 'Receive a prioritized operational checklist: formal notice drafts, statutory complaint forums (e.g. NCCIA, Consumer Courts, Sessions Judge), and procedural mistakes to strictly avoid.',
    icon: ListChecks,
    badge: 'Stage 3: Strategy'
  },
  {
    step: 4,
    title: 'Evidence Integrity & Vault Storage',
    subtitle: 'Client-Side SHA-256 Cryptographic Hashing',
    desc: 'Upload uncropped screenshots, payment transaction receipts, and FIR copies to an encrypted private vault. Digital signatures preserve chain-of-custody under Qanun-e-Shahadat Order 1984.',
    icon: Lock,
    badge: 'Stage 4: Preservation'
  },
  {
    step: 5,
    title: 'Consented Advocate Escalation',
    subtitle: 'High Court & District Bar Advocate Matching',
    desc: 'When court representation is needed, synthesize an encrypted case brief. You review and consent to every field shared before your dossier reaches a licensed Bar advocate.',
    icon: UserCheck,
    badge: 'Stage 5: Escalation'
  }
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="accent" className="px-3 py-1 text-xs">
          Agentic Legal Navigation Workflow
        </Badge>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-stone-900 leading-tight">
          How Wakeel Works
        </h1>
        <p className="text-sm md:text-base text-stone-600 leading-relaxed">
          From the first threatening call or legal notice to official statutory remedies and advocate representation. Here is how Wakeel guides ordinary citizens through Pakistan's legal justice system.
        </p>
      </div>

      {/* Step by Step Progression */}
      <div className="space-y-6">
        {WORKFLOW_STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={s.step} className="border-[var(--color-border)] bg-white shadow-xs hover:border-purple-200 transition-all overflow-hidden">
              <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-5 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[var(--color-accent)] border border-purple-100 flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{s.badge}</Badge>
                      <span className="text-xs font-semibold text-purple-700">{s.subtitle}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold text-stone-900">{s.title}</h3>
                    <p className="text-xs md:text-sm text-stone-600 leading-relaxed max-w-2xl">{s.desc}</p>
                  </div>
                </div>

                <div className="text-stone-300 font-heading text-4xl font-bold select-none hidden md:block">
                  0{s.step}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Grid: Wakeel vs Generic Chatbots */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-heading text-2xl font-bold text-stone-900">Why Wakeel is Not a Generic Chatbot</h2>
          <p className="text-xs text-stone-500">Engineered with rigorous safety guardrails and Pakistani statutory registries.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-red-200 bg-red-50/20 p-6 space-y-3">
            <h4 className="text-sm font-bold text-red-900">Generic AI Chatbots (ChatGPT / Clones)</h4>
            <ul className="text-xs text-red-800 space-y-2 list-disc list-inside">
              <li>Hallucinates nonexistent legal sections, penalties, and deadlines.</li>
              <li>Tells users "do not attend police stations" without CrPC bail context.</li>
              <li>Has zero concept of provincial High Court jurisdictions.</li>
              <li>Stores sensitive blackmail files on public LLM training logs.</li>
            </ul>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50/30 p-6 space-y-3">
            <h4 className="text-sm font-bold text-emerald-900">Wakeel QanoonSaathi AI</h4>
            <ul className="text-xs text-emerald-800 space-y-2 list-disc list-inside">
              <li>Statute Grounding: "No verified source, no strong claim."</li>
              <li>Procedural Safety: Section 160 CrPC witness notices & pre-arrest bail guidance.</li>
              <li>Explicit provincial jurisdictions (Punjab, Sindh, KPK, Balochistan, ICT).</li>
              <li>Zero-surveillance Private Storage with client-side SHA-256 evidence hashing.</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-8 bg-stone-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <h3 className="font-heading text-2xl font-bold">Have a Legal Query Right Now?</h3>
          <p className="text-xs text-stone-400">
            Start an intake session in English or Urdu. No upfront cost, no credit card required.
          </p>
        </div>
        <Link to="/register">
          <Button variant="primary" className="bg-[var(--color-accent)] text-white hover:bg-purple-700 whitespace-nowrap">
            Begin Free Case Intake <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
