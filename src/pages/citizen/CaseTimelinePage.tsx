import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CalendarClock,
  Clock,
  ArrowLeft,
  Filter,
  CheckCircle2,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Upload,
  UserCheck,
  Sparkles,
  Layers,
  Calendar,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  getCaseEvents,
  getAllUserCaseEvents,
  getUserCases,
  getCaseById
} from '@/lib/api/database';
import type { CaseEvent, Case } from '@/types';
import { formatDate, formatRelative } from '@/lib/utils/date';

export default function CaseTimelinePage() {
  const { id } = useParams<{ id: string }>();
  const [selectedCaseId, setSelectedCaseId] = useState<string>(id || 'all');
  const [events, setEvents] = useState<(CaseEvent & { case_title?: string })[]>([]);
  const [userCases, setUserCases] = useState<Case[]>([]);
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventTypeFilter, setEventTypeFilter] = useState('all');

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const cases = await getUserCases();
        setUserCases(cases);

        if (id) {
          const c = await getCaseById(id);
          setCurrentCase(c);
          const evs = await getCaseEvents(id);
          setEvents(evs.map((e) => ({ ...e, case_title: c?.title })));
        } else {
          const evs = await getAllUserCaseEvents();
          setEvents(evs);
        }
      } catch (err) {
        console.error('[CaseTimelinePage] Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id]);

  const handleCaseSelect = async (newCaseId: string) => {
    setSelectedCaseId(newCaseId);
    setLoading(true);
    try {
      if (newCaseId === 'all') {
        setCurrentCase(null);
        const evs = await getAllUserCaseEvents();
        setEvents(evs);
      } else {
        const c = await getCaseById(newCaseId);
        setCurrentCase(c);
        const evs = await getCaseEvents(newCaseId);
        setEvents(evs.map((e) => ({ ...e, case_title: c?.title })));
      }
    } catch (err) {
      console.error('[CaseTimelinePage] Filter error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'case_created':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'fact_added':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'action_plan_generated':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'task_created':
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-amber-600" />;
      case 'document_uploaded':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'evidence_added':
        return <Upload className="w-4 h-4 text-indigo-600" />;
      case 'lawyer_response':
      case 'consultation_requested':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-stone-500" />;
    }
  };

  const filteredEvents = events.filter((e) => {
    if (eventTypeFilter === 'all') return true;
    return e.event_type === eventTypeFilter;
  });

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {id && (
            <Link
              to={`/cases/${id}`}
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-accent)] font-semibold mb-2 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Case Workspace</span>
            </Link>
          )}
          <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Procedural Case Timeline</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Chronological, immutable audit stream of procedural milestones, filings, and AI-assisted analysis.
          </p>
        </div>

        {/* Case Selector Dropdown if multiple cases */}
        {userCases.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={selectedCaseId}
              onChange={(e) => handleCaseSelect(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[var(--color-border)] rounded-lg font-medium text-stone-700 shadow-xs focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              <option value="all">All Matters (Global Timeline)</option>
              {userCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <Card className="border-[var(--color-border)] bg-white shadow-xs">
        <CardContent className="p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-600 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Event Type:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: 'all', label: 'All Events' },
              { key: 'case_created', label: 'Intake' },
              { key: 'fact_added', label: 'Facts' },
              { key: 'action_plan_generated', label: 'Action Plans' },
              { key: 'task_completed', label: 'Tasks' },
              { key: 'lawyer_response', label: 'Lawyer Updates' }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setEventTypeFilter(f.key)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  eventTypeFilter === f.key
                    ? 'bg-[var(--color-accent)] text-white font-medium'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <Card className="p-12 text-center bg-white border-[var(--color-border)]">
          <Clock className="w-6 h-6 text-stone-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-stone-500">Loading chronological milestones...</p>
        </Card>
      )}

      {/* Timeline Stream */}
      {!loading && filteredEvents.length > 0 && (
        <div className="relative pl-8 space-y-6 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="relative group">
              {/* Event Dot */}
              <div className="absolute -left-8 top-1.5 w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                {getEventIcon(ev.event_type)}
              </div>

              {/* Event Card */}
              <Card className="border-[var(--color-border)] bg-white shadow-xs hover:border-purple-200 transition-colors">
                <CardContent className="p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-900">{ev.title}</h3>
                      <Badge variant="outline">{ev.event_type.replace(/_/g, ' ')}</Badge>
                    </div>
                    <div className="text-[11px] text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(ev.occurred_at)}</span>
                      <span>({formatRelative(ev.occurred_at)})</span>
                    </div>
                  </div>

                  {ev.description && (
                    <p className="text-xs text-stone-600 leading-relaxed">{ev.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[10px] text-stone-400">
                    <span>
                      Actor: <span className="font-semibold text-stone-600">{ev.created_by || 'system'}</span>
                    </span>
                    {ev.case_title && (
                      <span className="font-semibold text-purple-700">
                        Matter: {ev.case_title}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredEvents.length === 0 && (
        <Card className="p-12 text-center bg-white border-[var(--color-border)]">
          <CalendarClock className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="font-heading text-lg text-stone-800">No Timeline Events Recorded</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Procedural milestones will populate automatically as you record case facts, complete tasks, or consult legal counsel.
          </p>
        </Card>
      )}
    </div>
  );
}
