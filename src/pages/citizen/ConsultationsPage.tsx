import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  UserCheck,
  Briefcase,
  Video,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Search,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/states/EmptyState';
import { getUserConsultations } from '@/lib/api/database';
import { formatDate } from '@/lib/utils/date';

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConsultations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserConsultations();
      setConsultations(data);
    } catch (err: any) {
      console.error('[ConsultationsPage] Error loading consultations:', err);
      setError(err?.message || 'Failed to load consultation records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'scheduled':
        return <Badge variant="success">Confirmed / Scheduled</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'declined':
      case 'cancelled':
        return <Badge variant="danger">Declined</Badge>;
      default:
        return <Badge variant="caution">Pending Review</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E5E4]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-3xl font-bold text-[#1C1917]">Consultation Requests</h1>
            <Badge variant="accent">Advocate Connect</Badge>
          </div>
          <p className="text-sm text-[#57534E] mt-1">
            Track and manage your legal consultations with verified Pakistani advocates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadConsultations}
            disabled={loading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Link to="/lawyers">
            <Button variant="primary" size="sm" className="bg-[#7C3AED] text-white">
              Find an Advocate
            </Button>
          </Link>
        </div>
      </div>

      {/* Synthetic Demo Disclaimer */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Hackathon Demonstration Mode:</strong> All advocate connections in this directory are synthetic demonstration profiles for testing secure consultation workflows and client consent authorization.
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center text-[#57534E] text-sm">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#7C3AED]" />
          Loading your consultation records...
        </div>
      ) : error ? (
        <Card variant="bordered" className="bg-red-50 border-red-200 p-6 text-center">
          <p className="text-sm text-red-700 mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={loadConsultations}>
            Try Again
          </Button>
        </Card>
      ) : consultations.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Consultations Requested Yet"
          description="When you match with an advocate or request legal advice from inside a case file, your appointments and status will appear here."
          actionLabel="Browse Verified Advocates"
          onAction={() => window.location.href = '/lawyers'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {consultations.map((c) => {
            const lawyerName = c.lawyers?.profiles?.full_name || 'Advocate High Court [DEMO]';
            const caseTitle = c.cases?.title || 'Legal Navigation Matter';
            const location = `${c.lawyers?.city || 'City'}, ${c.lawyers?.province || 'Pakistan'}`;

            return (
              <Card key={c.id} variant="bordered" className="bg-white hover:border-[#7C3AED]/40 transition-all">
                <CardHeader className="pb-3 border-b border-[#E7E5E4]/60">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-[#1C1917]">{lawyerName}</h3>
                      <p className="text-xs text-[#57534E] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#A8A29E]" /> {location}
                      </p>
                    </div>
                    {getStatusBadge(c.status)}
                  </div>
                </CardHeader>

                <CardContent className="pt-3 space-y-3 text-xs">
                  {/* Linked Case */}
                  <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4] flex items-center justify-between">
                    <div>
                      <span className="text-[#A8A29E] text-[10px] uppercase font-semibold block">Linked Case File</span>
                      <span className="font-medium text-[#1C1917] line-clamp-1">{caseTitle}</span>
                    </div>
                    {c.case_id && (
                      <Link
                        to={`/cases/${c.case_id}`}
                        className="text-[#7C3AED] hover:underline flex items-center gap-1 shrink-0 font-medium ml-2"
                      >
                        View Case <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {/* Scheduled date if any */}
                  {c.scheduled_at && (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-medium">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Scheduled: {new Date(c.scheduled_at).toLocaleString()}</span>
                    </div>
                  )}

                  {/* Consent and Privacy */}
                  <div className="space-y-1">
                    <span className="text-[#A8A29E] text-[10px] uppercase font-semibold block">Client Shared Consent</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(c.consented_fields && c.consented_fields.length > 0) ? (
                        c.consented_fields.map((field: string, idx: number) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-[#EDE9FE] text-[#7C3AED] text-[10px] font-medium">
                            ✓ {field}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px]">
                          Private Note &amp; Summary Only
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notes / Requested at */}
                  <div className="pt-2 border-t border-[#E7E5E4] flex items-center justify-between text-[#A8A29E] text-[11px]">
                    <span>Requested: {formatDate(c.requested_at || c.created_at)}</span>
                    <span className="text-[#57534E]">Private Consultation</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
