import { supabase } from '@/lib/supabase/client';
import type { Case, Task, Source, Lawyer, EvidenceItem, Document, DocumentExtraction, Consultation, Conversation, Message } from '@/types';

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
