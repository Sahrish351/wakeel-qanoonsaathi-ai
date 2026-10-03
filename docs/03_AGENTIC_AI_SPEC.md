# WAKEEL — Agentic AI Specification

## 1. Objective

Make Gemini the reasoning engine inside a controlled, tool-using legal guidance workflow.

The product must demonstrate **agentic behavior**, not simply a chat window.

---

## 2. Agent Responsibilities

The Wakeel Agent can:

1. Understand the user's narrative.
2. Detect missing facts.
3. Ask targeted follow-up questions.
4. Classify issue and jurisdiction.
5. Assess urgency.
6. Select tools.
7. Retrieve trusted source material.
8. Analyze documents.
9. Extract deadlines/entities.
10. Build an action plan.
11. Create reminders.
12. Prepare a lawyer brief.
13. Recommend official resources.
14. Recommend human legal review.
15. Explain uncertainty.
16. Log agent decisions safely.

---

## 3. Agent Loop

```text
USER INPUT
   ↓
Normalize language / speech / document
   ↓
Case Context Builder
   ↓
Risk & Safety Triage
   ↓
Issue + Jurisdiction Classification
   ↓
Missing-Facts Detector
   ↓
Ask Focused Questions
   ↓
Tool Planner
   ├── Source Search
   ├── Document Extraction
   ├── Resource Directory
   ├── Lawyer Matching
   ├── Deadline Extraction
   └── Case Timeline
   ↓
Grounded Reasoning
   ↓
Action Plan + Sources + Uncertainty
   ↓
Optional Actions
   ├── Save case
   ├── Create reminder
   ├── Generate lawyer brief
   └── Request human review
```

---

## 4. Tool Contracts

### `search_legal_sources`
Input:
- query
- jurisdiction
- category
- source_type

Output:
- source_id
- title
- authority
- excerpt
- effective/update date
- URL
- jurisdiction
- relevance score

### `analyze_document`
Input:
- document_id

Output:
- extracted_text
- entities
- dates
- deadlines
- authority
- referenced laws
- requests
- confidence
- page references

### `create_case_task`
Input:
- case_id
- title
- due_at
- priority
- source_reason

### `find_lawyers`
Input:
- category
- jurisdiction
- city
- language
- consultation_mode

Output:
- verified lawyers
- specialization
- availability
- match reasons

### `get_official_resources`
Input:
- category
- jurisdiction
- urgency

### `create_lawyer_brief`
Input:
- case_id

Output:
- structured case summary
- timeline
- evidence list
- questions
- uncertainty flags

---

## 5. Agent State

Use a structured case state:

```json
{
  "case_id": "...",
  "category": "cybercrime",
  "jurisdiction": "Punjab, Pakistan",
  "urgency": "high",
  "facts": [],
  "unknowns": [],
  "people": [],
  "authorities": [],
  "dates": [],
  "deadlines": [],
  "evidence": [],
  "sources": [],
  "actions": [],
  "escalation": null,
  "confidence": 0.0
}
```

Never allow the model to invent missing values.

Use `null` / `unknown` instead.

---

## 6. Legal Grounding Policy

### Golden rule
**No source, no strong legal claim.**

The model may explain general concepts, but legal claims that could materially affect a user's decision should be tied to retrieved trusted sources.

### Source hierarchy

1. Government ministries/departments.
2. Official law/legislation portals.
3. Official police/cybercrime/authority portals.
4. Courts and official judgments where accessible.
5. Reviewed legal-aid organizations.
6. Secondary legal sources as a clearly labeled fallback.

---

## 7. Anti-Hallucination Strategy

Before final response:
- verify source exists;
- verify jurisdiction;
- verify source freshness;
- verify claim is actually supported;
- remove unsupported claims;
- downgrade confidence if facts are incomplete;
- state uncertainty.

The UI should show:
**Grounded in 3 trusted sources**

and allow the user to open the source cards.

---

## 8. Legal Safety Guardrails

The agent must never:
- claim to be a lawyer;
- claim attorney-client privilege;
- guarantee an outcome;
- fabricate legal sections;
- invent deadlines;
- invent lawyer credentials;
- tell users to lie;
- advise destruction of evidence;
- encourage retaliation;
- tell users to ignore authorities categorically;
- make a final determination of guilt/innocence.

---

## 9. High-Risk Routing

### Immediate physical danger
Show emergency action first.

For Pakistan/Punjab demo:
- Police emergency: 15
- Rescue: 1122

Numbers must come from verified official sources and be stored in a managed resource table, not hardcoded throughout the UI.

### Cyber harassment/blackmail
Route to the current official cybercrime authority/resource.

For the current Pakistan implementation, the official NCCIA portal provides complaint registration and identifies 1799 as its contact number. Source data must be periodically reviewed.

### Human-rights issues
The Ministry of Human Rights provides the 1099 legal-advice helpline.

The product should present it as an official resource, not as Wakeel's own service.

---

## 10. Example Agent Output Structure

```json
{
  "summary": "...",
  "urgency": "high",
  "what_i_understand": [],
  "what_i_need_to_know": [],
  "do_now": [],
  "do_next": [],
  "avoid": [],
  "official_resources": [],
  "lawyer_needed": true,
  "why_human_review": "...",
  "sources": [],
  "confidence": "medium",
  "disclaimer": "..."
}
```

---

## 11. Prompt Architecture

### System layer
Defines:
- role;
- legal safety;
- source requirements;
- no fabrication;
- jurisdiction awareness;
- escalation rules.

### Case layer
Contains:
- user case;
- profile;
- current state;
- uploaded document extraction;
- previous actions.

### Retrieval layer
Contains only relevant trusted source chunks.

### Task layer
Defines the current operation:
- classify;
- ask questions;
- analyze document;
- create action plan;
- prepare lawyer brief.

### Output schema
Use structured JSON before rendering the UI.

---

## 12. Conversation UX

Do not make the user answer 15 questions at once.

Use:
- one important question;
- short choices;
- optional "I don't know";
- progress indicator;
- ability to skip non-essential questions.

Example:

> "Did the caller give you a case/FIR/reference number?"

Buttons:
- Yes
- No
- I'm not sure

Then ask the next relevant question.

---

## 13. Explainability

Every generated action plan should have:
- "Why this step?"
- "Source"
- "What could change this advice?"
- "When to contact a lawyer"

Do not expose chain-of-thought. Show concise decision summaries only.

---

## 14. Human-in-the-Loop

Triggers:
- emergency/high-risk;
- unclear jurisdiction;
- conflicting sources;
- high legal consequence;
- user requests lawyer;
- low confidence;
- document ambiguity;
- minors/vulnerable persons.
