import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, authenticateRequest } from "../_shared/sources.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Enforce authenticated request
    let supabaseClient;
    try {
      const auth = await authenticateRequest(req);
      supabaseClient = auth.supabaseClient;
    } catch (authErr: any) {
      return new Response(JSON.stringify({ error: authErr.message || 'Unauthorized access' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { category, province } = await req.json();

    // Query real public.lawyers with profile details
    let query = supabaseClient
      .from('lawyers')
      .select(`
        id,
        bio,
        province,
        city,
        languages,
        consultation_modes,
        verified,
        availability_status,
        profiles:profile_id (
          full_name,
          avatar_url
        ),
        lawyer_specializations (
          category
        )
      `)
      .eq('verified', true);

    if (province && province !== 'All') {
      query = query.eq('province', province);
    }

    const { data: dbLawyers, error } = await query;

    if (error) {
      console.warn('[match-lawyers] Database error:', error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ lawyers: dbLawyers || [] }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
