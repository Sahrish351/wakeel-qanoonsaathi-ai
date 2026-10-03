// =============================================================
// WAKEEL — Core TypeScript Types
// =============================================================

// ─── USER ROLES ──────────────────────────────────────────────
export type UserRole = 'citizen' | 'lawyer' | 'admin';

// ─── LANGUAGE ────────────────────────────────────────────────
export type AppLanguage = 'en' | 'ur' | 'roman_ur';

// ─── URGENCY / RISK LEVELS ───────────────────────────────────
export type UrgencyLevel = 'emergency' | 'high' | 'moderate' | 'routine' | 'unknown';

// ─── CASE CATEGORIES ─────────────────────────────────────────
export type CaseCategory =
  | 'police_criminal'
  | 'cybercrime'
  | 'harassment_stalking'
  | 'womens_rights'
  | 'family'
  | 'property'
  | 'employment'
  | 'business_compliance'
  | 'consumer'
  | 'tax'
  | 'contract'
  | 'fraud_scam'
  | 'human_rights'
  | 'other';

// ─── CASE STATUS ─────────────────────────────────────────────
export type CaseStatus = 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';

// ─── CONSULTATION STATUS ──────────────────────────────────────
export type ConsultationStatus = 'pending' | 'accepted' | 'declined' | 'scheduled' | 'completed' | 'cancelled';

// ─── TASK STATUS ─────────────────────────────────────────────
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'cancelled';

// ─── TASK PRIORITY ───────────────────────────────────────────
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

// ─── EVIDENCE TYPE ───────────────────────────────────────────
export type EvidenceType =
  | 'screenshot'
  | 'photo'
  | 'video'
  | 'audio'
  | 'document'
  | 'message'
  | 'note'
  | 'other';

// ─── DOCUMENT ANALYSIS STATUS ────────────────────────────────
export type DocumentAnalysisStatus = 'pending' | 'processing' | 'complete' | 'failed' | 'unsupported';

// ─── SOURCE VERIFICATION STATUS ──────────────────────────────
export type SourceVerificationStatus = 'verified' | 'unverified' | 'under_review' | 'stale';

// ─── CONSULTATION MODE ────────────────────────────────────────
export type ConsultationMode = 'in_person' | 'video' | 'phone' | 'chat';

// ─── LAWYER AVAILABILITY ─────────────────────────────────────
export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

// ─── MESSAGE SENDER ──────────────────────────────────────────
export type MessageSenderType = 'user' | 'agent' | 'system';

// ─── AI CONFIDENCE LEVEL ─────────────────────────────────────
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unknown';

// ─── PROFILE ─────────────────────────────────────────────────
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  preferred_language: AppLanguage;
  province: string | null;
  city: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ─── CASE ────────────────────────────────────────────────────
export interface Case {
  id: string;
  user_id: string;
  title: string;
  category: CaseCategory;
  jurisdiction: string | null;
  urgency: UrgencyLevel;
  status: CaseStatus;
  summary: string | null;
  confidence: number | null;
  created_at: string;
  updated_at: string;
}

// ─── CASE FACT ───────────────────────────────────────────────
export interface CaseFact {
  id: string;
  case_id: string;
  fact_key: string;
  fact_value: string;
  confidence: number | null;
  source: string | null;
  created_at: string;
}

// ─── CASE EVENT ──────────────────────────────────────────────
export interface CaseEvent {
  id: string;
  case_id: string;
  event_type: string;
  title: string;
  description: string | null;
  occurred_at: string;
  created_by: string | null;
  created_at: string;
}

// ─── CONVERSATION ────────────────────────────────────────────
export interface Conversation {
  id: string;
  case_id: string | null;
  user_id: string;
  created_at: string;
}

// ─── MESSAGE ─────────────────────────────────────────────────
export interface Message {
  id: string;
  conversation_id: string;
  sender_type: MessageSenderType;
  content: string;
  structured_payload: AgentResponse | null;
  created_at: string;
}

// ─── DOCUMENT ────────────────────────────────────────────────
export interface Document {
  id: string;
  case_id: string | null;
  owner_id: string;
  storage_path: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  sha256: string;
  analysis_status: DocumentAnalysisStatus;
  created_at: string;
}

// ─── DOCUMENT EXTRACTION ─────────────────────────────────────
export interface DocumentExtraction {
  id: string;
  document_id: string;
  extracted_text: string | null;
  entities: ExtractedEntity[];
  dates: ExtractedDate[];
  deadlines: ExtractedDeadline[];
  referenced_laws: string[];
  confidence: ConfidenceLevel;
  created_at: string;
}

export interface ExtractedEntity {
  type: 'authority' | 'person' | 'organization' | 'reference_number' | 'location';
  value: string;
  confidence: number;
}

export interface ExtractedDate {
  label: string;
  value: string;
  confidence: number;
}

export interface ExtractedDeadline {
  label: string;
  due_date: string;
  description: string;
  confidence: number;
}

