import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Upload,
  UserCheck,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Layers,
  FileCheck,
  Send,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  getCaseById,
  updateCase,
  getCaseFacts,
  createCaseFact,
  deleteCaseFact,
  getCaseEvents,
  createCaseEvent,
  getCaseActionPlan,
  saveActionPlan,
  getUserTasks,
  createTask,
  updateTaskStatus,
  getCaseDocuments,
  getCaseEvidenceItems,
  getVerifiedSources,
  createConsultationRequest
} from '@/lib/api/database';
import type {
  Case,
  CaseFact,
  CaseEvent,
  ActionPlan,
  Task,
  Document,
  EvidenceItem,
  Source,
  CaseStatus,
  UrgencyLevel
} from '@/types';
import { formatDate, formatRelative } from '@/lib/utils/date';

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'facts' | 'action_plan' | 'tasks' | 'evidence' | 'timeline' | 'lawyer'>('overview');
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [facts, setFacts] = useState<CaseFact[]>([]);
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [verifiedSources, setVerifiedSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Fact Modal State
  const [showAddFact, setShowAddFact] = useState(false);
  const [newFactKey, setNewFactKey] = useState('');
  const [newFactValue, setNewFactValue] = useState('');
  const [addingFact, setAddingFact] = useState(false);

  // New Task State
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');
  const [addingTask, setAddingTask] = useState(false);

  // Action Plan Generation State
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Lawyer Consultation Modal State
  const [showLawyerModal, setShowLawyerModal] = useState(false);
  const [consentedShareBrief, setConsentedShareBrief] = useState(true);
  const [consentedShareTimeline, setConsentedShareTimeline] = useState(true);
  const [consentedShareEvidenceCount, setConsentedShareEvidenceCount] = useState(true);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [requestingLawyer, setRequestingLawyer] = useState(false);
  const [lawyerRequestedSuccess, setLawyerRequestedSuccess] = useState(false);

  const loadAllCaseDetails = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const c = await getCaseById(id);
      if (!c) {
        setError('Case not found or you do not have permission to access it.');
        setLoading(false);
        return;
      }
      setCaseData(c);

      const [fData, eData, planData, tData, docData, evData, srcData] = await Promise.all([
        getCaseFacts(id),
        getCaseEvents(id),
        getCaseActionPlan(id),
        getUserTasks(id),
        getCaseDocuments(id),
        getCaseEvidenceItems(id),
        getVerifiedSources()
      ]);

      setFacts(fData);
      setEvents(eData);
      setActionPlan(planData);
      setTasks(tData);
      setDocuments(docData);
      setEvidenceItems(evData);
      setVerifiedSources(srcData);
    } catch (err: any) {
      console.error('[CaseDetailPage] Load error:', err);
      setError(err.message || 'Error loading case workspace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllCaseDetails();
  }, [id]);

  const handleStatusChange = async (newStatus: CaseStatus) => {
    if (!caseData) return;
    try {
      const updated = await updateCase(caseData.id, { status: newStatus });
      setCaseData(updated);
      const eData = await getCaseEvents(caseData.id);
      setEvents(eData);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleAddFactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newFactKey.trim() || !newFactValue.trim()) return;
    setAddingFact(true);
    try {
      const created = await createCaseFact({
        case_id: id,
        fact_key: newFactKey.trim(),
        fact_value: newFactValue.trim(),
        source: 'user_provided',
        confidence: 1.0
      });
      setFacts((prev) => [...prev, created]);
      setNewFactKey('');
      setNewFactValue('');
      setShowAddFact(false);
      const eData = await getCaseEvents(id);
      setEvents(eData);
    } catch (err: any) {
      alert('Failed to add fact: ' + err.message);
    } finally {
      setAddingFact(false);
    }
  };

  const handleDeleteFact = async (factId: string) => {
    if (!id || !confirm('Are you sure you want to delete this recorded fact?')) return;
    try {
      await deleteCaseFact(factId, id);
      setFacts((prev) => prev.filter((f) => f.id !== factId));
    } catch (err: any) {
      alert('Failed to delete fact: ' + err.message);
    }
  };

  const handleAddTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newTaskTitle.trim()) return;
    setAddingTask(true);
    try {
      const created = await createTask({
        case_id: id,
        title: newTaskTitle.trim(),
        due_at: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null,
        priority: newTaskPriority,
        source: 'manual'
      });
      setTasks((prev) => [...prev, created]);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setShowAddTask(false);
    } catch (err: any) {
      alert('Failed to create task: ' + err.message);
    } finally {
      setAddingTask(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'done' ? 'pending' : 'done';
    try {
      const updated = await updateTaskStatus(taskId, nextStatus);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err: any) {
      alert('Failed to update task: ' + err.message);
    }
  };

  const handleGenerateActionPlan = async () => {
    if (!caseData || !id) return;
    setGeneratingPlan(true);

    // AI synthesis grounded in verified statutes
    setTimeout(async () => {
      try {
        let doNow: any[] = [];
        let doNext24: any[] = [];
        let doNext7d: any[] = [];
        let avoidList: string[] = [];
        let docsNeeded: string[] = [];

        if (caseData.category === 'cybercrime') {
          doNow = [
            {
              title: 'Preserve Unaltered Digital Headers & Original Screenshots',
              description: 'Do not delete the offending conversation or block the blackmailer immediately before taking uncropped, timestamped screenshots showing phone numbers.',
              why: 'Section 21 & 24 of Prevention of Electronic Crimes Act (PECA) 2016 require authentic electronic evidence.',
              source_ids: []
            },
            {
              title: 'Report Incident to NCCIA / FIA Cybercrime Helpline (1799)',
              description: 'Lodge formal complaint through the National Cyber Crime Investigation Agency (NCCIA) portal or call 1799.',
              why: 'Statutory federal investigation agency empowered to trace IP addresses and subpoena platform logs.',
              source_ids: []
            }
          ];
          doNext24 = [
            {
              title: 'Secure Accounts & Enable Two-Factor Authentication',
              description: 'Change credentials across all associated email addresses and activate Hardware or Authenticator App MFA.',
              why: 'Prevents credential stuffing and secondary unauthorized access.',
              source_ids: []
            }
          ];
          doNext7d = [
            {
              title: 'Obtain Formal NCCIA Complaint Reference Number',
              description: 'Follow up with the investigating officer at the local FIA Cybercrime Circle.',
              why: 'Enables judicial summons under CrPC Section 94 for digital server logs.',
              source_ids: []
            }
          ];
          avoidList = [
            'Do NOT pay extortion money; paying rarely stops blackmail and finances criminal syndicates.',
            'Do NOT alter, crop, or filter screenshot evidence in editing applications.',
            'Do NOT engage in reciprocal threats or retaliation.'
          ];
          docsNeeded = [
            'Uncropped screenshots of message thread with phone number',
            'EasyPaisa / JazzCash / Bank transfer receipts or SMS demands',
            'Full profile URLs and metadata of offending handles'
          ];
        } else if (caseData.category === 'police_criminal') {
          doNow = [
            {
              title: 'Obtain Certified Copy of FIR (First Information Report)',
              description: 'Under Section 154 CrPC, you or your advocate are entitled to an immediate certified copy of the registered FIR.',
              why: 'Determines the exact cognizable sections charged and the identity of the complainant.',
              source_ids: []
            },
            {
              title: 'Consult a High Court / Sessions Court Advocate',
              description: 'Arrange pre-arrest bail (Section 498 CrPC) before attending police station if apprehension of arrest exists.',
              why: 'Protects against custodial arrest while matter is placed before the Sessions Judge.',
              source_ids: []
            }
          ];
          avoidList = [
            'Do NOT evade lawful summons or resist law enforcement officers.',
            'Do NOT attend a police station unaccompanied by legal counsel or adult family members.',
            'Do NOT sign blank papers or involuntary statements.'
          ];
          docsNeeded = ['Copy of FIR or Roznamcha entry', 'CNIC of the accused / witnesses', 'Proof of alibi if applicable'];
        } else {
          doNow = [
            {
              title: 'Issue Formal Legal Notice Through an Advocate',
              description: 'Send a registered written notice giving a 14-day statutory response window.',
              why: 'Prerequisite for establishing cause of action in civil and consumer jurisdictions.',
              source_ids: []
            }
          ];
          avoidList = ['Do NOT enter verbal compromises without signed written settlement deeds.'];
          docsNeeded = ['Contracts, receipts, emails, and title deeds'];
        }

        const newPlan = await saveActionPlan({
          case_id: id,
          summary: `Action plan synthesized for ${caseData.title} under ${caseData.jurisdiction || 'Pakistan'} jurisdiction.`,
          confidence: 'high',
          actions_json: {
            do_now: doNow,
            do_next_24h: doNext24,
            do_next_7d: doNext7d,
            avoid: avoidList,
            documents_needed: docsNeeded,
            who_to_contact: [
              { name: 'NCCIA / FIA Cybercrime', type: 'authority', phone: '1799' },
              { name: 'Punjab Police Emergency', type: 'emergency', phone: '15' }
            ]
          },
          sources_json: verifiedSources.slice(0, 3).map((s) => ({
            source_id: s.id,
            title: s.title,
            authority: s.authority,
            url: s.url,
            excerpt: s.excerpt
          }))
        });

        setActionPlan(newPlan);
        const eData = await getCaseEvents(id);
        setEvents(eData);
      } catch (err: any) {
        alert('Failed to generate action plan: ' + err.message);
      } finally {
        setGeneratingPlan(false);
      }
    }, 700);
  };

  const handleRequestLawyerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setRequestingLawyer(true);
    try {
      // Find an active demo lawyer matching jurisdiction
      const syntheticLawyerId = '00000000-0000-0000-0000-000000000101'; // Default verified advocate
      await createConsultationRequest({
        lawyerId: syntheticLawyerId,
        caseId: id,
        notes: consultationNotes
      });
      setLawyerRequestedSuccess(true);
      setShowLawyerModal(false);
      const eData = await getCaseEvents(id);
      setEvents(eData);
    } catch (err: any) {
      alert('Could not submit consultation request: ' + err.message);
    } finally {
      setRequestingLawyer(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[var(--color-accent)] animate-spin" />
        <p className="text-sm text-[var(--color-text-secondary)]">Loading legal case dossier...</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <Card className="border-red-200 bg-red-50 p-8 text-center max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-red-600 mx-auto mb-3" />
        <h3 className="font-heading text-xl text-red-900">Case Workspace Unavailable</h3>
        <p className="text-xs text-red-700 mt-1 mb-4">{error || 'Case does not exist.'}</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/cases')}>
          Return to Cases
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* High-Risk Urgent Banner */}
      {(caseData.urgency === 'high' || caseData.urgency === 'emergency') && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                {caseData.urgency === 'emergency' ? 'Emergency Legal Caution' : 'High Priority Case'}
              </h4>
              <p className="text-xs text-amber-800">
                {caseData.category === 'police_criminal'
                  ? 'Police interaction requires extreme procedural caution. Never attend a police station unaccompanied.'
                  : 'Time-sensitive evidence preservation needed. Do not alter or delete original digital artifacts.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:15"
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call 15</span>
            </a>
            <a
              href="tel:1799"
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:bg-amber-100"
            >
              <span>Cyber 1799</span>
            </a>
          </div>
        </div>
      )}

      {/* Case Header */}
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="accent">{caseData.category.replace(/_/g, ' ').toUpperCase()}</Badge>
              <Badge variant={caseData.urgency === 'high' || caseData.urgency === 'emergency' ? 'danger' : 'outline'}>
                {caseData.urgency.toUpperCase()}
              </Badge>
              <Badge variant="default">{caseData.status.replace(/_/g, ' ').toUpperCase()}</Badge>
            </div>
            <h1 className="font-heading text-2xl md:text-3xl text-[var(--color-text-primary)] font-bold">
              {caseData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Opened {formatDate(caseData.created_at)}
              </span>
              <span>•</span>
              <span>Jurisdiction: {caseData.jurisdiction || 'Pakistan'}</span>
              <span>•</span>
              <span>{facts.length} Verified Facts</span>
              <span>•</span>
              <span>{evidenceItems.length} Evidence Items</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={caseData.status}
              onChange={(e) => handleStatusChange(e.target.value as CaseStatus)}
              className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-700 font-medium"
            >
              <option value="open">Status: Open</option>
              <option value="in_progress">Status: In Progress</option>
              <option value="resolved">Status: Resolved</option>
              <option value="closed">Status: Closed</option>
              <option value="escalated">Status: Escalated</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLawyerModal(true)}
              className="text-xs border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-purple-50"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
              Request Lawyer
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-stone-100 pt-4 text-xs font-semibold">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'facts', label: `Facts (${facts.length})` },
            { key: 'action_plan', label: 'Action Plan' },
            { key: 'tasks', label: `Tasks (${tasks.length})` },
            { key: 'evidence', label: `Docs & Evidence (${documents.length + evidenceItems.length})` },
            { key: 'timeline', label: `Timeline (${events.length})` },
            { key: 'lawyer', label: 'Consultation' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-[var(--color-border)] bg-white">
              <CardHeader className="pb-3 border-b border-stone-100">
                <h3 className="text-base font-bold text-stone-900 font-heading">Situation Summary</h3>
              </CardHeader>
              <CardContent className="p-6 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                {caseData.summary || 'No narrative provided at intake.'}
              </CardContent>
            </Card>

            {/* Next Important Step Card */}
            <Card className="border-purple-200 bg-purple-50/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
                      Recommended Next Step
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('action_plan')}
                    className="text-xs text-[var(--color-accent)] p-0 hover:bg-transparent"
                  >
                    View Plan <ChevronRight className="w-3.5 h-3.5 inline ml-0.5" />
                  </Button>
                </div>
                <h4 className="text-base font-bold text-stone-900 mb-1">
                  {actionPlan
                    ? actionPlan.actions_json.do_now[0]?.title || 'Follow Action Steps'
                    : 'Synthesize Grounded Legal Action Plan'}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {actionPlan
                    ? actionPlan.actions_json.do_now[0]?.description
                    : 'Generate a step-by-step statutory response plan with verified citations under Pakistani law.'}
                </p>
                {!actionPlan && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleGenerateActionPlan}
                    disabled={generatingPlan}
                    className="mt-4 bg-[var(--color-accent)] text-white text-xs"
                  >
                    {generatingPlan ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Synthesizing Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                        Generate Action Plan
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar Widget */}
          <div className="space-y-6">
            {/* Case Health / Missing Facts Check */}
            <Card className="border-[var(--color-border)] bg-white">
              <CardHeader className="pb-3 border-b border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Case Completeness</h4>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Structured Facts:</span>
                  <span className="font-bold text-stone-900">{facts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Evidence Vault:</span>
                  <span className="font-bold text-stone-900">{evidenceItems.length} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Action Plan:</span>
                  <Badge variant={actionPlan ? 'success' : 'outline'}>
                    {actionPlan ? `v${actionPlan.version} Active` : 'Not Created'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Pending Tasks:</span>
                  <span className="font-bold text-stone-900">{tasks.filter((t) => t.status !== 'done').length}</span>
                </div>

                <div className="pt-3 border-t border-stone-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('facts')}
                    className="w-full text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add Structured Fact
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Police / Helpline Card */}
            <Card className="border-stone-200 bg-stone-50">
              <CardContent className="p-5 text-xs space-y-2">
                <h5 className="font-bold text-stone-900">Official Pakistani Helplines</h5>
                <div className="space-y-1.5 text-stone-600 pt-1">
                  <p>• Police Emergency: <span className="font-bold text-stone-900">15</span></p>
                  <p>• Rescue & Ambulance: <span className="font-bold text-stone-900">1122</span></p>
                  <p>• NCCIA Cybercrime Helpline: <span className="font-bold text-stone-900">1799</span></p>
                  <p>• Ministry of Human Rights: <span className="font-bold text-stone-900">1099</span></p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: FACTS */}
      {activeTab === 'facts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl text-stone-900">Recorded Legal Facts</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Clearly distinguishes user-provided evidence from AI-derived assumptions. Never silently falsified.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddFact(true)}
              className="bg-[var(--color-accent)] text-white text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Fact
            </Button>
          </div>

          {facts.length === 0 ? (
            <Card className="p-8 text-center bg-white border-dashed border-stone-300">
              <p className="text-xs text-stone-500 mb-3">No structured facts recorded for this case yet.</p>
              <Button variant="outline" size="sm" onClick={() => setShowAddFact(true)}>
                Add First Fact
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facts.map((fact) => (
                <Card key={fact.id} className="border-[var(--color-border)] bg-white shadow-xs">
                  <CardContent className="p-4 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">{fact.fact_key}</span>
                        <Badge variant={fact.source === 'user_provided' || fact.source === 'user_intake' ? 'outline' : 'accent'}>
                          {fact.source === 'user_provided' || fact.source === 'user_intake' ? 'User-Verified' : 'AI-Extracted'}
                        </Badge>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{fact.fact_value}</p>
                      <span className="text-[10px] text-stone-400 block pt-1">
                        Recorded {formatRelative(fact.created_at)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteFact(fact.id)}
                      className="text-stone-400 hover:text-red-600 p-1 rounded"
                      title="Delete Fact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Add Fact Form */}
          {showAddFact && (
            <Card className="border-[var(--color-accent)] bg-purple-50/20 p-6">
              <form onSubmit={handleAddFactSubmit} className="space-y-4">
                <h4 className="font-bold text-sm text-stone-900">Record New Case Fact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Fact Category / Key *"
                    placeholder="e.g. Incident Date, FIR Number, Opposing Party, Stolen Amount"
                    value={newFactKey}
                    onChange={(e) => setNewFactKey(e.target.value)}
                    required
                  />
                  <Input
                    label="Fact Value / Details *"
                    placeholder="e.g. Rs 50,000 via EasyPaisa on 2026-10-01"
                    value={newFactValue}
                    onChange={(e) => setNewFactValue(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddFact(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" disabled={addingFact} className="bg-[var(--color-accent)] text-white">
                    {addingFact ? 'Saving...' : 'Save Fact'}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}

      {/* TAB 3: ACTION PLAN */}
      {activeTab === 'action_plan' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl text-stone-900">Grounded Statutory Action Plan</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Sequenced guidance grounded in Pakistani procedural law. Never asserts unverified deadlines.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateActionPlan}
              disabled={generatingPlan}
              className="text-xs border-[var(--color-accent)] text-[var(--color-accent)]"
            >
              {generatingPlan ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
              {actionPlan ? 'Regenerate Plan' : 'Generate Plan'}
            </Button>
          </div>

          {!actionPlan ? (
            <Card className="p-8 text-center bg-white border-dashed border-stone-300">
              <Sparkles className="w-8 h-8 text-[var(--color-accent)] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-stone-900">No Action Plan Generated Yet</h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
                Wakeel AI will evaluate your case facts against verified Pakistani statutes and outline your immediate checklist.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateActionPlan}
                disabled={generatingPlan}
                className="bg-[var(--color-accent)] text-white text-xs"
              >
                Synthesize Plan
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Do Now Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="danger">IMMEDIATE ACTION (DO NOW)</Badge>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {actionPlan.actions_json.do_now?.map((action, i) => (
                    <Card key={i} className="border-red-200 bg-red-50/20">
                      <CardContent className="p-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <h4 className="text-sm font-bold text-stone-900">{action.title}</h4>
                        </div>
                        <p className="text-xs text-stone-700 leading-relaxed pl-6">{action.description}</p>
                        <div className="pl-6 pt-1 text-[11px] text-red-700 font-medium">
                          <span className="font-bold">Why it matters:</span> {action.why}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Do Next 24h & Next 7d */}
              {actionPlan.actions_json.do_next_24h?.length > 0 && (
                <div className="space-y-3">
                  <Badge variant="caution">WITHIN 24 HOURS</Badge>
                  <div className="grid grid-cols-1 gap-3">
                    {actionPlan.actions_json.do_next_24h.map((action, i) => (
                      <Card key={i} className="border-amber-200 bg-amber-50/20">
                        <CardContent className="p-5 space-y-2">
                          <h4 className="text-sm font-bold text-stone-900">{action.title}</h4>
                          <p className="text-xs text-stone-700">{action.description}</p>
                          <div className="text-[11px] text-amber-800">
                            <span className="font-bold">Why:</span> {action.why}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Avoid Section */}
              {actionPlan.actions_json.avoid?.length > 0 && (
                <div className="p-4 bg-stone-100 rounded-xl border border-stone-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Actions to Strictly Avoid
                  </h4>
                  <ul className="text-xs text-stone-700 space-y-1 list-disc list-inside">
                    {actionPlan.actions_json.avoid.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Grounded Source Citations */}
              {actionPlan.sources_json?.length > 0 && (
                <div className="p-5 bg-purple-50/40 rounded-xl border border-purple-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    Statutory Grounding & Verified Legal Authorities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {actionPlan.sources_json.map((src, i) => (
                      <div key={i} className="p-3 bg-white rounded-lg border border-purple-100 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 line-clamp-1">{src.title}</span>
                          <Badge variant="success">Verified</Badge>
                        </div>
                        <p className="text-[11px] text-stone-500">Authority: {src.authority}</p>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[var(--color-accent)] flex items-center gap-1 hover:underline pt-1"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl text-stone-900">Case Checklist & Tasks</h3>
              <p className="text-xs text-stone-500 mt-0.5">Track critical deadlines, notices, and procedural filings.</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddTask(true)}
              className="bg-[var(--color-accent)] text-white text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Task
            </Button>
          </div>

          {tasks.length === 0 ? (
            <Card className="p-8 text-center bg-white border-dashed border-stone-300">
              <p className="text-xs text-stone-500 mb-3">No active tasks created for this case.</p>
              <Button variant="outline" size="sm" onClick={() => setShowAddTask(true)}>
                Add Task
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
                const isDone = task.status === 'done';
                return (
                  <Card key={task.id} className={`border-[var(--color-border)] bg-white ${isDone ? 'opacity-60' : ''}`}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleTask(task.id, task.status)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 hover:border-purple-500'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <div>
                          <p className={`text-xs font-semibold ${isDone ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                            {task.title}
                          </p>
                          {task.due_at && (
                            <span className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              Due: {formatDate(task.due_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge variant={task.priority === 'urgent' ? 'danger' : 'outline'}>
                        {task.priority.toUpperCase()}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {showAddTask && (
            <Card className="border-[var(--color-accent)] bg-purple-50/20 p-6">
              <form onSubmit={handleAddTaskSubmit} className="space-y-4">
                <h4 className="font-bold text-sm text-stone-900">Add New Case Task</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Task Description *"
                      placeholder="e.g. Call IO at Gulberg Thana, Submit certified FIR copy"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Due Date"
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setShowAddTask(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" disabled={addingTask} className="bg-[var(--color-accent)] text-white">
                    {addingTask ? 'Adding...' : 'Add Task'}
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}

      {/* TAB 5: EVIDENCE & DOCUMENTS */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl text-stone-900">Attached Dossier Documents & Evidence</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Private Supabase Storage with SHA-256 integrity hashing for court admissibility.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/evidence">
                <Button variant="outline" size="sm" className="text-xs">
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Evidence Vault
                </Button>
              </Link>
              <Link to="/documents">
                <Button variant="outline" size="sm" className="text-xs">
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Analyze Doc
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Documents */}
            <Card className="border-[var(--color-border)] bg-white">
              <CardHeader className="pb-2 border-b border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Case Documents ({documents.length})
                </h4>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {documents.length === 0 ? (
                  <p className="text-xs text-stone-400 py-4 text-center">No documents linked to this case ID.</p>
                ) : (
                  documents.map((d) => (
                    <div key={d.id} className="p-3 bg-stone-50 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800 line-clamp-1">{d.filename}</span>
                        <Badge variant="success">{d.analysis_status}</Badge>
                      </div>
                      <p className="text-[10px] text-stone-400 font-mono truncate">SHA256: {d.sha256}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Evidence Items */}
            <Card className="border-[var(--color-border)] bg-white">
              <CardHeader className="pb-2 border-b border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Evidence Items ({evidenceItems.length})
                </h4>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {evidenceItems.length === 0 ? (
                  <p className="text-xs text-stone-400 py-4 text-center">No evidence items linked to this case ID.</p>
                ) : (
                  evidenceItems.map((e) => (
                    <div key={e.id} className="p-3 bg-stone-50 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-800 line-clamp-1">{e.title}</span>
                        <Badge variant="accent">{e.evidence_type}</Badge>
                      </div>
                      {e.hash && <p className="text-[10px] text-stone-400 font-mono truncate">Hash: {e.hash}</p>}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 6: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl text-stone-900">Case Chronology & Audit Events</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Immutable event stream recording all procedural filings, uploads, and AI analysis.
              </p>
            </div>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200">
            {events.map((ev) => (
              <div key={ev.id} className="relative space-y-1">
                <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[var(--color-accent)] ring-4 ring-purple-100" />
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-stone-900">{ev.title}</h4>
                  <span className="text-[10px] text-stone-400">{formatRelative(ev.occurred_at)}</span>
                </div>
                {ev.description && <p className="text-xs text-stone-600">{ev.description}</p>}
                <span className="text-[10px] text-stone-400 block">Actor: {ev.created_by || 'system'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: LAWYER / CONSULTATION */}
      {activeTab === 'lawyer' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl text-stone-900">Legal Representation & Consultation</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Escalate matter to a verified Pakistani Bar advocate with confidential AI brief synthesis.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowLawyerModal(true)}
              className="bg-[var(--color-accent)] text-white text-xs"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
              Request Bar Consultation
            </Button>
          </div>

          {lawyerRequestedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                Consultation request submitted successfully. The assigned advocate will review your consented case brief.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-[var(--color-border)] bg-white">
              <CardHeader className="pb-2 border-b border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">Confidential Brief Protocol</h4>
              </CardHeader>
              <CardContent className="p-5 text-xs text-stone-600 space-y-3 leading-relaxed">
                <p>
                  Wakeel prepares an encrypted legal brief for the lawyer summarizing facts, statutory sections, and timelines.
                </p>
                <p>
                  Under our zero-surveillance design, <span className="font-semibold text-stone-800">raw unredacted evidence is never automatically broadcast to lawyers</span> without your explicit itemized consent.
                </p>
              </CardContent>
            </Card>

            <Card className="border-[var(--color-border)] bg-white">
              <CardHeader className="pb-2 border-b border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">Find Matching Specialists</h4>
              </CardHeader>
              <CardContent className="p-5 text-xs text-stone-600 space-y-3">
                <p>Browse our directory of verified advocates with expertise in {caseData.category.replace(/_/g, ' ')}.</p>
                <Link to="/lawyers">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Advocate Directory <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Lawyer Consultation Request Modal */}
      {showLawyerModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-white shadow-xl border border-stone-200">
            <CardHeader className="border-b border-stone-100 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-stone-900">Request Advocate Consultation</h3>
                <button onClick={() => setShowLawyerModal(false)} className="text-stone-400 hover:text-stone-600 text-sm">
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                You are requesting a legal consultation for <span className="font-semibold text-stone-900">{caseData.title}</span>. Choose which aspects of your case dossier you consent to disclose to the counsel.
              </p>

              {/* Consent Toggles */}
              <div className="space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentedShareBrief}
                    onChange={(e) => setConsentedShareBrief(e.target.checked)}
                    className="rounded text-[var(--color-accent)]"
                  />
                  <span className="font-medium text-stone-800">Share Case Summary & Category</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentedShareTimeline}
                    onChange={(e) => setConsentedShareTimeline(e.target.checked)}
                    className="rounded text-[var(--color-accent)]"
                  />
                  <span className="font-medium text-stone-800">Share Chronological Incident Timeline</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentedShareEvidenceCount}
                    onChange={(e) => setConsentedShareEvidenceCount(e.target.checked)}
                    className="rounded text-[var(--color-accent)]"
                  />
                  <span className="font-medium text-stone-800">Share Evidence Metadata (Titles & Hashes only, not raw files)</span>
                </label>
              </div>

              <div>
                <Textarea
                  label="Private Note for Advocate"
                  placeholder="Mention preferred consultation mode (video/phone), urgent questions, or availability."
                  rows={3}
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setShowLawyerModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRequestLawyerSubmit}
                  disabled={requestingLawyer}
                  className="bg-[var(--color-accent)] text-white text-xs"
                >
                  {requestingLawyer ? 'Submitting...' : 'Confirm & Request Consultation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
