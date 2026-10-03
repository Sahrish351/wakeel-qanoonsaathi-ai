import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Briefcase,
  Filter,
  Check,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  getUserTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getUserCases
} from '@/lib/api/database';
import type { Task, Case, TaskPriority } from '@/types';
import { formatDate, isOverdue } from '@/lib/utils/date';

export default function TasksPage() {
  const [tasks, setTasks] = useState<(Task & { case_title?: string })[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'done' | 'overdue'>('pending');
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<string>('all');

  // New Task Form Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaseId, setNewCaseId] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tData, cData] = await Promise.all([
        getUserTasks(),
        getUserCases()
      ]);
      setTasks(tData);
      setCases(cData);
    } catch (err: any) {
      console.error('[TasksPage] Error loading tasks:', err);
      setError(err.message || 'Failed to load task list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'done' ? 'pending' : 'done';
    try {
      const updated = await updateTaskStatus(taskId, nextStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: updated.status } : t))
      );
    } catch (err: any) {
      alert('Failed to update task: ' + err.message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err: any) {
      alert('Failed to delete task: ' + err.message);
    }
  };

  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      const created = await createTask({
        title: newTitle.trim(),
        case_id: newCaseId || null,
        priority: newPriority,
        due_at: newDueDate ? new Date(newDueDate).toISOString() : null,
        source: 'manual'
      });

      const linkedCase = cases.find((c) => c.id === newCaseId);
      setTasks((prev) => [{ ...created, case_title: linkedCase?.title }, ...prev]);
      setNewTitle('');
      setNewDueDate('');
      setShowAddModal(false);
    } catch (err: any) {
      alert('Failed to create task: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter evaluation
  const filteredTasks = tasks.filter((t) => {
    if (selectedCaseFilter !== 'all' && t.case_id !== selectedCaseFilter) {
      return false;
    }
    if (statusFilter === 'pending') {
      return t.status !== 'done';
    }
    if (statusFilter === 'done') {
      return t.status === 'done';
    }
    if (statusFilter === 'overdue') {
      return t.status !== 'done' && t.due_at && isOverdue(t.due_at);
    }
    return true;
  });

  const overdueCount = tasks.filter((t) => t.status !== 'done' && t.due_at && isOverdue(t.due_at)).length;

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[var(--color-accent)] font-medium mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Procedural Action Items</span>
          </div>
          <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Tasks & To-Dos</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Actionable procedural steps, document collections, and court deadline trackers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="hidden sm:inline-flex"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-[var(--color-accent)] text-white"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Overdue Warning Alert */}
      {overdueCount > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3 text-xs text-red-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>
              You have <span className="font-bold">{overdueCount} overdue procedural task{overdueCount > 1 ? 's' : ''}</span> requiring immediate attention.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusFilter('overdue')}
            className="text-xs bg-white text-red-700 border-red-200 hover:bg-red-100"
          >
            View Overdue
          </Button>
        </div>
      )}

      {/* Filter and Tab Bar */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardContent className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'pending', label: `Pending (${tasks.filter((t) => t.status !== 'done').length})` },
              { key: 'overdue', label: `Overdue (${overdueCount})` },
              { key: 'done', label: `Completed (${tasks.filter((t) => t.status === 'done').length})` },
              { key: 'all', label: `All (${tasks.length})` }
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
          </div>

          {/* Case Filter Selector */}
          {cases.length > 0 && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-stone-500 font-medium">Matter:</span>
              <select
                value={selectedCaseFilter}
                onChange={(e) => setSelectedCaseFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="all">All Matters</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading Skeleton */}
      {loading && (
        <Card className="p-12 text-center bg-white border-[var(--color-border)]">
          <Clock className="w-6 h-6 text-stone-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-stone-500">Loading your legal checklist...</p>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={loadData}>
            Retry
          </Button>
        </div>
      )}

      {/* Task List */}
      {!loading && !error && filteredTasks.length > 0 && (
        <div className="space-y-3">
          {filteredTasks.map((t) => {
            const isDone = t.status === 'done';
            const overdue = !isDone && t.due_at && isOverdue(t.due_at);
            return (
              <Card
                key={t.id}
                className={`border-[var(--color-border)] bg-white shadow-xs transition-all ${
                  isDone ? 'opacity-60 bg-stone-50/50' : overdue ? 'border-red-300' : 'hover:border-purple-200'
                }`}
              >
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 flex-1">
                    <button
                      onClick={() => handleToggleTaskStatus(t.id, t.status)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 hover:border-purple-500'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div className="space-y-1">
                      <p className={`text-sm font-semibold ${isDone ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {t.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                        {t.case_title && (
                          <Link
                            to={`/cases/${t.case_id}`}
                            className="font-semibold text-purple-700 hover:underline flex items-center gap-1"
                          >
                            <Briefcase className="w-3 h-3" />
                            <span>{t.case_title}</span>
                          </Link>
                        )}
                        {t.due_at && (
                          <span className={`flex items-center gap-1 ${overdue ? 'text-red-600 font-bold' : ''}`}>
                            <Calendar className="w-3 h-3" />
                            {overdue ? 'Overdue: ' : 'Due: '}
                            {formatDate(t.due_at)}
                          </span>
                        )}
                        <span className="text-stone-400 capitalize">• Source: {t.source || 'manual'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={t.priority === 'urgent' ? 'danger' : t.priority === 'high' ? 'caution' : 'outline'}>
                      {t.priority.toUpperCase()}
                    </Badge>
                    <button
                      onClick={() => handleDeleteTask(t.id)}
                      className="text-stone-300 hover:text-red-600 p-1 rounded transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTasks.length === 0 && (
        <Card className="p-12 text-center bg-white border-[var(--color-border)]">
          <CheckSquare className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="font-heading text-lg text-stone-800">
            {statusFilter === 'done'
              ? 'No completed tasks yet'
              : statusFilter === 'overdue'
              ? 'No overdue tasks!'
              : 'No pending tasks'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            {statusFilter === 'overdue'
              ? 'All time-sensitive deadlines are current.'
              : 'Add procedural checklist items, document collection steps, or filing deadlines.'}
          </p>
          <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Task
          </Button>
        </Card>
      )}

      {/* Create Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-white shadow-xl border border-stone-200">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="font-heading text-lg font-bold text-stone-900">Create Action Item</h3>
                <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600 text-sm">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
                <Input
                  label="Task Title *"
                  placeholder="e.g. Procure certified copy of Roznamcha entry"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />

                {cases.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Link to Case (Optional)</label>
                    <select
                      value={newCaseId}
                      onChange={(e) => setNewCaseId(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    >
                      <option value="">No linked case (Standalone)</option>
                      {cases.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      label="Deadline Date"
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    >
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" disabled={submitting} className="bg-[var(--color-accent)] text-white text-xs">
                    {submitting ? 'Creating...' : 'Create Task'}
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
