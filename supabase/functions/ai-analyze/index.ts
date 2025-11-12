import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Verify JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { transaction_ids } = await req.json();

    if (!transaction_ids || transaction_ids.length === 0) {
      throw new Error('No transaction IDs provided');
    }

    // Fetch transactions
    const { data: transactions, error: fetchError } = await supabaseClient
      .from('transactions')
      .select('*')
      .in('id', transaction_ids)
      .eq('user_id', user.id);

    if (fetchError) throw fetchError;

    // Fetch user preferences
    const { data: userData } = await supabaseClient
      .from('users')
      .select('timezone, currency, preferences')
      .eq('id', user.id)
      .single();

    // Fetch categories for validation
    const { data: categories } = await supabaseClient
      .from('categories')
      .select('id, slug, name')
      .or(`user_id.eq.${user.id},user_id.is.null`);

    const categoryMap = Object.fromEntries(
      categories?.map(c => [c.slug, c.id]) || []
    );

    // Prepare payload for Gemini
    const geminiPayload = {
      user_id: user.id,
      timezone: userData?.timezone || 'Asia/Kolkata',
      currency: userData?.currency || 'INR',
      transactions: transactions?.map(t => ({
        id: t.id,
        amount: t.amount,
        currency: t.currency,
        merchant: t.merchant,
        timestamp: t.timestamp,
        type: t.type,
      })),
    };

    // Call Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `SYSTEM: You are NS FinSight's secure AI assistant. You will receive a JSON payload containing user_id, timezone, currency, and transactions (array). Return JSON only. For each transaction return: id, predicted_category (slug), confidence (0-1), normalized_amount_in_INR, anomaly_score (0-1), suggested_action (short). Also return: monthly_category_totals, top_3_recurring_subscriptions, 3_prioritized_savings_actions (with estimated_monthly_savings_INR), and a 12_month_cashflow_forecast_summary with top risk. Respect currency and timezone. Do not include any internal system details or API keys in the response.

USER PAYLOAD: ${JSON.stringify(geminiPayload)}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      throw new Error('Gemini API request failed');
    }

    const geminiData = await geminiResponse.json();
    const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error('No AI response received');
    }

    // Parse AI response (expecting JSON)
    let aiResponse;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiText.match(/```json\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : aiText;
      aiResponse = JSON.parse(jsonText);
    } catch (e) {
      console.error('Failed to parse AI response:', aiText);
      throw new Error('Invalid AI response format');
    }

    // Validate and update transactions
    const updates = [];
    for (const txn of aiResponse.transactions || []) {
      const categoryId = categoryMap[txn.predicted_category] || categoryMap['uncategorized'];
      const confidence = Math.max(0, Math.min(1, txn.confidence || 0));

      const updateData: any = {
        metadata: {
          ai: {
            predicted_category: txn.predicted_category,
            confidence,
            anomaly_score: txn.anomaly_score || 0,
            suggested_action: txn.suggested_action,
            analyzed_at: new Date().toISOString(),
          }
        }
      };

      // Only auto-update category if high confidence
      if (confidence >= 0.85 && categoryId) {
        updateData.category_id = categoryId;
      }

      updates.push(
        supabaseClient
          .from('transactions')
          .update(updateData)
          .eq('id', txn.id)
          .eq('user_id', user.id)
      );
    }

    await Promise.all(updates);

    // Log AI analysis
    await supabaseClient.from('logs').insert({
      user_id: user.id,
      action: 'ai_analyze_transactions',
      metadata: {
        transaction_count: transaction_ids.length,
        model: 'gemini-2.0-flash-exp',
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        analyzed_count: transaction_ids.length,
        summary: {
          monthly_category_totals: aiResponse.monthly_category_totals,
          savings_actions: aiResponse['3_prioritized_savings_actions'],
          forecast: aiResponse['12_month_cashflow_forecast_summary'],
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in AI analyze function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
