// =============================================================
// WAKEEL — Onboarding Page
// 3-step setup: Basic info, Optional context, Safety preferences.
// Saves directly to user's profile row in Supabase.
// =============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSafety } from '@/contexts/SafetyContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle2, Shield, User, SlidersHorizontal, ArrowRight, ArrowLeft } from 'lucide-react';
import type { AppLanguage } from '@/types';

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
] as const;

const OCCUPATIONS = [
  'Student',
  'Employee / Professional',
  'Small Business Owner',
  'Freelancer / Independent',
  'Homemaker',
  'Worker / Labor',
  'Other',
  'Prefer not to say',
] as const;

const AGE_BANDS = [
  'Under 18',
  '18–24',
  '25–34',
  '35–49',
  '50+',
  'Prefer not to say',
] as const;

export default function OnboardingPage() {
  const { profile, updateProfile } = useAuth();
  const { setLanguage } = useLanguage();
  const { enableSafetyMode } = useSafety();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [preferredLang, setPreferredLang] = useState<AppLanguage>(profile?.preferred_language ?? 'en');
  const [province, setProvince] = useState(profile?.province ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [occupation, setOccupation] = useState('');
  const [ageBand, setAgeBand] = useState('');
  const [safetyModeDefault, setSafetyModeDefault] = useState(false);
  const [discreetNotifications, setDiscreetNotifications] = useState(false);

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (safetyModeDefault) {
        enableSafetyMode();
      }

      setLanguage(preferredLang);

      await updateProfile({
        full_name: fullName.trim(),
        preferred_language: preferredLang,
        province: province || null,
        city: city.trim() || null,
      });

      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <h1 className="font-heading text-4xl text-[var(--color-text-primary)] tracking-tight">Wakeel</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Let's set up your profile for personalized legal guidance</p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-6" aria-label={`Step ${step} of 3`}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-200 ${
                s === step
                  ? 'w-8 bg-[var(--color-accent)]'
                  : s < step
                  ? 'w-4 bg-[var(--color-success)]'
                  : 'w-4 bg-[var(--color-border)]'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="card p-8">
          {error && (
            <div role="alert" className="mb-6 p-4 rounded-lg bg-[var(--color-danger-muted)] text-[var(--color-danger)] text-sm">
              {error}
            </div>
          )}

          {/* ── STEP 1: Basic Information ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
                <User className="w-5 h-5 text-[var(--color-accent)]" />
                <div>
                  <h2 className="font-medium text-[var(--color-text-primary)]">Your Information</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">Required so Wakeel can personalize your legal assistance</p>
                </div>
              </div>

              <Input
                label="Full Name"
                placeholder="e.g., Sarah Ahmed"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              {/* Language Preference */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Preferred Language
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'en' as const, label: 'English', sub: 'Default' },
                    { id: 'ur' as const, label: 'اردو', sub: 'Urdu script' },
                    { id: 'roman_ur' as const, label: 'Roman Urdu', sub: 'Asaan Urdu' },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setPreferredLang(l.id)}
                      className={`p-3 text-left rounded-lg border text-sm transition-all ${
                        preferredLang === l.id
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)] font-medium text-[var(--color-accent)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]'
                      }`}
                    >
                      <div className="font-semibold">{l.label}</div>
                      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{l.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Province */}
              <div>
                <label htmlFor="province-select" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Province / Region <span className="text-xs text-[var(--color-text-muted)]">(for legal jurisdiction)</span>
                </label>
                <select
                  id="province-select"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="input-base"
                >
                  <option value="">Select your province/region</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <Input
                label="City / District"
                placeholder="e.g., Lahore, Karachi, Rawalpindi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                hint="Helps find nearby lawyers and local emergency numbers"
              />

              <div className="pt-4 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setStep(2)}
                  disabled={!fullName.trim()}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Optional Context ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
                <SlidersHorizontal className="w-5 h-5 text-[var(--color-accent)]" />
                <div>
                  <h2 className="font-medium text-[var(--color-text-primary)]">Helpful Context</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">Optional — helps tailor labor, business, or civil advice</p>
                </div>
              </div>

              <div>
                <label htmlFor="occupation-select" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Occupation / Background <span className="text-xs text-[var(--color-text-muted)]">(optional)</span>
                </label>
                <select
                  id="occupation-select"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="input-base"
                >
                  <option value="">Select an option</option>
                  {OCCUPATIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="age-band-select" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Age Range <span className="text-xs text-[var(--color-text-muted)]">(optional)</span>
                </label>
                <select
                  id="age-band-select"
                  value={ageBand}
                  onChange={(e) => setAgeBand(e.target.value)}
                  className="input-base"
                >
                  <option value="">Select an option</option>
                  {AGE_BANDS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setStep(3)}>
                    Skip
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setStep(3)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Safety Preferences ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
                <Shield className="w-5 h-5 text-[var(--color-accent)]" />
                <div>
                  <h2 className="font-medium text-[var(--color-text-primary)]">Safety & Privacy Preferences</h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">Customized for sensitive situations like harassment or domestic issues</p>
                </div>
              </div>

              {/* Safety Mode Toggle */}
              <div className="flex items-start justify-between p-4 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
                <div className="pr-4">
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">
                    Enable Safety Mode by Default
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Adds a persistent Quick Exit button on sensitive screens and avoids detailed case previews in notifications.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="safety-mode-toggle"
                  checked={safetyModeDefault}
                  onChange={(e) => setSafetyModeDefault(e.target.checked)}
                  className="h-5 w-5 rounded text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer mt-0.5"
                />
              </div>

              {/* Discreet Notifications Toggle */}
              <div className="flex items-start justify-between p-4 rounded-lg bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
                <div className="pr-4">
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">
                    Discreet Notification Text
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Hides specific legal details from lock-screen and browser notifications (e.g. shows "Wakeel update" instead of case title).
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="discreet-notifications-toggle"
                  checked={discreetNotifications}
                  onChange={(e) => setDiscreetNotifications(e.target.checked)}
                  className="h-5 w-5 rounded text-[var(--color-accent)] focus:ring-[var(--color-accent)] cursor-pointer mt-0.5"
                />
              </div>

              {/* Privacy Notice */}
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                <strong>Data Privacy Commitment:</strong> Wakeel never sells your legal data or uses your private case documents to train public AI models. All documents are stored in private encrypted storage.
              </div>

              <div className="pt-4 flex justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleFinish}
                  isLoading={isSubmitting}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Finish Setup
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

