import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  CalendarCheck,
  Clock,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Award,
  Layers,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  getLawyerProfileByAuthUser,
  getLawyerAssignedConsultations,
  updateLawyerProfile
} from '@/lib/api/database';
import { formatDate, formatRelative } from '@/lib/utils/date';

export default function LawyerDashboardPage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<'available' | 'busy' | 'unavailable'>('available');
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, consults] = await Promise.all([
        getLawyerProfileByAuthUser(),
        getLawyerAssignedConsultations()
      ]);
      setProfile(p);
      if (p?.availability_status) {
        setAvailability(p.availability_status);
      }
      setConsultations(consults);
    } catch (err) {
      console.error('[LawyerDashboardPage] Error loading lawyer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAvailabilityToggle = async (newStatus: 'available' | 'busy' | 'unavailable') => {
    if (!profile) return;
    setUpdatingAvailability(true);
    try {
      await updateLawyerProfile(profile.id, { availability_status: newStatus });
      setAvailability(newStatus);
    } catch (err: any) {
      alert('Failed to update availability: ' + err.message);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const pendingRequests = consultations.filter((c) => c.status === 'pending');
  const upcomingScheduled = consultations.filter((c) => c.status === 'accepted' || c.status === 'scheduled');
  const completedCount = consultations.filter((c) => c.status === 'completed').length;

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
            <Scale className="w-4 h-4" />
            <span>Advocate Practice Portal</span>
          </div>
          <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">
            Welcome, {profile?.profiles?.full_name || 'Advocate'}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Verified Bar Advocate consultation dashboard and client dossier manager.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Availability Toggle */}
          <div className="flex items-center bg-white border border-[var(--color-border)] rounded-lg p-1 text-xs">
            {(['available', 'busy', 'unavailable'] as const).map((status) => (
              <button
                key={status}
                disabled={updatingAvailability}
                onClick={() => handleAvailabilityToggle(status)}
                className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                  availability === status
                    ? status === 'available'
                      ? 'bg-emerald-600 text-white'
                      : status === 'busy'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-600 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Synthetic Demo Notice */}
      <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Synthetic Advocate Verification Notice:</span>
          <p className="leading-relaxed">
            This workspace operates with synthetic/demo Bar credentials distributed across Pakistani provincial High Court jurisdictions. Under strict privacy rules, client dossiers display only user-consented case briefs.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-[var(--color-border)] bg-white shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Pending Requests</span>
              <h3 className="font-heading text-2xl font-bold text-stone-900 mt-1">{pendingRequests.length}</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Awaiting initial review</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border)] bg-white shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Upcoming Sessions</span>
              <h3 className="font-heading text-2xl font-bold text-stone-900 mt-1">{upcomingScheduled.length}</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Scheduled consultations</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[var(--color-accent)] flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border)] bg-white shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Matters Handled</span>
              <h3 className="font-heading text-2xl font-bold text-stone-900 mt-1">{completedCount}</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Completed consultations</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Requests List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-stone-900">Recent Consultation Requests</h3>
            <Link to="/lawyer/consultations">
              <Button variant="ghost" size="sm" className="text-xs text-[var(--color-accent)]">
                View All ({consultations.length})
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <Card className="p-8 text-center bg-white border-[var(--color-border)]">
              <Clock className="w-6 h-6 text-stone-400 animate-spin mx-auto mb-2" />
              <p className="text-xs text-stone-500">Loading client requests...</p>
            </Card>
          ) : consultations.length === 0 ? (
            <Card className="p-8 text-center bg-white border-dashed border-stone-300">
              <p className="text-xs text-stone-500">No client consultation requests received yet.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {consultations.slice(0, 4).map((c) => (
                <Card key={c.id} className="border-[var(--color-border)] bg-white shadow-xs hover:border-purple-200 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={c.status === 'pending' ? 'caution' : c.status === 'accepted' ? 'accent' : 'outline'}>
                          {c.status.toUpperCase()}
                        </Badge>
                        <span className="text-xs font-bold text-stone-900">{c.cases?.title || 'Legal Matter'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500">
                        <span>Client: {c.profiles?.full_name || 'Anonymous Citizen'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {c.profiles?.city || 'Pakistan'}
                        </span>
                        <span>•</span>
                        <span>Requested {formatRelative(c.requested_at)}</span>
                      </div>
                    </div>

                    <Link to="/lawyer/consultations">
                      <Button variant="outline" size="sm" className="text-xs">
                        Review Brief
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Advocate Credentials Summary */}
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-bold text-stone-900">Your Bar Credentials</h3>
          <Card className="border-[var(--color-border)] bg-white shadow-xs">
            <CardContent className="p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-stone-500">Bar Enrollment:</span>
                <Badge variant="success">Verified Advocate</Badge>
              </div>
              <div className="space-y-1">
                <span className="text-stone-500 font-medium">Jurisdiction:</span>
                <p className="font-bold text-stone-800">{profile?.city || 'Lahore'}, {profile?.province || 'Punjab'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-stone-500 font-medium">Languages:</span>
                <p className="text-stone-800 font-medium">{profile?.languages?.join(', ') || 'English, Urdu'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-stone-500 font-medium">Modes:</span>
                <p className="text-stone-800 font-medium">{profile?.consultation_modes?.join(', ') || 'In-Person, Video'}</p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <Link to="/lawyer/profile">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Award className="w-3.5 h-3.5 mr-1.5" />
                    Edit Practice Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
