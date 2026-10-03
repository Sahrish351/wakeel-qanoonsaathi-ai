export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const OFFICIAL_GROUNDED_SOURCES = [
  {
    id: 'SRC-PK-POLICE-15',
    title: 'Emergency Police Services (Punjab / National)',
    authority: 'Punjab Police / National Police Bureau',
    jurisdiction: 'Pakistan',
    category: 'police_criminal',
    url: 'https://punjabpolice.gov.pk',
    contact: '15',
    excerpt: 'Emergency police response. Section 160 CrPC governs witness attendance upon written order; verbal demands over phone require identity and formal verification before compliance.'
  },
  {
    id: 'SRC-PK-RESCUE-1122',
    title: 'Emergency Ambulance & Rescue Services',
    authority: 'Punjab Emergency Service (Rescue 1122)',
    jurisdiction: 'Punjab / Khyber Pakhtunkhwa / National',
    category: 'police_criminal',
    url: 'https://rescue.gov.pk',
    contact: '1122',
    excerpt: 'Immediate medical trauma, fire, and distress dispatch.'
  },
  {
    id: 'SRC-PK-MOHR-1099',
    title: 'Ministry of Human Rights Legal Aid Helpline',
    authority: 'Ministry of Human Rights, Government of Pakistan',
    jurisdiction: 'Pakistan',
    category: 'human_rights',
    url: 'https://www.mohr.gov.pk',
    contact: '1099',
    excerpt: 'Free legal counseling, human rights violation reporting, and safety routing for vulnerable individuals, domestic abuse survivors, and minorities.'
  },
  {
    id: 'SRC-PK-NCCIA-1799',
    title: 'National Cyber Crime Investigation Agency (NCCIA) Portal',
    authority: 'NCCIA / FIA Cybercrime Wing',
    jurisdiction: 'Pakistan',
    category: 'cybercrime',
    url: 'https://www.nccia.gov.pk',
    contact: '1799',
    excerpt: 'Mandated under Prevention of Electronic Crimes Act (PECA 2016) Sec 20, 21 & 24 for cyber blackmail, extortion with private images, online harassment, and unauthorized data access.'
  },
  {
    id: 'SRC-PK-CRPC-1898',
    title: 'Code of Criminal Procedure (Act V of 1898)',
    authority: 'Ministry of Law and Justice, Pakistan',
    jurisdiction: 'Pakistan',
    category: 'police_criminal',
    url: 'http://pakistancode.gov.pk',
    contact: null,
    excerpt: 'Statutory regulation governing investigation, FIR registration (Sec 154), police powers to examine witnesses (Sec 160), and arrest safeguards.'
  },
  {
    id: 'SRC-PK-PECA-2016',
    title: 'Prevention of Electronic Crimes Act 2016',
    authority: 'National Assembly of Pakistan',
    jurisdiction: 'Pakistan',
    category: 'cybercrime',
    url: 'http://pakistancode.gov.pk',
    contact: null,
    excerpt: 'Covers offenses against dignity of natural persons (Sec 20), cyber-stalking (Sec 24), and dissemination of private images/coercion (Sec 21).'
  }
];

export const SYSTEM_SAFETY_PROMPT = `
You are Wakeel (QanoonSaathi AI), a specialized legal navigation and triage guide for Pakistan.
Your mission is: "When you don't know your rights, know your next step."

CRITICAL LEGAL SAFETY RULES:
1. You are an AI navigation guide, NOT a licensed lawyer, law firm, court, or police authority.
2. NEVER invent statutes, section numbers, case citations, deadlines, or official procedures.
3. NEVER tell a user categorically "don't go" or "ignore the call" when police or an authority contacts them. Instead:
   - Ask for caller rank, name, police station, and whether a formal written summon / FIR number exists.
   - Advise recording caller details and going with legal counsel or a family member once verified.
4. For cyber blackmail/private photo extortion:
   - Advise strictly against paying or reckless escalation.
   - Preserve uncropped evidence (timestamps, sender numbers, message headers).
   - Point to NCCIA (1799) and secure accounts.
5. If facts are missing, ask ONE focused, empathetic follow-up question.
6. Ground all legal guidance in verified Pakistani laws: PECA 2016, CrPC 1898, etc.
7. Always provide an action plan with: immediate actions (do_now), next 24-48 hours (do_next), and critical things to avoid (avoid).
8. Return ONLY valid JSON adhering strictly to the requested schema.
`;
