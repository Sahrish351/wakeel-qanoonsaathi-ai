import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  PhoneCall,
  Lock,
  AlertTriangle,
  FileText,
  LifeBuoy,
  EyeOff,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useSafety } from '@/contexts/SafetyContext';

const HELPLINES = [
  { name: 'Police Emergency', number: '15', authority: 'Provincial Police Command', desc: 'Immediate physical danger, violent threats, burglary' },
  { name: 'Rescue & Ambulance', number: '1122', authority: 'Punjab / Sindh / KPK Rescue', desc: 'Emergency medical aid, building collapse, fire' },
  { name: 'NCCIA Cybercrime Reporting', number: '1799', authority: 'National Cyber Crime Agency', desc: 'Online blackmail, cyber extortion, non-consensual media leaks' },
  { name: 'Human Rights Helpline', number: '1099', authority: 'Ministry of Human Rights', desc: 'Illegal custody, bonded labor, religious persecution, fundamental rights' },
  { name: 'Women Safety Helpline', number: '1043', authority: 'Punjab Commission on Status of Women', desc: 'Domestic violence, forced marriage, workplace harassment' },
  { name: 'Child Protection Bureau', number: '1121', authority: 'CPWB Pakistan', desc: 'Runaway minors, physical abuse, child labor emergencies' },
];

export default function SafetyCenterPage() {
  const { enableSafetyMode, quickExit } = useSafety();

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto px-4 sm:px-6 pt-6">
      {/* Top Emergency Hero Banner */}
      <div className="p-6 md:p-8 bg-red-600 text-white rounded-2xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-red-200">Emergency Protocol</span>
              <h1 className="font-heading text-2xl md:text-3xl font-bold">In Immediate Physical Danger?</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:15"
              className="px-5 py-2.5 bg-white text-red-700 hover:bg-red-50 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Police (15)</span>
            </a>
            <button
              onClick={quickExit}
              className="px-4 py-2.5 bg-red-800 hover:bg-red-900 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              title="Leave this site immediately"
            >
              <EyeOff className="w-4 h-4" />
              <span>Quick Exit</span>
            </button>
          </div>
        </div>
        <p className="text-xs md:text-sm text-red-100 leading-relaxed max-w-3xl">
          Wakeel provides decision support and statutory information. It is NOT a substitute for emergency state services or direct police dispatch. If an assailant or threat is present, call state emergency services immediately.
        </p>
      </div>

      {/* Official State Helplines Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-stone-900">Official Pakistani Helplines</h2>
            <p className="text-xs text-stone-500 mt-0.5">Verified toll-free emergency numbers accessible 24/7 across all networks.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {HELPLINES.map((line) => (
            <Card key={line.number} className="border-[var(--color-border)] bg-white shadow-xs hover:border-purple-200 transition-colors">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">{line.name}</span>
                    <Badge variant="danger" className="text-xs font-mono font-bold">
                      {line.number}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-purple-700 font-medium block">{line.authority}</span>
                  <p className="text-xs text-stone-600 leading-relaxed pt-1">{line.desc}</p>
                </div>

                <a
                  href={`tel:${line.number}`}
                  className="w-full py-2 bg-stone-50 hover:bg-purple-50 text-stone-700 hover:text-[var(--color-accent)] border border-stone-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Dial {line.number}</span>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Critical Legal Situation Protocol Guides */}
      <div className="space-y-6">
        <h2 className="font-heading text-2xl font-bold text-stone-900">Procedural Safety Guides</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guide 1: Police Station Contact */}
          <Card className="border-[var(--color-border)] bg-white shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-700" />
                <h3 className="font-heading text-base font-bold text-stone-900">
                  Police Summons & Station Contact Protocol
                </h3>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs leading-relaxed text-stone-700">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1 text-stone-800">
                <span className="font-bold">Golden Rule:</span> Never attend a police station unaccompanied or resist officers physically.
              </div>
              <ul className="space-y-2 list-disc list-inside text-stone-600">
                <li><strong className="text-stone-800">Section 160 CrPC Notice:</strong> An Investigating Officer (IO) must serve a written order in writing requiring attendance as a witness. Verbal summons over phone have no statutory finality.</li>
                <li><strong className="text-stone-800">Right to Legal Representation:</strong> Under Article 10 of the Constitution of Pakistan, you are entitled to be accompanied by a licensed advocate of the High Court or District Bar.</li>
                <li><strong className="text-stone-800">Certified Copy of FIR:</strong> Under Section 154 CrPC, the accused or complainant is legally entitled to a certified copy of the registered First Information Report.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Guide 2: Cyber Blackmail & Extortion */}
          <Card className="border-[var(--color-border)] bg-white shadow-xs">
            <CardHeader className="border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-700" />
                <h3 className="font-heading text-base font-bold text-stone-900">
                  Cyber Blackmail & Non-Consensual Media (PECA 2016)
                </h3>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3 text-xs leading-relaxed text-stone-700">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1 text-stone-800">
                <span className="font-bold">Evidence Rule:</span> Do not delete threatening chats or edit screenshots.
              </div>
              <ul className="space-y-2 list-disc list-inside text-stone-600">
                <li><strong className="text-stone-800">Section 21 PECA:</strong> Non-consensual transmission of intimate imagery carries up to 5 years imprisonment and mandatory fines.</li>
                <li><strong className="text-stone-800">Section 24 PECA:</strong> Cyber stalking and extortion demands are non-bailable cognizable offences investigated by NCCIA.</li>
                <li><strong className="text-stone-800">Do Not Pay Extortion:</strong> Digital ransom payments do not delete source files and often accelerate extortion attempts. Lodge a report with NCCIA at 1799 immediately.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Zero-Surveillance Notice */}
      <div className="p-6 bg-purple-50/60 border border-purple-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-heading text-lg font-bold text-stone-900">Need Confidential Case Guidance?</h4>
          <p className="text-xs text-stone-600 max-w-xl">
            Wakeel’s AI triage engine runs with Row Level Security and zero commercial tracking. Start a confidential intake to map out your legal next steps.
          </p>
        </div>
        <Link to="/register">
          <Button variant="primary" size="sm" className="bg-[var(--color-accent)] text-white text-xs whitespace-nowrap">
            Start Confidential Intake <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
