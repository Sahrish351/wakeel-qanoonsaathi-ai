import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Clock,
  ShieldAlert,
  Search,
  RefreshCw,
  Eye,
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getAdminAuditLogs } from '@/lib/api/database';
import { formatDate, formatRelative } from '@/lib/utils/date';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMeta, setSelectedMeta] = useState<any | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getAdminAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('[AdminAuditPage] Error loading audit trail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filtered = logs.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const action = l.action?.toLowerCase() || '';
    const entity = l.entity_type?.toLowerCase() || '';
    const actor = l.profiles?.full_name?.toLowerCase() || '';
    return action.includes(q) || entity.includes(q) || actor.includes(q);
  });

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Security Telemetry & Compliance</span>
          </div>
          <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Audit Trail & Access Logs</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Cryptographic event trail tracking administrative actions, source revisions, and consultation events.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadLogs} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Logs
        </Button>
      </div>

      {/* Search */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search audit trail by action, entity type, or actor..."
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
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Actor & Role</th>
                <th className="p-4">Entity Type</th>
                <th className="p-4 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400 font-sans">
                    Loading security audit trail...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400 font-sans">
                    No matching audit records found.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 text-stone-500 whitespace-nowrap">
                      {formatDate(log.created_at)} ({formatRelative(log.created_at)})
                    </td>
                    <td className="p-4 font-bold text-stone-900 font-sans">
                      {log.action}
                    </td>
                    <td className="p-4 font-sans">
                      <div className="font-semibold text-stone-800">{log.profiles?.full_name || 'System Actor'}</div>
                      <Badge variant="outline" className="text-[10px] mt-0.5">{log.actor_role}</Badge>
                    </td>
                    <td className="p-4 text-stone-600 font-sans">
                      <span className="font-medium text-purple-700">{log.entity_type}</span>
                    </td>
                    <td className="p-4 text-right font-sans">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMeta(log.metadata || {})}
                        className="text-xs p-1 h-auto text-[var(--color-accent)]"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Inspect JSON
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* JSON Metadata Inspector Modal */}
      {selectedMeta && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white shadow-xl border border-stone-200">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h4 className="font-bold text-sm text-stone-900 font-sans">Audit Event Metadata</h4>
              <button onClick={() => setSelectedMeta(null)} className="text-stone-400 hover:text-stone-600 text-sm">
                ✕
              </button>
            </div>
            <CardContent className="p-4">
              <pre className="p-3 bg-stone-900 text-stone-100 text-xs rounded-lg overflow-x-auto max-h-64 font-mono">
                {JSON.stringify(selectedMeta, null, 2)}
              </pre>
              <div className="flex justify-end pt-3">
                <Button variant="outline" size="sm" onClick={() => setSelectedMeta(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
