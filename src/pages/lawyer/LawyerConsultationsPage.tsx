import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  RefreshCw,
  PhoneCall,
  Video,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  getLawyerAssignedConsultations,
  updateConsultationStatus
} from '@/lib/api/database';
import type { ConsultationStatus } from '@/types';
import { formatDate, formatRelative } from '@/lib/utils/date';

export default function LawyerConsultationsPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'scheduled' | 'completed' | 'declined'>('all');

  // Case Brief Modal State
  const [selectedBrief, setSelectedBrief] = useState<any | null>(null);
  const [schedulingModalConsult, setSchedulingModalConsult] = useState<any | null>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const data = await getLawyerAssignedConsultations();
      setConsultations(data);
    } catch (err) {
      console.error('[LawyerConsultationsPage] Error loading consultations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  const handleStatusUpdate = async (id: string, status: ConsultationStatus, dateStr?: string) => {
    setUpdatingId(id);
    try {
      const updated = await updateConsultationStatus(id, status, dateStr);
      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: updated.status, scheduled_at: updated.scheduled_at } : c))
      );
      setSchedulingModalConsult(null);
    } catch (err: any) {
      alert('Failed to update consultation: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = consultations.filter((c) => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>Advocate Docket & Client Consultations</span>
          </div>
          <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Client Consultations</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Review client-consented case briefs, accept inquiries, and schedule advice sessions.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadConsultations}
          disabled={loading}
          className="self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Docket
        </Button>
      </div>

      {/* Filter Tabs */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardContent className="p-3.5 flex flex-wrap gap-1.5 text-xs">
          {[
            { key: 'all', label: `All Inquiries (${consultations.length})` },
            { key: 'pending', label: `Pending (${consultations.filter((c) => c.status === 'pending').length})` },
            { key: 'accepted', label: `Accepted (${consultations.filter((c) => c.status === 'accepted').length})` },
            { key: 'scheduled', label: `Scheduled (${consultations.filter((c) => c.status === 'scheduled').length})` },
            { key: 'completed', label: `Completed (${consultations.filter((c) => c.status === 'completed').length})` },
            { key: 'declined', label: `Declined (${consultations.filter((c) => c.status === 'declined').length})` }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === tab.key
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Loading Skeleton */}
      {loading && (
        <Card className="p-12 text-center bg-white border-[var(--color-border)]">
          <Clock className="w-6 h-6 text-stone-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-stone-500">Retrieving authorized case briefs...</p>
        </Card>
      )}

      {/* Consultations List */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((c) => {
            const isPending = c.status === 'pending';
            const isAccepted = c.status === 'accepted' || c.status === 'scheduled';
            return (
              <Card key={c.id} className="border-[var(--color-border)] bg-white shadow-xs hover:border-purple-200 transition-colors">
                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          c.status === 'pending'
                            ? 'caution'
                            : c.status === 'accepted' || c.status === 'scheduled'
                            ? 'accent'
                            : c.status === 'completed'
                            ? 'success'
                            : 'danger'
                        }
                      >
                        {c.status.toUpperCase()}
                      </Badge>
                      <h3 className="font-heading text-lg font-bold text-stone-900">
                        {c.cases?.title || 'Legal Consultation Request'}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {c.profiles?.full_name || 'Citizen'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {c.profiles?.city || 'Pakistan'}
                      </span>
                      <span>•</span>
                      <span>Category: <span className="font-semibold text-stone-700 capitalize">{c.cases?.category?.replace(/_/g, ' ') || 'General'}</span></span>
                      <span>•</span>
                      <span>Requested {formatRelative(c.requested_at)}</span>
                    </div>

                    {c.scheduled_at && (
                      <div className="text-xs font-semibold text-purple-700 flex items-center gap-1.5 pt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Scheduled: {formatDate(c.scheduled_at)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedBrief(c)}
                      className="text-xs"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5" />
                      View Consented Brief
                    </Button>

                    {isPending && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={updatingId === c.id}
                          onClick={() => setSchedulingModalConsult(c)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Accept & Schedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updatingId === c.id}
                          onClick={() => handleStatusUpdate(c.id, 'declined')}
                          className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Decline
                        </Button>
                      </>
                    )}

                    {isAccepted && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={updatingId === c.id}
                        onClick={() => handleStatusUpdate(c.id, 'completed')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <Card className="p-12 text-center bg-white border-[var(--color-border)]">
          <CalendarCheck className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="font-heading text-lg text-stone-800">No Consultations in this Category</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            Client requests will appear here once citizens request legal consultation from their case workspace.
          </p>
        </Card>
      )}

      {/* Consented Case Brief Modal */}
      {selectedBrief && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-white shadow-xl border border-stone-200 max-h-[85vh] overflow-y-auto">
            <CardHeader className="border-b border-stone-100 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-heading text-lg font-bold text-stone-900">User-Consented Case Brief</h3>
                </div>
                <button onClick={() => setSelectedBrief(null)} className="text-stone-400 hover:text-stone-600 text-sm">
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-lg text-purple-900 leading-relaxed">
                <span className="font-bold">Confidential Privilege Note:</span>
                <p className="mt-0.5">
                  This summary contains only information explicitly authorized by the citizen for preliminary advice. Under Bar ethical guidelines, client confidentiality attaches to this communication.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">Case Matter</span>
                <h4 className="text-sm font-bold text-stone-900">{selectedBrief.cases?.title}</h4>
                <p className="text-stone-600 capitalize">
                  Category: {selectedBrief.cases?.category?.replace(/_/g, ' ')} • Urgency: {selectedBrief.cases?.urgency}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-stone-100">
                <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">Client Narrative</span>
                <p className="text-stone-700 leading-relaxed whitespace-pre-wrap bg-stone-50 p-3 rounded-lg border border-stone-200">
                  {selectedBrief.cases?.summary || 'No detailed narrative disclosed.'}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-stone-100">
                <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px]">Client Location</span>
                <p className="text-stone-700">
                  {selectedBrief.profiles?.full_name} ({selectedBrief.profiles?.city || 'Pakistan'})
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-stone-100">
                <Button variant="outline" size="sm" onClick={() => setSelectedBrief(null)}>
                  Close Brief
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scheduling Modal */}
      {schedulingModalConsult && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white shadow-xl border border-stone-200">
            <CardHeader className="border-b border-stone-100 pb-3">
              <h3 className="font-heading text-lg font-bold text-stone-900">Accept & Schedule Consultation</h3>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <p className="text-stone-600">
                Set the proposed date and time for consultation with{' '}
                <span className="font-semibold text-stone-900">
                  {schedulingModalConsult.profiles?.full_name || 'Client'}
                </span>
                .
              </p>

              <div>
                <Input
                  label="Proposed Consultation Date & Time"
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setSchedulingModalConsult(null)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    handleStatusUpdate(
                      schedulingModalConsult.id,
                      'scheduled',
                      scheduledDateTime ? new Date(scheduledDateTime).toISOString() : undefined
                    )
                  }
                  className="bg-emerald-600 text-white"
                >
                  Confirm & Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
