import { supabase } from '@/lib/supabase/client';
import type {
  Case,
  CaseFact,
  CaseEvent,
  Task,
  Source,
  Lawyer,
  EvidenceItem,
  Document,
  DocumentExtraction,
  Consultation,
  Conversation,
  Message,
  ActionPlan,
  ActionPlanActions,
  SourceReference,
  TaskPriority,
  TaskStatus,
  CaseCategory,
  UrgencyLevel,
  CaseStatus,
  ConsultationStatus,
  ConfidenceLevel,
  Profile,
} from '@/types';

// ============================================================================
// SOURCES SERVICE (Database Registry as primary, verified statutes)
// ============================================================================
export async function getVerifiedSources(): Promise<Source[]> {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('active', true)
    .eq('verification_status', 'verified')
    .order('title', { ascending: true });

  if (error) {
    console.warn('[sourcesService] Failed to load sources from DB:', error.message);
    return [];
  }
  return data as Source[];
}

// ============================================================================
// CONVERSATIONS & CHAT SERVICE
// ============================================================================
export async function getOrCreateActiveConversation(caseId?: string | null): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  // Try finding the most recent conversation for this user
  let query = supabase
    .from('conversations')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1);

  if (caseId) {
    query = query.eq('case_id', caseId);
  }

  const { data: existing } = await query;
  if (existing && existing.length > 0) {
    return existing[0].id;
  }

  // Create new conversation
  const { data: created, error } = await supabase
    .from('conversations')
    .insert({
      user_id: user.id,
      case_id: caseId || null,
    })
    .select('id')
    .single();

  if (error || !created) {
    throw new Error(error?.message || 'Failed to create conversation session');
  }

  return created.id;
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.warn('[chatService] Error loading messages:', error.message);
    return [];
  }
  return data as Message[];
}

export async function persistChatMessage(params: {
  conversationId: string;
  senderType: 'user' | 'agent' | 'system';
  content: string;
  structuredPayload?: any;
}): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: params.conversationId,
      sender_type: params.senderType,
      content: params.content,
      structured_payload: params.structuredPayload || null,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to persist message');
  }
  return data as Message;
}

// ============================================================================
// EVIDENCE VAULT SERVICE
// ============================================================================
export async function getUserEvidence(caseId?: string): Promise<EvidenceItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Query evidence through cases owned by auth.uid()
  let query = supabase
    .from('evidence_items')
    .select(`
      *,
      cases!inner(user_id)
    `)
    .eq('cases.user_id', user.id)
    .order('created_at', { ascending: false });

  if (caseId) {
    query = query.eq('case_id', caseId);
  }

  const { data, error } = await query;
  if (error) {
    console.warn('[evidenceService] Error fetching evidence:', error.message);
    return [];
  }
  return data as EvidenceItem[];
}

