import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/sources.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { category, jurisdiction, city, language, consultation_mode } = await req.json();

    // In a live system, query lawyers table with RLS / RPC
    // For now, return structured matches matching our 10 verified synthetic demo lawyers
    const demoLawyers = [
      {
        id: "lawyer-1",
        name: "Barrister Tariq Mansoor [DEMO]",
        province: "Punjab",
        city: "Lahore",
        specializations: ["cybercrime", "harassment_stalking", "contract"],
        languages: ["en", "ur"],
        consultation_modes: ["in_person", "video", "phone"],
        verified: true,
        experience_years: 12,
        bio: "[DEMO PROFILE] High Court Advocate specializing in PECA cybercrime disputes, digital evidence preservation, and corporate tech compliance.",
        match_score: 96,
        match_reasons: ["Top match for Cybercrime in Punjab", "Offers remote video consults", "Fluent in Urdu and English"]
      },
      {
        id: "lawyer-2",
        name: "Advocate Zainab Baloch [DEMO]",
        province: "Sindh",
        city: "Karachi",
        specializations: ["womens_rights", "family", "harassment_stalking"],
        languages: ["en", "ur"],
        consultation_modes: ["video", "phone", "chat"],
        verified: true,
        experience_years: 9,
        bio: "[DEMO PROFILE] Dedicated women rights advocate and family law counselor with extensive experience handling domestic and workplace safety.",
        match_score: 92,
        match_reasons: ["Specialist in women safety & domestic protection", "Immediate phone consultation available", "Confidential case intake"]
      },
      {
        id: "lawyer-3",
        name: "Advocate Asadullah Khan [DEMO]",
        province: "Khyber Pakhtunkhwa",
        city: "Peshawar",
        specializations: ["police_criminal", "human_rights"],
        languages: ["en", "ur"],
        consultation_modes: ["in_person", "phone"],
        verified: true,
        experience_years: 15,
        bio: "[DEMO PROFILE] Seasoned criminal defense advocate with deep expertise in police summons, bail hearings, and CrPC compliance.",
        match_score: 90,
        match_reasons: ["15 years criminal procedure defense experience", "Direct experience with police summons verification"]
      },
      {
        id: "lawyer-4",
        name: "Advocate Hammad Malik [DEMO]",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        specializations: ["business_compliance", "tax", "contract"],
        languages: ["en", "ur"],
        consultation_modes: ["video", "in_person"],
        verified: true,
        experience_years: 11,
        bio: "[DEMO PROFILE] Corporate advisor for FBR show-cause notices, regulatory audits, and commercial contract arbitration.",
        match_score: 88,
        match_reasons: ["Specialized in FBR and statutory show-cause notices", "Active in Islamabad & Rawalpindi"]
      }
    ];

    return new Response(JSON.stringify({ lawyers: demoLawyers }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
