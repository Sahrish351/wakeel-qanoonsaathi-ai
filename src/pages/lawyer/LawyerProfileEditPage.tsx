import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Globe,
  Video,
  PhoneCall,
  Save,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  getLawyerProfileByAuthUser,
  updateLawyerProfile
} from '@/lib/api/database';

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan'
];

export default function LawyerProfileEditPage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form Fields
  const [bio, setBio] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [city, setCity] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState<'available' | 'busy' | 'unavailable'>('available');
  const [languages, setLanguages] = useState<string[]>(['en', 'ur']);
  const [consultationModes, setConsultationModes] = useState<string[]>(['in_person', 'video', 'phone']);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await getLawyerProfileByAuthUser();
        if (data) {
          setProfile(data);
          setBio(data.bio || '');
          setProvince(data.province || 'Punjab');
          setCity(data.city || '');
          setAvailabilityStatus(data.availability_status || 'available');
          if (data.languages) setLanguages(data.languages);
          if (data.consultation_modes) setConsultationModes(data.consultation_modes);
        }
      } catch (err) {
        console.error('[LawyerProfileEditPage] Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleToggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((l) => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleToggleMode = (mode: string) => {
    if (consultationModes.includes(mode)) {
      setConsultationModes(consultationModes.filter((m) => m !== mode));
    } else {
      setConsultationModes([...consultationModes, mode]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSavedSuccess(false);
    try {
      await updateLawyerProfile(profile.id, {
        bio,
        province,
        city,
        availability_status: availabilityStatus,
        languages,
        consultation_modes: consultationModes
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert('Failed to save profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Clock className="w-8 h-8 text-[var(--color-accent)] animate-spin mx-auto" />
        <p className="text-sm text-stone-500">Loading advocate profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
          <Award className="w-4 h-4" />
          <span>Bar Enrollment & Practice Settings</span>
        </div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Advocate Practice Profile</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Update practice details, regional jurisdiction, languages spoken, and consultation options.
        </p>
      </div>

      {/* Synthetic Demo Disclaimer */}
      <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Synthetic / Demo Profile Rules:</span>
          <p className="leading-relaxed">
            In compliance with hackathon regulations, bio text must retain the <span className="font-bold">[DEMO PROFILE]</span> tag to prevent fabricating actual Pakistani Bar Council credentials.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Practice profile updated successfully in the advocate registry.</span>
        </div>
      )}

      {/* Form */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Textarea
                label="Advocate Bio & Practice Description *"
                placeholder="[DEMO PROFILE] Advocate High Court specializing in constitutional writs, criminal procedure, and cybercrime defense."
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">High Court Jurisdiction Province *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-accent)]"
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
                  label="Primary Practice City *"
                  placeholder="e.g. Lahore, Karachi, Peshawar, Quetta, Islamabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Availability Status</label>
              <div className="flex gap-2">
                {(['available', 'busy', 'unavailable'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setAvailabilityStatus(status)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium capitalize border transition-colors ${
                      availabilityStatus === status
                        ? status === 'available'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : status === 'busy'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-stone-600 text-white border-stone-600'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Consultation Languages</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'en', label: 'English' },
                  { key: 'ur', label: 'Urdu (اردو)' },
                  { key: 'punjabi', label: 'Punjabi' },
                  { key: 'pashto', label: 'Pashto' },
                  { key: 'sindhi', label: 'Sindhi' },
                  { key: 'balochi', label: 'Balochi' }
                ].map((lang) => {
                  const selected = languages.includes(lang.key);
                  return (
                    <button
                      key={lang.key}
                      type="button"
                      onClick={() => handleToggleLanguage(lang.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Consultation Modes */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Consultation Modes Supported</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'in_person', label: 'In-Person Chamber', icon: MapPin },
                  { key: 'video', label: 'Video Call', icon: Video },
                  { key: 'phone', label: 'Phone Call', icon: PhoneCall }
                ].map((mode) => {
                  const selected = consultationModes.includes(mode.key);
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => handleToggleMode(mode.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                        selected
                          ? 'bg-purple-900 text-white border-purple-900'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-[var(--color-border)]">
              <Button
                variant="primary"
                type="submit"
                disabled={saving}
                className="bg-[var(--color-accent)] text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Practice Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
