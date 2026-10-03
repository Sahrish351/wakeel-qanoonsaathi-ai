# WAKEEL — QanoonSaathi AI
## Product Requirements Document (PRD)
**Version:** 1.0  
**Product:** Wakeel — AI Legal Guidance & Access Platform for Pakistan  
**Hackathon Goal:** Production-quality prototype with a strong agentic AI core, real-world usefulness, premium UX, and a convincing live demo.

---

## 1. Product Vision

Wakeel gives an ordinary person a practical, understandable path when they face a legal, rights, police, workplace, business, family, harassment, or cyber-safety problem.

The product is inspired by a simple inequality:

> People with money can keep lawyers on call. Wakeel aims to put a first layer of legal guidance in everyone's phone.

Wakeel is **not a replacement for a licensed lawyer, court, police officer, or emergency service**. It is a legal-information and decision-support system that helps users understand what happened, identify urgency, organize evidence, find relevant official channels, prepare questions/documents, and connect with a human professional when needed.

---

## 2. Core Problem

Many people do not know:
- whether a situation is urgent;
- which authority is relevant;
- what information/evidence to preserve;
- what questions to ask;
- what a notice or message means;
- how to communicate safely and respectfully;
- when to seek a licensed lawyer;
- where official complaint/help channels are;
- what to do next after the first action.

This creates a gap between **having rights** and **knowing how to navigate the system**.

---

## 3. Target Users

### Primary
- Ordinary citizens with little or no legal knowledge.
- Low-income users who cannot immediately retain a lawyer.
- Students and young adults.
- Women and vulnerable users facing harassment, coercion, domestic abuse, stalking, or discrimination.
- Small-business owners.
- Freelancers and workers.
- People facing cyber harassment, blackmail, impersonation, scams, or privacy abuse.

### Secondary
- Licensed lawyers who want qualified leads.
- Legal-aid organizations.
- Human-rights support organizations.
- Community support workers.

---

## 4. High-Impact Use Cases

### UC-01: Police/Authority Contact
A user receives a phone call asking them to visit a police station or government office.

Wakeel should:
1. Ask what was said and when.
2. Determine whether there is immediate danger.
3. Ask whether the caller provided a name, rank, station/office, case/reference number, written notice, or reason.
4. Explain that the app cannot determine from a phone call alone whether attendance is legally required.
5. Suggest safe verification steps.
6. Explain what information to record.
7. Recommend contacting a licensed lawyer/legal-aid service when legal exposure is possible.
8. Provide official emergency/help channels where applicable.
9. Create a checklist and follow-up reminder.

**Never tell the user categorically to ignore a police call.**

### UC-02: Cyber Blackmail
User reports threats involving private photos/videos/messages.

Wakeel should:
- prioritize immediate safety;
- advise against paying or escalating;
- help preserve evidence;
- guide account-security steps;
- identify the appropriate official reporting route;
- generate a structured incident timeline;
- help prepare a complaint summary;
- offer human legal support.

### UC-03: Harassment/Stalking
User is repeatedly contacted or followed.

Wakeel should:
- assess immediate physical danger;
- suggest emergency support if needed;
- help document dates/times/locations/messages;
- explain reporting options;
- generate a safety-oriented action plan;
- avoid confrontational instructions that could increase danger.

### UC-04: Women's Rights
Support topics may include:
- harassment;
- domestic violence/safety;
- workplace discrimination;
- online abuse;
- coercion;
- stalking;
- property/inheritance questions;
- family-law navigation.

The product must remain jurisdiction-aware and must never generalize one legal rule to all provinces or situations.

### UC-05: Small Business Compliance
Business owner uploads a notice or describes an issue.

Wakeel:
- extracts authority, dates, deadlines, reference numbers, alleged issue, requested documents;
- explains the document in plain language;
- asks missing questions;
- identifies possible next steps;
- creates a compliance checklist;
- recommends a lawyer/accountant/tax professional when appropriate;
- never invents a filing requirement.

### UC-06: Legal Notice / Document Understanding
User uploads PDF/image/photo.

Wakeel:
- OCR/parse;
- extract key entities;
- summarize;
- identify deadlines;
- highlight unknowns;
- produce questions for a lawyer;
- provide source-backed explanations;
- warn when image quality or missing pages makes interpretation unreliable.

### UC-07: Lawyer Discovery
User can request a human lawyer.

Matching factors:
- legal category;
- city/province;
- language;
- experience;
- consultation mode;
- availability;
- verified profile status;
- optional budget range.

No fake lawyer credentials.

---

## 5. Product Pillars

1. **Understand** — turn confusing legal language into simple language.
2. **Triage** — identify urgency and risk.
3. **Guide** — produce a step-by-step action plan.
4. **Ground** — cite trusted sources.
5. **Prepare** — organize evidence, questions, timelines and drafts.
6. **Connect** — route users to official services or verified lawyers.
7. **Follow Through** — reminders, case timeline, tasks and status.
8. **Protect** — privacy-first handling of sensitive legal information.

---

## 6. Agentic AI

Wakeel is not just a chatbot.

The agent can:
- classify the issue;
- ask targeted follow-up questions;
- decide which tools it needs;
- retrieve trusted legal/official information;
- inspect uploaded documents;
- identify missing information;
- generate an action plan;
- create tasks/reminders;
- prepare a complaint/consultation summary;
- recommend an escalation path;
- recommend human legal review;
- maintain a case timeline.

