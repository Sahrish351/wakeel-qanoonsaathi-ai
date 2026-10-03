import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Database,
  UserCheck,
  Users,
  FileCheck,
  ShieldAlert,
  ArrowRight,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  getAdminSources,
  getAdminLawyers,
  getAdminAuditLogs,
  getAdminUsers
} from '@/lib/api/database';
import { formatRelative, formatDate } from '@/lib/utils/date';

export default function AdminDashboardPage() {
  const [sourcesCount, setSourcesCount] = useState(0);
  const [lawyersCount, setLawyersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sources, lawyers, logs, users] = await Promise.all([
        getAdminSources(),
        getAdminLawyers(),
        getAdminAuditLogs(),
        getAdminUsers()
      ]);
      setSourcesCount(sources.length);
      setLawyersCount(lawyers.length);
      setAuditLogs(logs);
      setUsersCount(users.length);
    } catch (err) {
      console.error('[AdminDashboardPage] Error loading admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Administrative Governance & Registry Control</span>
          </div>
          <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">System Administration</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Supervise statutory knowledge registries, verified Bar rosters, and security audit telemetry.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Metrics
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[var(--color-border)] bg-white shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Statutory Sources</span>
              <h3 className="font-heading text-2xl font-bold text-stone-900 mt-1">{sourcesCount}</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Verified gazettes & acts</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[var(--color-accent)] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border)] bg-white shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Bar Advocates</span>
              <h3 className="font-heading text-2xl font-bold text-stone-900 mt-1">{lawyersCount}</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Synthetic & verified</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border)] bg-white shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Registered Users</span>
              <h3 className="font-heading text-2xl font-bold text-stone-900 mt-1">{usersCount}</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Citizens, lawyers, admins</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border)] bg-white shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Audit Events</span>
              <h3 className="font-heading text-2xl font-bold text-stone-900 mt-1">{auditLogs.length}</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">Captured security actions</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/sources">
          <Card className="border-[var(--color-border)] bg-white hover:border-purple-300 hover:shadow-sm transition-all p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[var(--color-accent)] flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-[var(--color-accent)] transition-colors">
                  Statutory Sources Registry
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage official statutes (PECA 2016, PPC, CrPC, Family Courts Act).
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>

        <Link to="/admin/lawyers">
          <Card className="border-[var(--color-border)] bg-white hover:border-purple-300 hover:shadow-sm transition-all p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                  Advocate Verification Queue
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Verify or toggle active roster status for synthetic Bar advocates.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>

        <Link to="/admin/users">
          <Card className="border-[var(--color-border)] bg-white hover:border-purple-300 hover:shadow-sm transition-all p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-blue-700 transition-colors">
                  User Account Moderation
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Review registered profiles, assigned roles, and regional distribution.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>

        <Link to="/admin/audit">
          <Card className="border-[var(--color-border)] bg-white hover:border-purple-300 hover:shadow-sm transition-all p-5 flex items-center justify-between group">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                  Audit Logs & Security Trail
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Inspect cryptographic audit events and data access compliance logs.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
          </Card>
        </Link>
      </div>

      {/* Recent Audit Stream */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardHeader className="border-b border-stone-100 pb-3 flex flex-row items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-stone-900">Recent Platform Telemetry</h3>
          <Link to="/admin/audit" className="text-xs font-semibold text-[var(--color-accent)] hover:underline">
            View All Logs
          </Link>
        </CardHeader>
        <CardContent className="p-4">
          {auditLogs.length === 0 ? (
            <p className="text-xs text-stone-400 text-center py-6">
              No recent audit logs recorded. Administrative actions are logged automatically.
            </p>
          ) : (
            <div className="space-y-2">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-3 bg-stone-50 rounded-lg text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-stone-900">{log.action}</span>
                    <p className="text-stone-500">
                      Actor: {log.profiles?.full_name || 'System'} ({log.actor_role}) • Entity: {log.entity_type}
                    </p>
                  </div>
                  <span className="text-[10px] text-stone-400">{formatRelative(log.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
