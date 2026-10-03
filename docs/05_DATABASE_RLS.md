# WAKEEL — Database Schema & Supabase RLS

## 1. Design Principles

- Every user-owned record has `user_id`.
- Every lawyer-owned record has `lawyer_id`.
- Admin access is explicit.
- Sensitive case content is private by default.
- Lawyer access requires an explicit consultation/share relationship.
- AI service roles bypass RLS only in controlled server-side functions.

---

## 2. Tables

### profiles
- id UUID PK → auth.users.id
- full_name
- avatar_url
- preferred_language
- province
- city
- role
- created_at
- updated_at

### cases
- id
- user_id
- title
- category
- jurisdiction
- urgency
- status
- summary
- confidence
- created_at
- updated_at

### case_facts
- id
- case_id
- fact_key
- fact_value
- confidence
- source
- created_at

### case_events
- id
- case_id
- event_type
- title
- description
- occurred_at
- created_by
- created_at

### conversations
- id
- case_id
- user_id
- created_at

### messages
- id
- conversation_id
- sender_type
- content
- structured_payload
- created_at

### documents
- id
- case_id
- owner_id
- storage_path
- filename
- mime_type
- size_bytes
- sha256
- analysis_status
- created_at

### document_extractions
- id
- document_id
- extracted_text
- entities
- dates
- deadlines
- referenced_laws
- confidence
- created_at

### evidence_items
- id
- case_id
- document_id nullable
- title
- description
- evidence_type
- occurred_at
- hash
- created_at

### action_plans
- id
- case_id
- version
- summary
- actions_json
- sources_json
- confidence
- created_at

### tasks
- id
- case_id
- user_id
- title
- due_at
- priority
- status
- source
- created_at

### reminders
- id
- task_id
- user_id
- remind_at
- channel
- status

### sources
- id
- title
- authority
- jurisdiction
- category
- url
- excerpt
- effective_date
- last_reviewed_at
- verification_status
- active

### source_chunks
- id
- source_id
- chunk_text
- metadata_json
- embedding if vector search is implemented

### lawyers
- id
- profile_id
- bar/verification fields as legally appropriate
- bio
- specialization
- province
- city
- languages
- consultation_modes
- verified
- availability_status

### lawyer_specializations
- lawyer_id
- category

### lawyer_availability
- lawyer_id
- day
- start_time
- end_time

### consultations
- id
- case_id
- user_id
- lawyer_id
- status
- requested_at
- scheduled_at
- consented_fields

### source_reviews
- id
- source_id
- reviewer_id
- decision
- notes
- reviewed_at

### feedback
- id
- user_id
- case_id
- message_id
- rating
- type
- comment
- created_at

### audit_logs
- id
- actor_id
- actor_role
- action
- entity_type
- entity_id
- metadata
- created_at

---

## 3. RLS Rules

### Users
Can read/update their own profile.

### Cases
User can CRUD own cases.

### Messages
User can access messages belonging to own cases.

### Documents
Owner only unless explicitly shared through a valid consultation relationship.

### Evidence
Owner only.

### Action plans
Owner only.

### Tasks/reminders
Owner only.

### Sources
Authenticated users can read active verified sources.
Only admins can create/update/deactivate.

### Lawyers
Public profile fields can be readable.
Private verification fields must be admin/lawyer-only.

### Consultations
User sees own requests.
Lawyer sees requests assigned to them.
Admin can audit.

### Audit logs
Admin/security roles only.

---

## 4. Storage Policies

Buckets:
- `avatars`
- `case-documents`
- `evidence`

Private buckets for legal material.

Use signed URLs.

Do not expose raw storage paths publicly.

---

## 5. Indexes

Add indexes for:
- cases(user_id, updated_at)
- case_events(case_id, occurred_at)
- tasks(user_id, due_at)
- sources(jurisdiction, category, active)
- lawyers(province, city, verified)
- consultations(lawyer_id, status)
- audit_logs(actor_id, created_at)

---

## 6. Data Retention

Provide:
- delete case;
- delete document;
- delete evidence;
- export case data;
- account deletion workflow.

Any retention period must be communicated clearly and implemented consistently.

---

## 7. Demo Data

Demo data must be explicitly labeled:
**Demo / Synthetic**

Never create fake real-world lawyer credentials or pretend demo cases are real.
