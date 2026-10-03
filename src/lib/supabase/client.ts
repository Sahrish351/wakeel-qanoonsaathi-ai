// =============================================================
// WAKEEL — Supabase Client
// SECURITY: Only uses VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.
// NEVER import GEMINI_API_KEY or SUPABASE_SERVICE_ROLE_KEY here.
// Those secrets live exclusively in Supabase Edge Function secrets.
// =============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Use secure, httpOnly cookies in production via Supabase Auth
    storage: window.localStorage,
    storageKey: 'wakeel-auth',
    flowType: 'pkce',
  },
});

export type { SupabaseClient } from '@supabase/supabase-js';

