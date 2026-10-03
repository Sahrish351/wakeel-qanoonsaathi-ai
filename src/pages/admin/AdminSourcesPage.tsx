import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Trash2,
  Edit2,
  RefreshCw,
  ShieldCheck,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  getAdminSources,
  createAdminSource,
  updateAdminSource,
  deleteAdminSource
} from '@/lib/api/database';
import type { Source, SourceVerificationStatus } from '@/types';
import { formatDate } from '@/lib/utils/date';

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [authority, setAuthority] = useState('');
  const [jurisdiction, setJurisdiction] = useState('Pakistan');
  const [category, setCategory] = useState('cybercrime');
  const [url, setUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<SourceVerificationStatus>('verified');
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadSources = async () => {
    setLoading(true);
    try {
      const data = await getAdminSources();
      setSources(data);
    } catch (err) {
      console.error('[AdminSourcesPage] Error loading sources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const openAddModal = () => {
    setEditingSourceId(null);
    setTitle('');
    setAuthority('');
    setJurisdiction('Pakistan');
    setCategory('cybercrime');
    setUrl('');
    setExcerpt('');
    setVerificationStatus('verified');
    setActive(true);
    setShowModal(true);
  };

  const openEditModal = (src: Source) => {
    setEditingSourceId(src.id);
    setTitle(src.title);
    setAuthority(src.authority);
    setJurisdiction(src.jurisdiction);
    setCategory(src.category as string);
    setUrl(src.url);
    setExcerpt(src.excerpt || '');
    setVerificationStatus(src.verification_status);
    setActive(src.active);
    setShowModal(true);
  };

  const handleToggleVerification = async (src: Source) => {
    const nextStatus: SourceVerificationStatus =
      src.verification_status === 'verified' ? 'unverified' : 'verified';
    try {
      const updated = await updateAdminSource(src.id, { verification_status: nextStatus });
      setSources((prev) => prev.map((s) => (s.id === src.id ? updated : s)));
    } catch (err: any) {
      alert('Failed to update verification status: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this statutory source record?')) return;
    try {
      await deleteAdminSource(id);
      setSources((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert('Failed to delete source: ' + err.message);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authority.trim() || !url.trim()) return;
    setSubmitting(true);
    try {
      if (editingSourceId) {
        const updated = await updateAdminSource(editingSourceId, {
          title,
          authority,
          jurisdiction,
          category,
          url,
          excerpt,
          verificationStatus,
          active,
          last_reviewed_at: new Date().toISOString()
        } as any);
        setSources((prev) => prev.map((s) => (s.id === editingSourceId ? updated : s)));
      } else {
        const created = await createAdminSource({
          title,
          authority,
          jurisdiction,
          category,
          url,
          excerpt,
          verification_status: verificationStatus,
          active,
          effective_date: null,
          last_reviewed_at: new Date().toISOString()
        });
        setSources((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } catch (err: any) {
      alert('Failed to save statutory source: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = sources.filter((s) => {
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(query) ||
        s.authority.toLowerCase().includes(query) ||
        s.jurisdiction.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
            <Database className="w-4 h-4" />
            <span>Statutory Source Registry</span>
          </div>
          <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Legal Sources & Statutes</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Maintain verified federal and provincial statutes powering Wakeel AI source-grounding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadSources} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={openAddModal} className="bg-[var(--color-accent)] text-white">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Statutory Source
          </Button>
        </div>
      </div>

      {/* Filter and Search */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by title, authority, or act..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            <option value="police_criminal">Police / Criminal</option>
            <option value="cybercrime">Cybercrime (PECA)</option>
            <option value="harassment_stalking">Harassment</option>
            <option value="womens_rights">Women's Rights</option>
            <option value="family">Family & Custody</option>
            <option value="property">Property</option>
            <option value="human_rights">Human Rights</option>
          </select>
        </CardContent>
      </Card>

      {/* Sources Table */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase font-semibold text-stone-500 tracking-wider">
              <tr>
                <th className="p-4">Title & Authority</th>
                <th className="p-4">Jurisdiction</th>
                <th className="p-4">Category</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[var(--color-accent)]" />
                    Loading source registry...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    No statutory sources found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-stone-900">{s.title}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{s.authority}</div>
                    </td>
                    <td className="p-4 font-medium text-stone-600">{s.jurisdiction}</td>
                    <td className="p-4 capitalize">
                      <Badge variant="outline">{s.category.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleVerification(s)}
                        className="cursor-pointer"
                        title="Click to toggle verification"
                      >
                        <Badge variant={s.verification_status === 'verified' ? 'success' : 'caution'}>
                          {s.verification_status.toUpperCase()}
                        </Badge>
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {s.url && (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex p-1.5 text-stone-400 hover:text-stone-700 rounded"
                          title="Open official link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 text-stone-400 hover:text-[var(--color-accent)] rounded"
                        title="Edit source"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                        title="Delete source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Source Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-white shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-stone-100 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-stone-900">
                  {editingSourceId ? 'Edit Statutory Source' : 'Add Statutory Source'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 text-sm">
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <Input
                  label="Statute Title *"
                  placeholder="e.g. Prevention of Electronic Crimes Act (PECA) 2016"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <Input
                  label="Enacting / Administrative Authority *"
                  placeholder="e.g. Parliament of Pakistan / National Cyber Crime Investigation Agency (NCCIA)"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Jurisdiction *"
                    placeholder="Pakistan / Punjab / Sindh"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    required
                  />

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg"
                    >
                      <option value="cybercrime">Cybercrime</option>
                      <option value="police_criminal">Police / Criminal</option>
                      <option value="harassment_stalking">Harassment</option>
                      <option value="womens_rights">Women's Rights</option>
                      <option value="family">Family</option>
                      <option value="property">Property</option>
                      <option value="employment">Employment</option>
                      <option value="human_rights">Human Rights</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Official Gazette / Portal URL *"
                  placeholder="https://pakistancode.gov.pk/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />

                <Textarea
                  label="Statutory Excerpt / Operational Summary"
                  placeholder="Summary of substantive offences, penal sections, and investigation mandates."
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />

                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verificationStatus === 'verified'}
                      onChange={(e) => setVerificationStatus(e.target.checked ? 'verified' : 'unverified')}
                      className="rounded text-[var(--color-accent)]"
                    />
                    <span>Mark as Verified Official Statute</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" disabled={submitting} className="bg-[var(--color-accent)] text-white text-xs">
                    {submitting ? 'Saving...' : 'Save Source'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
