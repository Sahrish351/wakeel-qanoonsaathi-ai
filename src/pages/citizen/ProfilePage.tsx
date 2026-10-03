import React, { useState, useEffect } from 'react';
import {
  UserCircle,
  Save,
  CheckCircle2,
  Clock,
  Shield,
  MapPin,
  Globe,
  Mail,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getUserProfile, updateUserProfile } from '@/lib/api/database';
import type { Profile, AppLanguage } from '@/types';
import { formatDate } from '@/lib/utils/date';

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan'
];

export default function ProfilePage() {
  const { user, profile: authProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [province, setProvince] = useState('Punjab');
  const [city, setCity] = useState('');
  const [preferredLang, setPreferredLang] = useState<AppLanguage>('en');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile();
        if (data) {
          setProfile(data);
          setFullName(data.full_name || '');
          setProvince(data.province || 'Punjab');
          setCity(data.city || '');
          setPreferredLang(data.preferred_language || 'en');
        } else if (authProfile) {
          setFullName(authProfile.full_name || '');
          setProvince(authProfile.province || 'Punjab');
          setCity(authProfile.city || '');
        }
      } catch (err) {
        console.error('[ProfilePage] Load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);
    try {
      const updated = await updateUserProfile({
        full_name: fullName.trim(),
        province,
        city: city.trim(),
        preferred_language: preferredLang
      });
      setProfile(updated);
      setLanguage(preferredLang);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err: any) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Clock className="w-8 h-8 text-[var(--color-accent)] animate-spin mx-auto" />
        <p className="text-sm text-stone-500">Loading citizen profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
          <UserCircle className="w-4 h-4" />
          <span>Account & Identity Management</span>
        </div>
        <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">My Profile</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage your personal identity, regional jurisdiction, and language preference.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Your personal profile has been updated successfully.</span>
        </div>
      )}

      {/* Profile Card */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Top User Info */}
          <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-[var(--color-accent)] flex items-center justify-center font-bold font-heading text-2xl">
              {fullName ? fullName[0].toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl font-bold text-stone-900">{fullName || 'Citizen User'}</h3>
                <Badge variant="accent">
                  {profile?.role?.toUpperCase() || 'CITIZEN'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email || 'No email associated'}</span>
                <span>•</span>
                <span>Member since {profile?.created_at ? formatDate(profile.created_at) : 'Recent'}</span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                label="Full Name *"
                placeholder="e.g. Sahrish Khan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Province / Administrative Territory *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg text-stone-700 font-medium focus:ring-2 focus:ring-[var(--color-accent)]"
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
                  label="City / District *"
                  placeholder="e.g. Lahore, Rawalpindi, Karachi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Preferred Interface Language
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'en', label: 'English', native: 'English' },
                  { value: 'ur', label: 'Urdu', native: 'اردو' },
                  { value: 'roman_ur', label: 'Roman Urdu', native: 'Roman Urdu' }
                ].map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => setPreferredLang(l.value as AppLanguage)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                      preferredLang === l.value
                        ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] opacity-70 font-urdu">({l.native})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100">
              <Button
                variant="primary"
                type="submit"
                disabled={saving}
                className="bg-[var(--color-accent)] text-white text-xs"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    Save Changes
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