export async function uploadAndRecordEvidence(params: {
  file: File;
  title: string;
  category: string;
  hash: string;
  description?: string;
  caseId?: string;
}): Promise<EvidenceItem> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  // Ensure user has at least one active case for evidence containment
  let targetCaseId = params.caseId;
  if (!targetCaseId) {
    const { data: cases } = await supabase
      .from('cases')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (cases && cases.length > 0) {
      targetCaseId = cases[0].id;
    } else {
      // Auto-create a general case container
      const { data: newCase, error: caseErr } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
          title: 'General Legal Vault',
          category: 'other',
          urgency: 'routine',
          status: 'open',
        })
        .select('id')
        .single();

      if (caseErr || !newCase) throw new Error('Could not establish case container for evidence.');
      targetCaseId = newCase.id;
    }
  }

  // 1. Upload to private 'evidence' bucket at path: <userId>/<timestamp>_<filename>
  const safeName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${user.id}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from('evidence')
    .upload(storagePath, params.file, {
      contentType: params.file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  // 2. Insert record into public.evidence_items
  const { data: item, error: itemError } = await supabase
    .from('evidence_items')
    .insert({
      case_id: targetCaseId,
      title: params.title,
      description: params.description || null,
      evidence_type: params.file.type.includes('image') ? 'screenshot' : 'document',
      occurred_at: new Date().toISOString(),
      hash: params.hash,
    })
    .select('*')
    .single();

  if (itemError || !item) {
    throw new Error(`Failed to record evidence item: ${itemError?.message}`);
  }

  return item as EvidenceItem;
}

export async function deleteEvidenceRecord(evidenceId: string): Promise<void> {
  const { error } = await supabase
    .from('evidence_items')
    .delete()
    .eq('id', evidenceId);

  if (error) {
    throw new Error(error.message);
  }
}

// ============================================================================
// DOCUMENT ANALYZER SERVICE
// ============================================================================
export async function uploadAndAnalyzeDocument(params: {
  file: File;
  caseId?: string;
}): Promise<{ document: Document; extraction: any }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  // 1. Upload to private 'case-documents' bucket
  const safeName = params.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${user.id}/${Date.now()}_${safeName}`;

  const { error: uploadErr } = await supabase.storage
    .from('case-documents')
    .upload(storagePath, params.file, {
      contentType: params.file.type,
      upsert: false,
    });

  if (uploadErr) {
    throw new Error(`Document upload failed: ${uploadErr.message}`);
  }

  // 2. Record in public.documents
  const { data: doc, error: docErr } = await supabase
    .from('documents')
    .insert({
      owner_id: user.id,
      case_id: params.caseId || null,
      storage_path: storagePath,
      filename: params.file.name,
      mime_type: params.file.type,
      size_bytes: params.file.size,
      sha256: 'pending',
      analysis_status: 'processing',
    })
    .select('*')
    .single();

  if (docErr || !doc) {
    throw new Error(`Database record failed: ${docErr?.message}`);
  }

  // 3. Convert to base64 for Edge Function analysis
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(params.file);
  });
  const fileBase64 = await base64Promise;

  // 4. Call secured ai-analyze-document Edge Function
  const { data: extractionData, error: edgeErr } = await supabase.functions.invoke('ai-analyze-document', {
    body: {
      fileBase64,
      mimeType: params.file.type,
      fileName: params.file.name,
    },
  });

  if (edgeErr || !extractionData) {
    await supabase.from('documents').update({ analysis_status: 'failed' }).eq('id', doc.id);
    throw new Error(edgeErr?.message || 'AI document extraction failed');
  }

  // 5. Persist extractions in public.document_extractions
  const { data: savedExtraction } = await supabase
    .from('document_extractions')
    .insert({
      document_id: doc.id,
      extracted_text: extractionData.plain_summary || '',
      entities: extractionData.parties_involved ? extractionData.parties_involved.map((p: string) => ({ type: 'person', value: p, confidence: 0.9 })) : [],
      dates: extractionData.dates || [],
      deadlines: extractionData.deadlines || [],
      referenced_laws: extractionData.referenced_laws || [],
      confidence: extractionData.confidence || 'high',
    })
    .select('*')
    .single();

  await supabase.from('documents').update({ analysis_status: 'complete' }).eq('id', doc.id);

  return { document: doc as Document, extraction: savedExtraction || extractionData };
}

// ============================================================================
// LAWYERS & CONSULTATIONS SERVICE
// ============================================================================
export async function getVerifiedLawyers(province?: string): Promise<any[]> {
  let query = supabase
    .from('lawyers')
    .select(`
      id,
      bio,
      province,
      city,
      languages,
      consultation_modes,
      verified,
      availability_status,
      profiles!inner (
        full_name,
        avatar_url
      ),
      lawyer_specializations (
        category
      )
    `)
    .eq('verified', true);

  if (province && province !== 'All') {
    query = query.eq('province', province);
  }

  const { data, error } = await query;
  if (error) {
    console.warn('[lawyersService] Error fetching lawyers from DB:', error.message);
    return [];
  }

  return (data || []).map((l: any) => ({
    id: l.id,
    name: l.profiles?.full_name || 'Advocate',
    province: l.province,
    city: l.city,
    specialization: (l.lawyer_specializations || []).map((s: any) => s.category).join(', ') || 'General Law',
    experience_years: 10,
    consultation_modes: l.consultation_modes || ['phone'],
    languages: l.languages || ['en', 'ur'],
    bio: l.bio || '[DEMO PROFILE] High Court Advocate',
    match_score: 95,
    match_reasons: ['Licensed Bar Advocate', 'Active jurisdiction match', 'Confidential brief handling']
  }));
}

export async function createConsultationRequest(params: {
  lawyerId: string;
  notes?: string;
  caseId?: string;
}): Promise<Consultation> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  let targetCaseId = params.caseId;
  if (!targetCaseId) {
    const { data: cases } = await supabase
      .from('cases')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (cases && cases.length > 0) {
      targetCaseId = cases[0].id;
    } else {
      const { data: newCase, error: caseErr } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
          title: 'Consultation Matter',
          category: 'other',
          urgency: 'routine',
          status: 'open',
        })
        .select('id')
        .single();

      if (caseErr || !newCase) throw new Error('Could not create consultation case container');
      targetCaseId = newCase.id;
    }
  }

  const { data, error } = await supabase
    .from('consultations')
    .insert({
      case_id: targetCaseId,
      user_id: user.id,
      lawyer_id: params.lawyerId,
      status: 'pending',
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to submit consultation request');
  }
  return data as Consultation;
}

// ============================================================================
// CITIZEN DASHBOARD SERVICE (Live Database Querying)
// ============================================================================
export async function getCitizenDashboardData() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { cases: [], tasks: [], consultations: [] };

  const [casesRes, tasksRes, consultsRes] = await Promise.all([
    supabase
      .from('cases')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false }),
    supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('due_at', { ascending: true }),
    supabase
      .from('consultations')
      .select(`
        *,
        lawyers (
          province,
          city,
          profiles (full_name)
        )
      `)
      .eq('user_id', user.id)
      .order('requested_at', { ascending: false })
  ]);

  return {
    cases: (casesRes.data || []) as Case[],
    tasks: (tasksRes.data || []) as Task[],
    consultations: (consultsRes.data || []) as any[],
  };
}

// ============================================================================
// CASE MANAGEMENT SERVICE (public.cases)
// ============================================================================
export async function createCase(params: {
  title: string;
  category: CaseCategory;
  jurisdiction?: string;
  urgency?: UrgencyLevel;
  summary?: string;
  confidence?: number;
  initialFacts?: Array<{ fact_key: string; fact_value: string; source?: string; confidence?: number }>;
  initialEvent?: { title: string; description?: string; event_type?: string };
}): Promise<Case> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  // Insert case
  const { data: newCase, error: caseErr } = await supabase
    .from('cases')
    .insert({
      user_id: user.id,
      title: params.title,
      category: params.category,
      jurisdiction: params.jurisdiction || 'Pakistan',
      urgency: params.urgency || 'routine',
      status: 'open',
      summary: params.summary || null,
      confidence: params.confidence !== undefined ? params.confidence : 0.85,
    })
    .select('*')
    .single();

  if (caseErr || !newCase) {
    throw new Error(caseErr?.message || 'Failed to create case');
  }

  // Insert initial facts if provided
  if (params.initialFacts && params.initialFacts.length > 0) {
    const factsToInsert = params.initialFacts.map(f => ({
      case_id: newCase.id,
      fact_key: f.fact_key,
      fact_value: f.fact_value,
      source: f.source || 'user_intake',
      confidence: f.confidence !== undefined ? f.confidence : 1.0,
    }));
    await supabase.from('case_facts').insert(factsToInsert);
  }

  // Insert creation event into timeline
  await supabase.from('case_events').insert({
    case_id: newCase.id,
    event_type: params.initialEvent?.event_type || 'case_created',
    title: params.initialEvent?.title || 'Case Opened',
    description: params.initialEvent?.description || `Initial intake completed in ${params.category.replace(/_/g, ' ')}.`,
    occurred_at: new Date().toISOString(),
    created_by: 'citizen_intake',
  });

  return newCase as Case;
}

export async function getUserCases(options?: {
  category?: string;
  status?: string;
  search?: string;
}): Promise<Case[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('cases')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (options?.category && options.category !== 'all') {
    query = query.eq('category', options.category);
  }
  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }
  if (options?.search && options.search.trim()) {
    query = query.ilike('title', `%${options.search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.warn('[getUserCases] Error loading cases:', error.message);
    return [];
  }
  return (data || []) as Case[];
}

