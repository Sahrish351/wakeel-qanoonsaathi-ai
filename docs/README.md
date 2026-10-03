# Wakeel — QanoonSaathi AI Hackathon Specification Pack

This folder contains the complete Markdown specification pack for building **Wakeel — Your AI Legal Guide**, a Pakistan-focused agentic legal guidance and access platform.

## Files

1. `01_PRD.md` — product vision, users, features, use cases
2. `02_SRS.md` — functional/non-functional requirements
3. `03_AGENTIC_AI_SPEC.md` — Gemini agent, tools, grounding, safety
4. `04_SYSTEM_ARCHITECTURE.md` — React/Vite/Supabase/Gemini architecture
5. `05_DATABASE_RLS.md` — database entities and security policies
6. `06_UI_UX_DESIGN.md` — premium responsive UI/UX system
7. `07_SECURITY_SAFETY_GROUNDING.md` — privacy, security, legal safety
8. `08_IMPLEMENTATION_QA_DEMO.md` — build phases, QA, demo
9. `09_MASTER_ANTIGRAVITY_PROMPT.md` — master instruction to give Antigravity
10. `README.md` — this guide

## Recommended Antigravity Workflow

1. Put all files into the project/specification folder.
2. Open `09_MASTER_ANTIGRAVITY_PROMPT.md`.
3. Tell Antigravity to read all specification files before coding.
4. Give it access to the Supabase project through environment variables.
5. Provide the Gemini API key only through a secure server-side/Edge Function environment variable.
6. Build in phases.
7. After each phase, run and test the app.
8. Never commit `.env` or secret keys.

## Product Positioning

**Wakeel — Your AI Legal Guide**

> When you don't know your rights, know your next step.

Wakeel is designed as a first layer of legal information, navigation, preparation and access to human help. It does not replace a licensed lawyer or emergency service.

## Current Official Resource Examples

The demo source layer can include verified official Pakistan resources such as:
- Punjab Police emergency 15 and Rescue 1122;
- Ministry of Human Rights legal-advice helpline 1099;
- National Cyber Crime Investigation Agency (NCCIA) complaint resources and 1799.

These should be stored as managed source/resource records so they can be reviewed and updated.
