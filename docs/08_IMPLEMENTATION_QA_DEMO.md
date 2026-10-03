# WAKEEL — Implementation Plan, QA & Hackathon Demo

## 1. Build Strategy

Antigravity must build in phases. Do not generate the entire application in one uncontrolled pass.

### Phase 0 — Read Specs
Read:
- PRD
- SRS
- Agentic AI Spec
- Architecture
- Database/RLS
- UI/UX
- Security
- QA/Demo

Then produce a short implementation checklist.

### Phase 1 — Foundation
- React/Vite/TypeScript
- Tailwind
- routing
- design tokens
- reusable components
- Supabase client
- Auth
- error boundary

### Phase 2 — Database/Auth
- migrations
- RLS
- storage buckets
- seed/demo data
- role routing

### Phase 3 — Premium Public Website
Build the full landing experience before the dashboard.

### Phase 4 — AI Core
Implement:
- intake;
- classification;
- missing facts;
- source retrieval;
- action plan;
- structured output;
- uncertainty.

### Phase 5 — Case System
- cases;
- timeline;
- tasks;
- reminders;
- evidence;
- document analyzer.

### Phase 6 — Lawyer Network
- profiles;
- verification;
- matching;
- consultation requests.

### Phase 7 — Safety/Admin
- safety center;
- admin source manager;
- lawyer verification;
- audit.

### Phase 8 — Polish
- responsive QA;
- accessibility;
- loading states;
- error states;
- animations;
- image optimization;
- performance.

---

## 2. Demo Accounts

Create clearly labeled synthetic demo accounts:
- Citizen
- Lawyer
- Admin

Never use real personal data.

---

## 3. Demo Case Data

Prepare synthetic scenarios:
1. Cyber blackmail.
2. Police/authority call.
3. Business compliance notice.
4. Workplace harassment.
5. Women's safety/harassment.

---

## 4. Golden Demo: Cyber Blackmail

User:
> "Someone is threatening to share my private photos unless I pay."

Wakeel:
1. Detects high risk.
2. Checks immediate physical safety.
3. Advises not to pay/engage recklessly.
4. Guides evidence preservation.
5. Guides account security.
6. Identifies official cybercrime reporting resource.
7. Builds incident timeline.
8. Creates action checklist.
9. Offers lawyer brief.

This is a strong demonstration because the AI performs multiple actions.

---

## 5. Golden Demo: Police Contact

User:
> "A person calling from a police station told me to come tonight. I don't know why."

Wakeel:
- does not say "ignore it";
- asks whether caller identified station/name/rank/reference;
- asks whether any written notice or case reference was provided;
- assesses immediate safety;
- explains that legal requirements depend on facts and jurisdiction;
- suggests verification;
- recommends human legal help if risk is material;
- creates a checklist.

---

## 6. Golden Demo: Business Notice

Upload a synthetic notice.

Show:
- OCR/extraction;
- authority;
- reference number;
- deadline;
- requested documents;
- plain-language summary;
- uncertainty;
- action plan;
- lawyer recommendation.

---

## 7. QA Checklist

### Functional
- [ ] Auth works.
- [ ] Logout works.
- [ ] Password reset works.
- [ ] RLS blocks unauthorized case access.
- [ ] Upload works.
- [ ] Delete works.
- [ ] AI works.
- [ ] Source cards open.
- [ ] Tasks persist.
- [ ] Reminders persist.
- [ ] Lawyer request persists.
- [ ] Admin controls work.

### AI
- [ ] No invented laws.
- [ ] No invented sources.
- [ ] No invented lawyers.
- [ ] Jurisdiction is considered.
- [ ] Uncertainty is shown.
- [ ] High-risk cases escalate.
- [ ] Document prompt injection is ignored.
- [ ] AI output validates against schema.

### UI
- [ ] No horizontal scroll.
- [ ] All buttons work.
- [ ] All images load.
- [ ] No broken routes.
- [ ] Empty states exist.
- [ ] Error states exist.
- [ ] Mobile works.
- [ ] Keyboard works.
- [ ] Reduced motion works.

### Security
- [ ] No secrets in frontend bundle.
- [ ] `.env` ignored.
- [ ] Storage is private.
- [ ] Signed URLs are used.
- [ ] RLS is enabled.
- [ ] Admin routes protected.

---

## 8. Demo Script

### Opening
"Most people don't have a lawyer on call. Wakeel gives ordinary people a first layer of legal guidance when they don't know what to do next."

### Scenario
"Let's say someone is blackmailing me with private photos."

### Agentic Moment
Show the agent asking one safety question, retrieving an official source, creating a checklist, and generating a lawyer brief.

### Second Scenario
Upload a legal/business notice and show extraction.

### Third Scenario
Open lawyer matching and show why a lawyer was recommended.

### Closing
"Wakeel does not replace lawyers. It helps people reach the right next step sooner, with better information and better preparation."

---

## 9. Hackathon Judging Advantages

### Innovation
Agentic legal navigation rather than a generic chatbot.

### Impact
Designed around ordinary people who cannot keep legal counsel on retainer.

### Technical depth
Gemini + tool orchestration + Supabase + RLS + document intelligence + source grounding.

### Responsible AI
Uncertainty, source citations, human escalation, privacy, prompt-injection defense.

### UX
Premium, mobile-first, multilingual, case-based workflow.

### Demonstrability
Clear before/after transformation:
**confusion → structured facts → verified resources → action plan → human help.**

---

## 10. Final Quality Gate

Before submission, Antigravity must run a full audit:

1. Find every TODO.
2. Find every placeholder.
3. Find every fake button.
4. Find every console error.
5. Find every hardcoded secret.
6. Find every unauthenticated route.
7. Find every missing RLS policy.
8. Find every AI claim without source support.
9. Find every fake statistic/testimonial.
10. Find every broken mobile layout.
11. Test all core demo scenarios from a clean session.
12. Produce a final build report.
