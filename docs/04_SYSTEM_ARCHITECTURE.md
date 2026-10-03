# WAKEEL — System Architecture

## 1. Recommended Stack

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui or a consistent accessible component layer
- Lucide icons
- Framer Motion for restrained motion
- Recharts for analytics

### Backend / Platform
- Supabase
  - PostgreSQL
  - Auth
  - Storage
  - Row Level Security
  - Edge Functions

### AI
- Gemini API
- Gemini model selected according to current Google API availability and task requirements.

**Important:** Gemini secret keys must never be exposed in browser code.

---

## 2. Architecture

```text
React Web App
    |
    | Supabase Auth
    v
Supabase
 ├── PostgreSQL
 ├── RLS
 ├── Storage
 └── Edge Functions
        |
        ├── Gemini Orchestrator
        ├── Source Retrieval
        ├── Document Analysis
        ├── Lawyer Matching
        ├── Notifications
        └── Audit Logging
```

---

## 3. Frontend Structure

Suggested:

```text
src/
  app/
  components/
  pages/
  layouts/
  features/
    auth/
    assistant/
    cases/
    evidence/
    documents/
    lawyers/
    reminders/
    resources/
    admin/
  lib/
    supabase/
    api/
    validation/
    formatting/
  hooks/
  types/
  assets/
```

---

## 4. Edge Functions

Suggested functions:

```text
ai-chat
ai-intake
ai-analyze-document
ai-create-action-plan
ai-create-lawyer-brief
search-legal-sources
match-lawyers
extract-deadlines
send-case-reminder
admin-review-source
```

All privileged operations happen server-side.

---

## 5. Environment Variables

Frontend-safe:
```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Server-side only:
```text
GEMINI_API_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never commit `.env`.

Never render secrets in logs.

---

## 6. Data Flow

### AI Chat
```text
User → React → Edge Function → validate auth
→ load case context
→ retrieve trusted sources
→ Gemini
→ validate structured output
→ save message/action
→ React renders cards
```

### Upload
```text
User → signed/upload flow → Supabase Storage
→ metadata row
→ secure document analysis function
→ extracted result
→ case timeline
```

### Lawyer request
```text
User → create consultation request
→ RLS check
→ lawyer receives limited brief
→ user sees status
```

---

## 7. Reliability

Use:
- request IDs;
- idempotency keys;
- timeout handling;
- retry for transient failures;
- safe fallbacks;
- structured logs;
- audit records for privileged actions.

---

## 8. Source Retrieval

Build a source registry with:
- authority;
- jurisdiction;
- category;
- URL;
- title;
- effective date;
- last reviewed;
- verification status;
- content/excerpt;
- active flag.

For a hackathon, the initial source set can be curated and manually verified. The architecture should support expansion.

---

## 9. Official Resource Examples

Current official examples to seed/verify:

- Punjab Police lists emergency 15 and Rescue 1122.
- Ministry of Human Rights provides 1099 for legal advice on human-rights violations.
- NCCIA provides an official cybercrime complaint portal and identifies 1799.

These values must be stored in the database/resource layer so they can be updated without redeploying the entire UI.

---

## 10. Deployment

Recommended:
- Frontend: Vercel or equivalent.
- Backend: Supabase.
- Gemini: Edge Function/server-side.

Production configuration:
- environment variables;
- domain;
- HTTPS;
- storage policies;
- database RLS;
- monitoring;
- error tracking.

---

## 11. Observability

Track:
- AI request success/failure;
- latency;
- source retrieval count;
- unsupported-claim flags;
- document processing errors;
- user-reported incorrect answers;
- security events.

Never log full sensitive legal conversations unnecessarily.
