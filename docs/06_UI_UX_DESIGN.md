# WAKEEL — UI/UX Design System

## 1. Design Direction

Wakeel should look like a serious modern legal-tech product, not a generic AI chatbot.

Visual personality:
- premium;
- trustworthy;
- calm;
- human;
- modern Pakistani context;
- highly readable;
- responsive;
- spacious;
- editorial + SaaS hybrid.

Avoid:
- excessive black cards;
- generic blue AI dashboards;
- neon cyberpunk;
- crowded admin-style layouts;
- giant walls of text;
- fake testimonials;
- fake government branding;
- copied legal websites.

---

## 2. Brand

### Name
**Wakeel**

### Supporting line
**Your AI Legal Guide**

### Positioning
**Clarity when you don't know what to do next.**

Internal project name:
**QanoonSaathi AI**

---

## 3. Color System

Use CSS variables so the theme is easy to maintain.

Suggested palette:
- warm off-white background;
- deep charcoal text;
- muted plum/rose accent;
- soft sand secondary;
- restrained emerald for safe/success;
- amber for caution;
- red only for genuine urgency.

Do not make every card colorful.

---

## 4. Typography

Use a refined serif for major editorial headings and a clean sans-serif for interface text.

Suggested:
- Cormorant Garamond or Playfair Display for hero headings.
- Inter/DM Sans for UI.

Use `clamp()` for responsive typography.

---

## 5. Landing Page

### Hero
Large statement:
> "When you don't know your rights, know your next step."

Subtext:
> "Wakeel helps you understand a legal situation, organize what matters, find trusted resources, and know when to involve a human lawyer."

CTA:
- Talk to Wakeel
- Explore how it works

Visual:
- premium phone mockup;
- AI legal conversation;
- subtle Pakistan map/legal document visual;
- real contextual imagery, not stocky corporate handshakes.

### Section 2 — The Gap
"Not everyone can keep a lawyer on call."

Use a visual comparison:
- confusion;
- Wakeel;
- clear next step.

### Section 3 — How It Works
1. Tell your story.
2. Wakeel asks what matters.
3. It checks trusted sources.
4. You get a practical plan.
5. Connect with a lawyer if needed.

### Section 4 — Real Situations
Cards:
- Police/authority contact
- Cyber blackmail
- Harassment
- Business notice
- Workplace issue
- Family/property issue

### Section 5 — Agentic AI
Show the actual workflow:
Understand → Verify → Retrieve → Plan → Act → Follow up.

### Section 6 — Document Intelligence
Upload a notice → extracted dates/authority/request → simplified explanation.

### Section 7 — Safety
Large, calm safety center.

### Section 8 — Lawyer Network
Verified lawyer cards.

### Section 9 — Trust
Source-grounded answers, uncertainty, privacy, human review.

### Final CTA
"Start with what happened."

---

## 6. Assistant UI

The assistant should not look like ChatGPT clone.

Use:
- conversation area;
- case context sidebar;
- progress indicator;
- source cards;
- action-plan cards;
- urgency banner;
- "What I need to know";
- "What I checked";
- "What you can do next".

### Message types
- user message;
- AI response;
- question card;
- choice chips;
- source card;
- warning;
- action plan;
- task created;
- document result;
- human escalation.

---

## 7. Case Dashboard

Header:
- case title;
- category;
- urgency;
- status.

Main:
- current action;
- timeline;
- evidence;
- deadlines;
- sources;
- lawyer connection.

Side:
- "Next best step"
- confidence
- human-review CTA.

---

## 8. Document Analyzer

Split layout on desktop:
- left: document viewer;
- right: extracted intelligence.

Highlight:
- deadline;
- authority;
- reference;
- requested action;
- unknowns.

Buttons:
- Explain simply
- Add to timeline
- Create reminder
- Ask lawyer
- Download brief

---

## 9. Evidence Vault

Use a secure vault visual:
- file cards;
- evidence type;
- date;
- linked event;
- hash indicator;
- upload status.

Do not visually imply that the hash proves court admissibility.

---

## 10. Lawyer Directory

Cards should show:
- verified badge;
- specialization;
- city;
- languages;
- consultation mode;
- availability;
- concise bio;
- why matched.

No fake star ratings unless real.

---

## 11. Safety Center

Sections:
- immediate danger;
- cyber abuse;
- harassment;
- human-rights support;
- official resources.

Use clear "Call" / "Open official resource" actions.

---

## 12. Mobile

Bottom navigation:
- Home
- Cases
- Wakeel
- Resources
- Profile

Assistant input should remain accessible.

Document viewer must become a tabbed/mobile sheet.

---

## 13. Motion

Use motion only for:
- page reveal;
- card entrance;
- progress;
- status changes;
- modal transitions.

Respect reduced-motion preferences.

---

## 14. Images

Use relevant, authentic-looking imagery:
- Pakistani urban environments;
- diverse Pakistani people;
- women and men in realistic contexts;
- documents/phone interactions;
- courthouse/legal-office atmosphere.

Never use images that imply a real government officer, real lawyer, or real victim without permission.

Use optimized images and lazy loading.

---

## 15. Responsive QA

Test:
- 360px;
- 390px;
- 768px;
- 1024px;
- 1280px;
- 1440px+.

No horizontal overflow.

---

## 16. Accessibility

- semantic HTML;
- keyboard support;
- focus states;
- aria labels;
- color not as the only signal;
- readable font sizes;
- sufficient contrast;
- captions/transcripts for voice where possible.