export async function getCaseById(caseId: string): Promise<Case | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('id', caseId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.warn('[getCaseById] Error loading case:', error.message);
    return null;
  }
  return data as Case | null;
}

export async function updateCase(
  caseId: string,
  updates: Partial<Pick<Case, 'title' | 'category' | 'jurisdiction' | 'urgency' | 'status' | 'summary'>>
): Promise<Case> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('cases')
    .update(updates)
    .eq('id', caseId)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update case');
  }

  // Record status change event if status updated
  if (updates.status) {
    await supabase.from('case_events').insert({
      case_id: caseId,
      event_type: 'status_changed',
      title: `Status changed to ${updates.status.replace(/_/g, ' ')}`,
      description: 'Case status was updated by user.',
      occurred_at: new Date().toISOString(),
      created_by: 'user',
    });
  }

  return data as Case;
}

export async function deleteCase(caseId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const { error } = await supabase
    .from('cases')
    .delete()
    .eq('id', caseId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message || 'Failed to delete case');
  }
}

// ============================================================================
// CASE FACTS SERVICE (public.case_facts)
// ============================================================================
export async function getCaseFacts(caseId: string): Promise<CaseFact[]> {
  const { data, error } = await supabase
    .from('case_facts')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: true });

  if (error) {
    console.warn('[getCaseFacts] Error:', error.message);
    return [];
  }
  return (data || []) as CaseFact[];
}

