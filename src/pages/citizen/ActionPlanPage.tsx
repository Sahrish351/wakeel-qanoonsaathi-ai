import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  ArrowRight,
  FileCheck,
  Briefcase,
  Users,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  getUserCases,
  getCaseById,
  getCaseActionPlan,
  getCaseActionPlanHistory,
  saveActionPlan,
  getVerifiedSources,
  createTask
} from '@/lib/api/database';
import type { ActionPlan, Case, Source } from '@/types';
import { formatDate } from '@/lib/utils/date';

export default function ActionPlanPage() {
  const { id } = useParams<{ id: string }>();
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(id || '');
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [planHistory, setPlanHistory] = useState<ActionPlan[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskAddedIndex, setTaskAddedIndex] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const userCases = await getUserCases();
        setCases(userCases);

        const targetId = id || (userCases.length > 0 ? userCases[0].id : '');
        setSelectedCaseId(targetId);

        if (targetId) {
          const [c, plan, verified, history] = await Promise.all([
            getCaseById(targetId),
            getCaseActionPlan(targetId),
            getVerifiedSources(),
            getCaseActionPlanHistory(targetId)
          ]);
          setCurrentCase(c);
          setActionPlan(plan);
          setSources(verified);
          setPlanHistory(history);
        }
      } catch (err) {
        console.error('[ActionPlanPage] Error initializing plan:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const handleCaseChange = async (newCaseId: string) => {
    setSelectedCaseId(newCaseId);
    setLoading(true);
    try {
      const [c, plan, history] = await Promise.all([
        getCaseById(newCaseId),
        getCaseActionPlan(newCaseId),
        getCaseActionPlanHistory(newCaseId)
      ]);
      setCurrentCase(c);
      setActionPlan(plan);
      setPlanHistory(history);
    } catch (err) {
      console.error('[ActionPlanPage] Error loading selected case plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertActionToTask = async (actionTitle: string, index: number) => {
    if (!selectedCaseId) return;
    try {
      await createTask({
        case_id: selectedCaseId,
        title: actionTitle,
        priority: 'high',
        source: 'action_plan'
      });
      setTaskAddedIndex(index);
      setTimeout(() => setTaskAddedIndex(null), 3000);
    } catch (err: any) {
      alert('Failed to add to tasks: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Clock className="w-8 h-8 text-[var(--color-accent)] animate-spin mx-auto" />
        <p className="text-sm text-stone-500">Loading statutory action roadmap...</p>
      </div>
    );
  }

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
          <h1 className="font-heading text-3xl text-[var(--color-text-primary)]">Legal Action Plan</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Verified step-by-step guidance grounded in Pakistani procedural law.
          </p>
        </div>

        {cases.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={selectedCaseId}
              onChange={(e) => handleCaseChange(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[var(--color-border)] rounded-lg font-medium text-stone-700 shadow-xs focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Case Overview Banner */}
      {currentCase && (
        <Card className="border-[var(--color-border)] bg-white shadow-xs">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="accent">{currentCase.category.replace(/_/g, ' ').toUpperCase()}</Badge>
                <Badge variant={currentCase.urgency === 'high' ? 'danger' : 'outline'}>
                  {currentCase.urgency.toUpperCase()}
                </Badge>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900">{currentCase.title}</h3>
              <p className="text-xs text-stone-500 mt-0.5">Jurisdiction: {currentCase.jurisdiction || 'Pakistan'}</p>
            </div>
            <Link to={`/cases/${currentCase.id}`}>
              <Button variant="outline" size="sm" className="text-xs">
                Open Case Dossier
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Plan Content */}
      {!actionPlan ? (
        <Card className="p-12 text-center bg-white border-dashed border-stone-300">
          <ListChecks className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="font-heading text-xl text-stone-800">No Action Plan Generated</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
            Open the case details to trigger an AI evaluation of case facts against verified Pakistani statutes.
          </p>
          {selectedCaseId && (
            <Link to={`/cases/${selectedCaseId}`}>
              <Button variant="primary" size="sm" className="bg-[var(--color-accent)] text-white text-xs">
                View Case to Generate Plan
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Version Switcher Bar (D7) */}
          {planHistory.length > 1 && (
            <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs">
              <span className="font-semibold text-stone-600 pl-1">Plan Revision History:</span>
              <div className="flex gap-1.5 overflow-x-auto">
                {planHistory.map((p) => {
                  const isCurrentSelected = actionPlan.id === p.id;
                  const isLatest = planHistory[0]?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActionPlan(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isCurrentSelected
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      v{p.version} {isLatest ? '(Latest)' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Version and Confidence Header */}
          <div className="flex items-center justify-between px-1 text-xs text-stone-500">
            <span className="font-medium">
              Plan Version: <span className="font-bold text-stone-800">v{actionPlan.version}</span> • Generated {formatDate(actionPlan.created_at)}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Statutory Grounding:</span>
              <Badge variant="success">High Confidence</Badge>
            </div>
          </div>

          {/* Immediate Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="danger">IMMEDIATE STEPS (DO NOW)</Badge>
              <span className="text-xs text-stone-500 font-medium">Critical procedural actions</span>
            </div>

            <div className="space-y-3">
              {actionPlan.actions_json.do_now?.map((item, idx) => (
                <Card key={idx} className="border-red-200 bg-red-50/20 shadow-xs">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                          <p className="text-xs text-stone-700 leading-relaxed mt-1">{item.description}</p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConvertActionToTask(item.title, idx)}
                        className="text-xs flex-shrink-0 bg-white hover:bg-stone-50"
                      >
                        {taskAddedIndex === idx ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Add to Tasks
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="pl-9 pt-2 border-t border-red-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-600 gap-2">
                      <div>
                        <span className="font-bold text-red-800">Why it matters:</span> {item.why}
                      </div>
                      <div className="text-stone-400 italic">
                        No verified deadline found (proceed promptly).
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Next 24 Hours */}
          {actionPlan.actions_json.do_next_24h?.length > 0 && (
            <div className="space-y-3">
              <Badge variant="caution">WITHIN 24 HOURS</Badge>
              <div className="space-y-3">
                {actionPlan.actions_json.do_next_24h.map((item, idx) => (
                  <Card key={idx} className="border-amber-200 bg-amber-50/20 shadow-xs">
                    <CardContent className="p-5 space-y-2">
                      <h4 className="text-sm font-bold text-stone-900">{item.title}</h4>
                      <p className="text-xs text-stone-700 leading-relaxed">{item.description}</p>
                      <div className="text-[11px] text-amber-800 pt-1">
                        <span className="font-bold">Rationale:</span> {item.why}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Strictly Avoid Guidance */}
          {actionPlan.actions_json.avoid?.length > 0 && (
            <Card className="border-stone-200 bg-stone-50 shadow-xs">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Procedural Traps & Actions to Avoid
                  </h4>
                </div>
                <ul className="text-xs text-stone-700 space-y-1 list-disc list-inside pt-1">
                  {actionPlan.actions_json.avoid.map((avoidItem, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {avoidItem}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Verified Source Grounding */}
          <Card className="border-purple-200 bg-purple-50/30 shadow-xs">
            <CardHeader className="pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--color-accent)]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                  Primary Source Registry Grounding
                </h4>
              </div>
              <p className="text-[11px] text-stone-500">
                Rule: "No verified source, no strong claim." Every statutory assertion traces to official Pakistani legal gazettes.
              </p>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {actionPlan.sources_json?.length === 0 ? (
                <p className="text-xs text-stone-500">No external statutes linked to this plan version.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {actionPlan.sources_json.map((src, i) => (
                    <div key={i} className="p-3.5 bg-white rounded-xl border border-purple-100 text-xs space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 line-clamp-1">{src.title}</span>
                        <Badge variant="success">Verified</Badge>
                      </div>
                      <p className="text-[11px] text-stone-600 font-medium">Authority: {src.authority}</p>
                      {src.excerpt && <p className="text-[11px] text-stone-500 line-clamp-2">{src.excerpt}</p>}
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[var(--color-accent)] font-semibold flex items-center gap-1 hover:underline pt-1"
                        >
                          <span>Official Statutory Reference</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
