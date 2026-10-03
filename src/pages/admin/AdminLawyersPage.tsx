import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  MapPin,
  Award,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  getAdminLawyers,
  setLawyerVerificationStatus
} from '@/lib/api/database';

export default function AdminLawyersPage() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadLawyers = async () => {
    setLoading(true);
    try {
      const data = await getAdminLawyers();
      setLawyers(data);
    } catch (err) {
      console.error('[AdminLawyersPage] Error loading lawyers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLawyers();
  }, []);

  const handleToggleVerification = async (lawyerId: string, currentVerified: boolean) => {
    setUpdatingId(lawyerId);
    try {
      await setLawyerVerificationStatus(lawyerId, !currentVerified);
      setLawyers((prev) =>
        prev.map((l) => (l.id === lawyerId ? { ...l, verified: !currentVerified } : l))
      );
    } catch (err: any) {
      alert('Failed to update verification status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = lawyers.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = l.profiles?.full_name?.toLowerCase() || '';
    const city = l.city?.toLowerCase() || '';
    const prov = l.province?.toLowerCase() || '';
    return name.includes(q) || city.includes(q) || prov.includes(q);
  });

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Advocate Verification Queue</span>
          </div>
          <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Advocate Roster & Approvals</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Review Pakistan Bar Council enrollments, manage verified status, and maintain synthetic demo advocates.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadLawyers} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </Button>
      </div>

      {/* Synthetic Demo Disclaimer */}
      <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Synthetic Advocates Registry:</span>
          <p className="mt-0.5 leading-relaxed">
            The 10 seeded advocate profiles are synthetic demo entities distributed across the provinces. Do not mark profiles verified as real-world legal practitioners unless verified against provincial Bar Council rolls.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search advocates by name, city, or province..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase font-semibold text-stone-500 tracking-wider">
              <tr>
                <th className="p-4">Advocate Name & Bio</th>
                <th className="p-4">Jurisdiction</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    Loading advocate queue...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    No advocate records found.
                  </td>
                </tr>
              ) : (
                filtered.map((lawyer) => (
                  <tr key={lawyer.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-stone-900">{lawyer.profiles?.full_name || 'Advocate'}</div>
                      <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{lawyer.bio}</div>
                    </td>
                    <td className="p-4 font-medium text-stone-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{lawyer.city}, {lawyer.province}</span>
                      </div>
                    </td>
                    <td className="p-4 capitalize">
                      <Badge variant={lawyer.availability_status === 'available' ? 'success' : 'outline'}>
                        {lawyer.availability_status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={lawyer.verified ? 'success' : 'caution'}>
                        {lawyer.verified ? 'VERIFIED' : 'UNVERIFIED'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant={lawyer.verified ? 'outline' : 'primary'}
                        size="sm"
                        disabled={updatingId === lawyer.id}
                        onClick={() => handleToggleVerification(lawyer.id, lawyer.verified)}
                        className={`text-xs ${
                          lawyer.verified
                            ? 'text-amber-700 border-amber-200 hover:bg-amber-50'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {lawyer.verified ? 'Unverify' : 'Approve & Verify'}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