// ─── EVIDENCE ITEM ───────────────────────────────────────────
export interface EvidenceItem {
  id: string;
  case_id: string;
  document_id: string | null;
  title: string;
  description: string | null;
  evidence_type: EvidenceType;
  occurred_at: string | null;
  hash: string | null;
  created_at: string;
}

// ─── ACTION PLAN ─────────────────────────────────────────────
export interface ActionPlan {
  id: string;
  case_id: string;
  version: number;
  summary: string;
  actions_json: ActionPlanActions;
  sources_json: SourceReference[];
  confidence: ConfidenceLevel;
  created_at: string;
}

export interface ActionPlanActions {
  do_now: ActionItem[];
  do_next_24h: ActionItem[];
  do_next_7d: ActionItem[];
  avoid: string[];
  documents_needed: string[];
  who_to_contact: ContactItem[];
}

export interface ActionItem {
  title: string;
  description: string;
  why: string;
  source_ids: string[];
}

export interface ContactItem {
  name: string;
  type: 'emergency' | 'authority' | 'legal_aid' | 'lawyer' | 'other';
  phone?: string;
  url?: string;
  notes?: string;
}

// ─── TASK ────────────────────────────────────────────────────
export interface Task {
  id: string;
  case_id: string | null;
  user_id: string;
  title: string;
  due_at: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  source: string | null;
  created_at: string;
}

// ─── REMINDER ────────────────────────────────────────────────
export interface Reminder {
  id: string;
  task_id: string;
  user_id: string;
  remind_at: string;
  channel: 'in_app' | 'email';
  status: 'pending' | 'sent' | 'dismissed';
}

// ─── SOURCE ──────────────────────────────────────────────────
export interface Source {
  id: string;
  title: string;
  authority: string;
  jurisdiction: string;
  category: CaseCategory | string;
  url: string;
  excerpt: string | null;
  effective_date: string | null;
  last_reviewed_at: string | null;
  verification_status: SourceVerificationStatus;
  active: boolean;
}

// ─── SOURCE REFERENCE ────────────────────────────────────────
export interface SourceReference {
  source_id: string;
  title: string;
  authority: string;
  url: string;
  excerpt: string | null;
  relevance: string;
}

// ─── LAWYER ──────────────────────────────────────────────────
export interface Lawyer {
  id: string;
  profile_id: string;
  bio: string | null;
  specializations: CaseCategory[];
  province: string;
  city: string;
  languages: AppLanguage[];
  consultation_modes: ConsultationMode[];
  verified: boolean;
  availability_status: AvailabilityStatus;
  profile?: Profile;
  match_score?: number;
  match_reasons?: string[];
}

// ─── CONSULTATION ─────────────────────────────────────────────
export interface Consultation {
  id: string;
  case_id: string;
  user_id: string;
  lawyer_id: string;
  status: ConsultationStatus;
  requested_at: string;
  scheduled_at: string | null;
  consented_fields: string[];
  lawyer?: Lawyer;
  case?: Case;
}

// ─── FEEDBACK ────────────────────────────────────────────────
export interface Feedback {
  id: string;
  user_id: string;
  case_id: string | null;
  message_id: string | null;
  rating: 'helpful' | 'not_helpful' | 'unsafe' | 'request_review';
  comment: string | null;
  created_at: string;
}

// ─── AUDIT LOG ───────────────────────────────────────────────
export interface AuditLog {
  id: string;
  actor_id: string;
  actor_role: UserRole;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─── AI AGENT OUTPUT (structured JSON schema) ────────────────
export interface AgentResponse {
  summary: string;
  urgency: UrgencyLevel;
  what_i_understand: string[];
  what_i_need_to_know: WakeelQuestion[];
  do_now: ActionItem[];
  do_next: ActionItem[];
  avoid: string[];
  official_resources: OfficialResource[];
  lawyer_needed: boolean;
  why_human_review: string | null;
  sources: SourceReference[];
  confidence: ConfidenceLevel;
  disclaimer: string;
  create_tasks?: TaskRequest[];
  created_case_id?: string;
}

export interface WakeelQuestion {
  question: string;
  options?: string[];
  allow_skip: boolean;
  field_key: string;
}

export interface OfficialResource {
  name: string;
  type: string;
  phone?: string;
  url?: string;
  description: string;
  source_id: string;
}

export interface TaskRequest {
  title: string;
  due_at: string | null;
  priority: TaskPriority;
  source_reason: string;
}

// ─── UI STATE TYPES ──────────────────────────────────────────
export interface LoadingStateProps {
  isLoading?: boolean;
  message?: string;
  className?: string;
}

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// ─── PAGINATION ──────────────────────────────────────────────
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── FILE UPLOAD ─────────────────────────────────────────────
export interface UploadedFile {
  file: File;
  preview?: string;
  hash: string;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_EVIDENCE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'audio/mpeg',
  'audio/wav',
] as const;

export const MAX_FILE_SIZE_MB = 20;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