export async function createCaseFact(params: {
  case_id: string;
  fact_key: string;
  fact_value: string;
  source?: string;
  confidence?: number;
}): Promise<CaseFact> {
  const { data, error } = await supabase
    .from('case_facts')
    .insert({
      case_id: params.case_id,
      fact_key: params.fact_key,
      fact_value: params.fact_value,
      source: params.source || 'user',
      confidence: params.confidence !== undefined ? params.confidence : 1.0,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to record case fact');
  }

  // Record timeline event
  await supabase.from('case_events').insert({
    case_id: params.case_id,
    event_type: 'fact_added',
    title: `Fact Added: ${params.fact_key}`,
    description: params.fact_value,
    occurred_at: new Date().toISOString(),
    created_by: params.source || 'user',
  });

  return data as CaseFact;
}

export async function deleteCaseFact(factId: string, caseId: string): Promise<void> {
  const { error } = await supabase
    .from('case_facts')
    .delete()
    .eq('id', factId);

  if (error) {
    throw new Error(error.message || 'Failed to remove fact');
  }
}

// ============================================================================
// CASE EVENTS & TIMELINE (public.case_events)
// ============================================================================
export async function getCaseEvents(caseId: string): Promise<CaseEvent[]> {
  const { data, error } = await supabase
    .from('case_events')
    .select('*')
    .eq('case_id', caseId)
    .order('occurred_at', { ascending: false });

  if (error) {
    console.warn('[getCaseEvents] Error:', error.message);
    return [];
  }
  return (data || []) as CaseEvent[];
}

export async function createCaseEvent(params: {
  case_id: string;
  event_type: string;
  title: string;
  description?: string;
  occurred_at?: string;
  created_by?: string;
}): Promise<CaseEvent> {
  const { data, error } = await supabase
    .from('case_events')
    .insert({
      case_id: params.case_id,
      event_type: params.event_type,
      title: params.title,
      description: params.description || null,
      occurred_at: params.occurred_at || new Date().toISOString(),
      created_by: params.created_by || 'user',
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to add timeline event');
  }
  return data as CaseEvent;
}

export async function getAllUserCaseEvents(): Promise<(CaseEvent & { case_title?: string })[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('case_events')
    .select(`
      *,
      cases!inner (
        title,
        user_id
      )
    `)
    .eq('cases.user_id', user.id)
    .order('occurred_at', { ascending: false })
    .limit(50);

  if (error) {
    console.warn('[getAllUserCaseEvents] Error:', error.message);
    return [];
  }

  return (data || []).map((item: any) => ({
    ...item,
    case_title: item.cases?.title || 'Case',
  }));
}

// ============================================================================
// ACTION PLANS SERVICE (public.action_plans)
// ============================================================================
export async function getCaseActionPlan(caseId: string): Promise<ActionPlan | null> {
  const { data, error } = await supabase
    .from('action_plans')
    .select('*')
    .eq('case_id', caseId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn('[getCaseActionPlan] Error:', error.message);
    return null;
  }
  return data as ActionPlan | null;
}

export async function saveActionPlan(params: {
  case_id: string;
  summary: string;
  actions_json: ActionPlanActions;
  sources_json: SourceReference[];
  confidence?: ConfidenceLevel;
}): Promise<ActionPlan> {
  // Check current version
  const { data: existing } = await supabase
    .from('action_plans')
    .select('version')
    .eq('case_id', params.case_id)
    .order('version', { ascending: false })
    .limit(1);

  const nextVersion = existing && existing.length > 0 ? (existing[0].version + 1) : 1;

  const { data, error } = await supabase
    .from('action_plans')
    .insert({
      case_id: params.case_id,
      version: nextVersion,
      summary: params.summary,
      actions_json: params.actions_json,
      sources_json: params.sources_json,
      confidence: params.confidence || 'high',
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to save action plan');
  }

  // Record timeline event
  await supabase.from('case_events').insert({
    case_id: params.case_id,
    event_type: 'action_plan_generated',
    title: `Action Plan Generated (v${nextVersion})`,
    description: params.summary.substring(0, 150) + (params.summary.length > 150 ? '...' : ''),
    occurred_at: new Date().toISOString(),
    created_by: 'ai_agent',
  });

  return data as ActionPlan;
}

// ============================================================================
// TASKS & REMINDERS SERVICE (public.tasks)
// ============================================================================
export async function getUserTasks(caseId?: string): Promise<(Task & { case_title?: string })[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('tasks')
    .select(`
      *,
      cases (
        title
      )
    `)
    .eq('user_id', user.id)
    .order('due_at', { ascending: true, nullsFirst: false });

  if (caseId) {
    query = query.eq('case_id', caseId);
  }

  const { data, error } = await query;
  if (error) {
    console.warn('[getUserTasks] Error:', error.message);
    return [];
  }

  return (data || []).map((t: any) => ({
    ...t,
    case_title: t.cases?.title || undefined,
  }));
}

export async function createTask(params: {
  case_id?: string | null;
  title: string;
  due_at?: string | null;
  priority?: TaskPriority;
  source?: string;
}): Promise<Task> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      case_id: params.case_id || null,
      title: params.title,
      due_at: params.due_at || null,
      priority: params.priority || 'medium',
      status: 'pending',
      source: params.source || 'manual',
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create task');
  }

  if (params.case_id) {
    await supabase.from('case_events').insert({
      case_id: params.case_id,
      event_type: 'task_created',
      title: `Task Added: ${params.title}`,
      description: params.due_at ? `Due by ${new Date(params.due_at).toLocaleDateString()}` : undefined,
      occurred_at: new Date().toISOString(),
      created_by: params.source || 'user',
    });
  }

  return data as Task;
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .eq('user_id', user.id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update task');
  }

  if (data.case_id && status === 'done') {
    await supabase.from('case_events').insert({
      case_id: data.case_id,
      event_type: 'task_completed',
      title: `Task Completed: ${data.title}`,
      occurred_at: new Date().toISOString(),
      created_by: 'user',
    });
  }

  return data as Task;
}

export async function deleteTask(taskId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message || 'Failed to delete task');
  }
}

