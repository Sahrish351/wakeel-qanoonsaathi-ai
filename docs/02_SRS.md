# WAKEEL — Software Requirements Specification (SRS)

## 1. Purpose

This document defines functional and non-functional requirements for Wakeel — QanoonSaathi AI.

---

## 2. Actors

### Citizen
Can create cases, chat with the agent, upload documents/evidence, manage tasks, view sources, request lawyer recommendations and consultations.

### Lawyer
Can create a professional profile, complete verification, manage availability, review consultation requests and prepare client notes.

### Admin
Manages users, lawyers, sources, safety escalations, reports, content review and audit logs.

### AI Agent
Acts as an orchestration layer. It does not have independent legal authority.

---

## 3. Functional Requirements

### FR-001 Authentication
- Register/login with email and password.
- Password reset.
- Email verification.
- Session persistence using Supabase Auth.
- No localStorage authentication bypass.
- Role-based routing.

### FR-002 Onboarding
Collect only necessary information:
- name;
- preferred language;
- province/city;
- optional occupation;
- optional age band;
- safety preferences.

Do not require sensitive information unless necessary for a specific workflow.

### FR-003 New Case
User can create a case by:
- typing;
- voice;
- document upload;
- image upload;
- guided category selection.

### FR-004 Case Intake
Agent asks only relevant questions. Questions must be generated from missing facts rather than a generic long questionnaire.

### FR-005 Case Classification
Possible categories:
- Police / criminal procedure
- Cybercrime
- Harassment / stalking
- Women's rights / safety
- Family
- Property
- Employment
- Business / compliance
- Consumer
- Tax
- Contract
- Fraud / scam
- Human rights
- Other

### FR-006 Jurisdiction
Ask for:
- province/territory;
- city/district when relevant;
- country;
- incident location;
- authority involved.

Never assume Punjab law applies everywhere in Pakistan.

### FR-007 Risk Triage
Risk levels:
- Emergency
- High
- Moderate
- Routine
- Unknown

Emergency handling must be conservative and safety-first.

### FR-008 Document Analyzer
Accept:
- PDF;
- JPG/PNG/WebP;
- supported text documents if implemented.

Extract:
- dates;
- names;
- authority;
- reference numbers;
- deadlines;
- allegations/requests;
- mentioned laws/sections;
- requested action;
- missing pages.

### FR-009 Evidence Vault
- Upload;
- preview;
- metadata;
- hash;
- tag;
- timeline link;
- delete/export controls.

### FR-010 Action Plan
Generate:
- immediate action;
- next 24 hours;
- next 7 days;
- documents/evidence;
- who to contact;
- questions to ask;
- escalation triggers.

### FR-011 Source Grounding
Legal answers should be generated from a curated source layer.

Source priority:
1. official government sources;
2. official legislation/gazettes/court material where available;
3. official authority portals;
4. reputable legal-aid organizations;
5. carefully reviewed secondary sources only when needed.

### FR-012 Lawyer Matching
Score candidates using:
- specialization;
- jurisdiction;
- location;
- language;
- availability;
- verified status;
- consultation mode.

Explain why each lawyer was recommended.

### FR-013 Consultation
User can send a structured brief to a lawyer.

### FR-014 Reminders
Create reminders from:
- extracted deadlines;
- user tasks;
- agent action plans.

### FR-015 Timeline
All meaningful case events appear chronologically.

### FR-016 Notifications
In-app notifications are required.
Email notifications may be implemented for non-sensitive reminders.
Sensitive notification previews must be minimized.

### FR-017 Search
Search:
- legal topics;
- official resources;
- lawyers;
- user's own cases.

### FR-018 Feedback
After an AI answer:
- helpful;
- not helpful;
- unsafe/incorrect;
- request human review.

### FR-019 Admin Source Management
Admin can:
- add source;
- mark source verified;
- assign jurisdiction;
- assign category;
- set review date;
- deactivate stale source.

### FR-020 Audit Log
Record sensitive admin/security events.

---

## 4. Non-Functional Requirements

### Performance
- Fast route transitions.
- Lazy-load heavy document views.
- Compress images.
- Paginate large lists.
- Cache safe public source metadata.

### Accessibility
- WCAG-oriented contrast.
- keyboard navigation;
- visible focus;
- semantic headings;
- labels for controls;
- screen-reader-friendly alerts.

### Security
- Supabase RLS;
- least privilege;
- no service-role key in browser;
- secrets in environment/server-side functions;
- file access controlled through signed URLs;
- validation at client and server boundaries.

### Reliability
- retry transient AI/source failures;
- idempotent case actions;
- graceful degradation;
- clear error messages.

### Privacy
- data minimization;
- user-controlled deletion;
- sensitive content encrypted in transit and at rest by platform infrastructure;
- explicit consent for lawyer sharing;
- no training on user content unless a future policy explicitly permits it and the user consents.

---

## 5. Error States

Every major page needs:
- loading;
- empty;
- permission denied;
- not found;
- validation error;
- network failure;
- AI unavailable;
- source unavailable;
- upload failure;
- unsupported file;
- session expired.

Never show a blank page.

---

## 6. AI Failure Behavior

If grounded sources cannot support a legal claim:
> "I couldn't verify this point from the trusted sources available to me. I can still help you organize the facts and prepare questions for a licensed lawyer."

If document quality is poor:
> "I can see that a document was uploaded, but I can't reliably read enough of it to interpret it."

If high-risk:
> "This situation may require urgent human/legal support. I can help you prepare the information to take to the appropriate service."

---

## 7. Acceptance Criteria

A feature passes only when:
- its happy path works;
- its failure path works;
- unauthorized access is blocked;
- data persists;
- refresh does not destroy state;
- mobile layout works;
- no console errors remain;
- AI responses are grounded where required;
- no fake data is presented as real.
