import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Validates the caller's JWT token using Supabase Auth.
 * Returns the verified user object or throws an error.
 */
export async function authenticateRequest(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Missing Authorization header. Token required.');
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables missing in server runtime.');
  }

  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const { data: { user }, error } = await supabaseClient.auth.getUser();
  if (error || !user) {
    throw new Error(`Unauthorized: ${error?.message || 'Invalid or expired token'}`);
  }

  return { user, supabaseClient };
}

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