// ============================================================================
// CASE LINKED DOCUMENTS & EVIDENCE
// ============================================================================
export async function getCaseDocuments(caseId: string): Promise<Document[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('case_id', caseId)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[getCaseDocuments] Error:', error.message);
    return [];
  }
  return (data || []) as Document[];
}

export async function getCaseEvidenceItems(caseId: string): Promise<EvidenceItem[]> {
  const { data, error } = await supabase
    .from('evidence_items')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[getCaseEvidenceItems] Error:', error.message);
    return [];
  }
  return (data || []) as EvidenceItem[];
}

// ============================================================================
// LAWYER PORTAL SERVICE (Verified Bar Advocates Workspace)
// ============================================================================
export async function getLawyerProfileByAuthUser(): Promise<any | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('lawyers')
    .select(`
      *,
      profiles:profile_id (*)
    `)
    .eq('profile_id', user.id)
    .maybeSingle();

  if (error) {
    console.warn('[getLawyerProfile] Error:', error.message);
    return null;
  }
  return data;
}

export async function updateLawyerProfile(
  lawyerId: string,
  updates: {
    bio?: string;
    province?: string;
    city?: string;
    languages?: string[];
    consultation_modes?: string[];
    availability_status?: 'available' | 'busy' | 'unavailable';
  }
): Promise<any> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const { data, error } = await supabase
    .from('lawyers')
    .update(updates)
    .eq('id', lawyerId)
    .eq('profile_id', user.id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update lawyer profile');
  }
  return data;
}

