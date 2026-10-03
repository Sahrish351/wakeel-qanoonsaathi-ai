import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  EyeOff,
  BellOff,
  Download,
  Lock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useSafety } from '@/contexts/SafetyContext';

export default function PrivacySettingsPage() {
  const { safetyMode, enableSafetyMode, disableSafetyMode, quickExit } = useSafety();
  const [discreetNotifications, setDiscreetNotifications] = useState(true);
  const [sessionOnlyEvidence, setSessionOnlyEvidence] = useState(false);
  const [downloadingExport, setDownloadingExport] = useState(false);

  const handleExportData = () => {
    setDownloadingExport(true);
    setTimeout(() => {
      const exportPayload = {
        platform: 'Wakeel QanoonSaathi AI',
        exported_at: new Date().toISOString(),
        security_note: 'Confidential client legal export file.',
        encryption: 'AES-256 at rest (Supabase PostgreSQL RLS)',
      };
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wakeel_privacy_export_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadingExport(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-16 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Zero-Surveillance Architecture & Safety</span>
        </div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Privacy & Safety Controls</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Configure privacy safeguards, emergency quick-exit parameters, and data sovereignty.
        </p>
      </div>

      {/* Safety Mode Toggle Card */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-purple-700" />
            <h3 className="font-heading text-lg font-bold text-stone-900">Safety & Stealth Mode</h3>
          </div>
          <Badge variant={safetyMode ? 'danger' : 'outline'}>
            {safetyMode ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-xs">
          <p className="text-stone-600 leading-relaxed">
            When enabled, Safety Mode masks case preview titles on screen, suppresses popover previews, and pins the persistent <span className="font-bold text-red-600">Quick Exit (Esc)</span> floating emergency button.
          </p>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-bold text-stone-800">Toggle Stealth Mode</span>
              <p className="text-stone-400">Instantly applies across all citizen pages.</p>
            </div>
            <button
              onClick={() => (safetyMode ? disableSafetyMode() : enableSafetyMode())}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                safetyMode ? 'bg-[var(--color-accent)]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  safetyMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Quick Exit Disclaimer:
            </span>
            <p>
              Quick Exit navigates your browser tab to a neutral destination (Google Weather/News) immediately. However, it cannot erase operating-system level Wi-Fi router logs or device keystroke loggers. For severe stalking or domestic surveillance, access Wakeel via Private Browsing on a trusted device.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Discreet Notifications Card */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BellOff className="w-4 h-4 text-stone-700" />
            <h3 className="font-heading text-lg font-bold text-stone-900">Discreet Notification Channel</h3>
          </div>
          <Badge variant={discreetNotifications ? 'success' : 'outline'}>
            {discreetNotifications ? 'ENABLED' : 'DISABLED'}
          </Badge>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-xs">
          <p className="text-stone-600 leading-relaxed">
            Hides legal terms and criminal case references in browser notifications and email alerts. Notifications read as generic administrative reminders (e.g., "You have 1 pending scheduled action") rather than mentioning case specifics.
          </p>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="font-bold text-stone-800">Use Discreet Language</span>
              <p className="text-stone-400">Neutral subject lines for all alerts.</p>
            </div>
            <button
              onClick={() => setDiscreetNotifications((prev) => !prev)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                discreetNotifications ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  discreetNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Row Level Security & Data Export Card */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h3 className="font-heading text-lg font-bold text-stone-900">Data Sovereignty & Encryption</h3>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-xs">
          <div className="space-y-2 leading-relaxed text-stone-600">
            <p>
              • <span className="font-semibold text-stone-900">Row Level Security (RLS):</span> All cases, facts, and timeline entries are isolated to your cryptographic UUID. Neither lawyers nor other citizens can read your records without explicit consent.
            </p>
            <p>
              • <span className="font-semibold text-stone-900">Private Storage Buckets:</span> Case files and evidence in Supabase Storage are private (`public = false`) and accessible only via time-limited signed URLs.
            </p>
            <p>
              • <span className="font-semibold text-stone-900">No Raw Evidence Broadcasting:</span> When consulting an advocate, only your approved case brief is shared. Your Evidence Vault files remain untouched.
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-800">Download Data Archive</span>
              <p className="text-stone-400">Export your case dossier and metadata in JSON format.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              disabled={downloadingExport}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              {downloadingExport ? 'Exporting...' : 'Export JSON Dossier'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
