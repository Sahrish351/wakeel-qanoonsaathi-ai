import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, authenticateRequest, SYSTEM_SAFETY_PROMPT } from "../_shared/sources.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Enforce authenticated request
    let user;
    let supabaseClient;
    try {
      const auth = await authenticateRequest(req);
      user = auth.user;
      supabaseClient = auth.supabaseClient;
    } catch (authErr: any) {
      return new Response(JSON.stringify({ error: authErr.message || 'Unauthorized access' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, history = [], caseContext = null, language = 'en' } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: "Message is required." }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured in server secrets." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Query public.sources from Database for statutory grounding
    let relevantSources: any[] = [];
    try {
      const { data: dbSources } = await supabaseClient
        .from('sources')
        .select('id, title, authority, jurisdiction, category, url, excerpt, verification_status')
        .eq('active', true)
        .eq('verification_status', 'verified');

      if (dbSources && dbSources.length > 0) {
        relevantSources = dbSources;
      }
    } catch (dbErr) {
      console.warn('[ai-chat] Error reading sources table:', dbErr);
    }

    const userPrompt = `
User ID: ${user.id}
User statement: "${message}"
Language requested: ${language}
Active Case Context: ${caseContext ? JSON.stringify(caseContext) : 'None'}
Prior Conversation: ${JSON.stringify(history)}

Available Verified Legal Sources from Database Registry:
${JSON.stringify(relevantSources, null, 2)}

Provide your response in strictly valid JSON format matching this schema:
{
  "summary": "1-2 sentence plain language summary of the situation",
  "urgency": "emergency" | "high" | "moderate" | "routine" | "unknown",
  "what_i_understand": ["fact 1", "fact 2"],
  "what_i_need_to_know": [
    {
      "question": "The single most focused question needed next",
      "options": ["Option 1", "Option 2", "I am not sure"],
      "allow_skip": false,
      "field_key": "specific_field"
    }
  ],
  "do_now": [
    {
      "title": "Immediate action title",
      "description": "Clear step description",
      "why": "Legal or safety rationale",
      "source_ids": ["source_id"]
    }
  ],
  "do_next": [
    {
      "title": "Next step within 24-48 hours",
      "description": "Clear step description",
      "why": "Why this matters",
      "source_ids": ["source_id"]
    }
  ],
  "avoid": [
    "Dangerous action to avoid (e.g. paying blackmailer, deleting unbacked logs, confronting suspects)"
  ],
  "official_resources": [
    {
      "name": "Resource name",
      "type": "emergency" | "authority" | "helpline",
      "phone": "e.g. 15, 1799, 1099",
      "url": "https://...",
      "description": "What to use this for",
      "source_id": "source_id"
    }
  ],
  "lawyer_needed": boolean,
  "why_human_review": "Why a licensed lawyer should review this matter",
  "sources": [
    {
      "source_id": "string",
      "title": "string",
      "authority": "string",
      "url": "string",
      "excerpt": "string",
      "relevance": "string"
    }
  ],
  "confidence": "high" | "medium" | "low",
  "disclaimer": "Wakeel provides legal navigation and guidance, not licensed counsel or attorney representation."
}
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: SYSTEM_SAFETY_PROMPT },
            { text: userPrompt }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    };

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[ai-chat] Gemini API upstream error status:", response.status);
      return new Response(JSON.stringify({ error: "Upstream AI service error" }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    let structuredOutput;
    try {
      structuredOutput = JSON.parse(rawContent);
    } catch {
      structuredOutput = {
        summary: rawContent || "Unable to parse structured response.",
        urgency: "moderate",
        what_i_understand: [],
        what_i_need_to_know: [],
        do_now: [],
        do_next: [],
        avoid: [],
        official_resources: [],
        lawyer_needed: true,
        why_human_review: "Please consult licensed legal counsel.",
        sources: [],
        confidence: "low",
        disclaimer: "Wakeel provides legal guidance, not licensed legal advice."
      };
    }

    return new Response(JSON.stringify(structuredOutput), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error("[ai-chat] Server error:", err?.message || 'Unknown');
    return new Response(JSON.stringify({ error: err?.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