export async function getLawyerAssignedConsultations(): Promise<any[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Lawyer sees assigned consultations through lawyers.profile_id = auth.uid()
  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      cases (
        id,
        title,
        category,
        urgency,
        summary
      ),
      profiles:user_id (
        full_name,
        province,
        city
      )
    `)
    .order('requested_at', { ascending: false });

  if (error) {
    console.warn('[getLawyerAssignedConsultations] Error:', error.message);
    return [];
  }
  return data || [];
}

export async function updateConsultationStatus(
  consultationId: string,
  status: ConsultationStatus,
  scheduledAt?: string | null
): Promise<Consultation> {
  const updates: any = { status };
  if (scheduledAt !== undefined) {
    updates.scheduled_at = scheduledAt;
  }

  const { data, error } = await supabase
    .from('consultations')
    .update(updates)
    .eq('id', consultationId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update consultation status');
  }

  // Also log case event if associated with case
  if (data.case_id) {
    await supabase.from('case_events').insert({
      case_id: data.case_id,
      event_type: 'lawyer_response',
      title: `Consultation Status: ${status}`,
      description: scheduledAt ? `Scheduled for ${new Date(scheduledAt).toLocaleString()}` : `Lawyer updated request status to ${status}.`,
      occurred_at: new Date().toISOString(),
      created_by: 'lawyer',
    });
  }

  return data as Consultation;
}

// ============================================================================
// ADMIN WORKFLOW SERVICES (Statutory Sources, Lawyers, Audit)
// ============================================================================
export async function getAdminSources(): Promise<Source[]> {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[getAdminSources] Error:', error.message);
    return [];
  }
  return (data || []) as Source[];
}

export async function createAdminSource(source: Omit<Source, 'id'>): Promise<Source> {
  const { data, error } = await supabase
    .from('sources')
    .insert(source)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create source');
  }
  return data as Source;
}

export async function updateAdminSource(id: string, updates: Partial<Source>): Promise<Source> {
  const { data, error } = await supabase
    .from('sources')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update source');
  }
  return data as Source;
}

export async function deleteAdminSource(id: string): Promise<void> {
  const { error } = await supabase
    .from('sources')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message || 'Failed to delete source');
  }
}

export async function getAdminLawyers(): Promise<any[]> {
  const { data, error } = await supabase
    .from('lawyers')
    .select(`
      *,
      profiles:profile_id (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[getAdminLawyers] Error:', error.message);
    return [];
  }
  return data || [];
}

export async function setLawyerVerificationStatus(lawyerId: string, verified: boolean): Promise<any> {
  const { data, error } = await supabase
    .from('lawyers')
    .update({ verified })
    .eq('id', lawyerId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to update lawyer verification status');
  }
  return data;
}

export async function getAdminAuditLogs(): Promise<any[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      profiles:actor_id (
        full_name,
        role
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.warn('[getAdminAuditLogs] Error:', error.message);
    return [];
  }
  return data || [];
}

export async function getAdminUsers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('[getAdminUsers] Error:', error.message);
    return [];
  }
  return (data || []) as Profile[];
}

