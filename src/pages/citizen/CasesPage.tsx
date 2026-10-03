import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Plus,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  AlertTriangle,
  Shield,
  FileText,
  Activity,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getUserCases } from '@/lib/api/database';
import type { Case, CaseCategory, CaseStatus } from '@/types';
import { formatRelative, formatDate } from '@/lib/utils/date';

export default function CasesPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserCases({
        category: categoryFilter,
        status: statusFilter,
        search: searchQuery
      });
      setCases(data);
    } catch (err: any) {
      console.error('[CasesPage] Error fetching cases:', err);
      setError(err.message || 'Failed to load case files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCases();
  };

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
      case 'high':
        return 'danger';
      case 'moderate':
        return 'caution';
      default:
        return 'default';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'in_progress':
        return 'accent';
      case 'escalated':
        return 'danger';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Case Portfolio & Dossiers</span>
          </div>
          <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">My Legal Cases</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Manage your legal proceedings, timeline events, evidence, and actionable next steps.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCases}
            disabled={loading}
            className="hidden sm:inline-flex"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/cases/new')}
            className="bg-[var(--color-accent)] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Open New Case
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-[var(--color-border)] shadow-xs bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search cases by title or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>
            </form>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-stone-50 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="all">All Categories</option>
                <option value="police_criminal">Police / Criminal</option>
                <option value="cybercrime">Cybercrime (PECA)</option>
                <option value="harassment_stalking">Harassment & Stalking</option>
                <option value="womens_rights">Women's Rights</option>
                <option value="family">Family & Custody</option>
                <option value="property">Property & Land</option>
                <option value="employment">Labor & Employment</option>
                <option value="business_compliance">Business & Contract</option>
                <option value="consumer">Consumer Protection</option>
                <option value="fraud_scam">Fraud & Scams</option>
                <option value="human_rights">Human Rights</option>
                <option value="other">Other Legal Matters</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-stone-50 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="escalated">Escalated</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={loadCases}
                className="text-xs"
              >
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={loadCases}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <Card key={n} className="border-[var(--color-border)] animate-pulse bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-100 rounded w-1/2" />
                <div className="h-16 bg-stone-50 rounded" />
                <div className="flex justify-between h-4 bg-stone-100 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Case List Display */}
      {!loading && !error && cases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((c) => (
            <Card
              key={c.id}
              className="border-[var(--color-border)] hover:border-purple-300 hover:shadow-md transition-all bg-white group flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant={getUrgencyBadgeVariant(c.urgency)}>
                      {c.urgency.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(c.status)}>
                      {c.status.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>

                  {/* Title & Category */}
                  <Link to={`/cases/${c.id}`} className="block">
                    <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
                      {c.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                    <span className="font-medium text-purple-700 capitalize">
                      {c.category.replace(/_/g, ' ')}
                    </span>
                    <span>•</span>
                    <span>{c.jurisdiction || 'Pakistan'}</span>
                  </div>

                  {/* Summary */}
                  {c.summary && (
                    <p className="text-xs text-[var(--color-text-secondary)] mt-3 line-clamp-2 leading-relaxed">
                      {c.summary}
                    </p>
                  )}
                </div>

                {/* Bottom Meta & Actions */}
                <div className="pt-4 border-t border-[var(--color-border)] mt-4 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated {formatRelative(c.updated_at)}</span>
                  </div>

                  <Link
                    to={`/cases/${c.id}`}
                    className="flex items-center gap-1 font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    <span>Open Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && cases.length === 0 && (
        <Card className="border-[var(--color-border)] bg-white text-center p-12">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-purple-50 text-[var(--color-accent)] flex items-center justify-center mx-auto border border-purple-100">
              <FolderOpen className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-heading text-xl text-[var(--color-text-primary)]">
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'No matching cases found'
                  : 'No active cases created yet'}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try modifying your search filter or clear active criteria.'
                  : 'Start by describing your situation in the case intake wizard to receive structured guidance.'}
              </p>
            </div>
            {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/cases/new')}
                className="bg-[var(--color-accent)] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Open First Case
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
