import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { categoryId } = await req.json();
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch recent transactions in this category
    const { data: recentTransactions, error: txError } = await supabase
      .from("transactions")
      .select("merchant, notes, amount, metadata")
      .eq("user_id", user.id)
      .eq("category_id", categoryId)
      .order("timestamp", { ascending: false })
      .limit(10);

    if (txError) throw txError;

    // Analyze patterns
    const merchantFrequency: { [key: string]: number } = {};
    const notesPatterns: string[] = [];

    recentTransactions?.forEach((tx) => {
      if (tx.merchant) {
        merchantFrequency[tx.merchant] = (merchantFrequency[tx.merchant] || 0) + 1;
      }
      if (tx.notes) {
        notesPatterns.push(tx.notes);
      }
    });

    // Get most frequent merchant
    const suggestedMerchant = Object.entries(merchantFrequency)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || "";

    // Get most common words from notes
    const commonWords = notesPatterns
      .join(" ")
      .split(" ")
      .filter((w) => w.length > 3)
      .slice(0, 5)
      .join(" ");

    const suggestedNotes = commonWords || "";

    // Calculate average amount
    const avgAmount = recentTransactions?.length
      ? recentTransactions.reduce((sum, tx) => {
          const baseAmount = tx.metadata?.base_amount || tx.amount;
          return sum + Number(baseAmount);
        }, 0) / recentTransactions.length
      : 0;

    return new Response(
      JSON.stringify({
        merchant: suggestedMerchant,
        notes: suggestedNotes,
        averageAmount: Math.round(avgAmount),
        confidence: recentTransactions?.length || 0,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("AI suggest error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