Every agent action should be visible in a concise "What Wakeel checked" / "Why this matters" panel.

---

## 7. Core Modules

### Public
- Landing page
- How it works
- Legal topics
- Safety center
- Official resources
- Lawyer directory
- About / methodology
- Privacy / terms / disclaimer

### Auth
- Email/password
- Forgot password
- Email verification
- Optional Google sign-in
- Secure session handling

### User
- AI Legal Guide
- New Case
- My Cases
- Case Timeline
- Evidence Vault
- Document Analyzer
- Action Plans
- Reminders
- Saved Resources
- Lawyer Recommendations
- Consultation Requests
- Profile / privacy controls

### Lawyer
- Verification onboarding
- Profile
- Specializations
- Availability
- Consultation requests
- Client brief
- Case notes
- Secure messaging
- Dashboard
- Analytics

### Admin
- User moderation
- Lawyer verification
- Source management
- Legal-content review workflow
- AI safety logs
- Feedback
- Abuse reports
- Audit logs
- System health
- Feature flags

---

## 8. Differentiating Features

### 8.1 Legal Situation Scanner
A guided intake converts a messy story into:
- issue category;
- jurisdiction;
- urgency;
- people involved;
- dates;
- authority;
- documents;
- evidence;
- desired outcome;
- unknowns.

### 8.2 Evidence Locker
Store:
- screenshots;
- PDFs;
- photos;
- audio/video metadata;
- notes;
- incident timestamps.

Important: the app should clearly distinguish **uploaded evidence** from **AI-generated summaries**.

### 8.3 Evidence Integrity
For demo/prototype purposes:
- file hash;
- upload timestamp;
- immutable activity record;
- original filename;
- source metadata.

Do not claim blockchain or court-admissibility.

### 8.4 Deadline Guardian
Extract deadlines and create reminders:
- "Document response due"
- "Consult lawyer"
- "Follow up with authority"
- "Review complaint status"

### 8.5 Case Timeline
Chronological event view:
- user event;
- uploaded evidence;
- AI extraction;
- reminder;
- consultation;
- user-entered update.

### 8.6 Explain This Document
"Simple Urdu", "Roman Urdu", and English explanations.

### 8.7 Ask a Lawyer Brief
One click creates a professional case brief:
- issue;
- facts;
- timeline;
- evidence;
- questions;
- actions already taken;
- urgent concerns.

### 8.8 Safety Mode
For sensitive situations:
- discreet interface;
- quick exit;
- reduced notification detail;
- privacy reminders;
- emergency resource access.

Do not promise that quick exit guarantees device-level privacy.

### 8.9 Scenario Simulator
Educational "What if?" flows:
- police contact;
- legal notice;
- cyber blackmail;
- workplace harassment;
- business notice.

Clearly labeled as educational simulation, not legal advice.

### 8.10 Voice Intake
User can speak in Urdu, Roman Urdu, or English. The system converts speech to structured facts and asks clarifying questions.

### 8.11 Multilingual Legal Simplifier
Output modes:
- English
- Urdu
- Roman Urdu

The legal source itself remains linked.

### 8.12 Confidence + Uncertainty
Every important conclusion should show:
- Confidence: High / Medium / Low
- Why uncertainty exists
- What information would improve the answer

### 8.13 Source Cards
Every legal claim should have a source card:
- source name;
- authority;
- publication/update date if available;
- relevant section/page;
- retrieved date;
- source URL.

---

## 9. Trust & Safety Rules

Wakeel must:
- never fabricate a law, section, case, deadline, phone number, lawyer, office, or government procedure;
- never present generated text as an official legal order;
- never impersonate a lawyer;
- never guarantee an outcome;
- never encourage illegal retaliation;
- never tell a user to destroy evidence;
- never tell a user to lie to authorities;
- never give definitive legal conclusions when facts are incomplete;
- route emergencies to appropriate emergency services;
- escalate high-risk matters to human professionals.

---

## 10. Success Metrics

### Product
- First useful action plan in under 2 minutes.
- User can understand "what do I do next?" after intake.
- At least 5 polished demo scenarios.

### AI
- High grounded-answer rate.
- Citation coverage for legal claims.
- Low unsupported-claim rate.
- Correct escalation on safety scenarios.

### UX
- Mobile-first.
- Fast first contentful experience.
- Accessible keyboard/focus states.
- Clear empty/loading/error states.
- No dead-end screens.

---

## 11. Hackathon Demo Scenarios

1. Cyber blackmail → evidence preservation → NCCIA reporting route → security checklist → lawyer brief.
2. Police call → verification checklist → risk questions → lawyer/legal-aid escalation.
3. Business notice PDF → extraction → deadline → action plan → lawyer recommendation.
4. Workplace harassment → evidence timeline → reporting options → support resources.
5. Women's safety/harassment → safety triage → resource routing → follow-up plan.

---

## 12. Definition of Done

A feature is not complete if it only has UI.

Every major feature needs:
- working frontend;
- working Supabase persistence;
- validation;
- loading/error/empty states;
- authorization;
- auditability where sensitive;
- Gemini integration where appropriate;
- source grounding where legal claims are made;
- responsive design;
- test coverage;
- demo data where useful;
- no fake success buttons.
