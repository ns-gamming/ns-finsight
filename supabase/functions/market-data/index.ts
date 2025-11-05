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
    const { symbols, type } = await req.json(); // type: 'stock' or 'crypto'
    
    const authHeader = req.headers.get("Authorization")!;
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Cache implementation (60 seconds)
    const cache = new Map<string, { price: number; timestamp: number }>();
    const CACHE_TTL = 60 * 1000; // 60 seconds
    
    const prices: Record<string, number> = {};
    const lastUpdated = new Date().toISOString();
    
    if (type === "crypto") {
      // Use CoinGecko free API with INR support
      for (const symbol of symbols) {
        const cacheKey = `crypto:${symbol}`;
        const cached = cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          prices[symbol] = cached.price;
          continue;
        }

        try {
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=inr,usd`
          );
          const data = await response.json();
          const price = data[symbol.toLowerCase()]?.inr || data[symbol.toLowerCase()]?.usd * 83 || 0;
          prices[symbol] = price;
          cache.set(cacheKey, { price, timestamp: Date.now() });
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          prices[symbol] = cached?.price || 0;
        }
      }
    } else if (type === "stock") {
      // For stocks, use cached/mock data with timestamp
      for (const symbol of symbols) {
        const cacheKey = `stock:${symbol}`;
        const cached = cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          prices[symbol] = cached.price;
        } else {
          // Mock price - in production, integrate a real API
          const price = Math.random() * 1000;
          prices[symbol] = price;
          cache.set(cacheKey, { price, timestamp: Date.now() });
        }
      }
    }

    return new Response(
      JSON.stringify({ prices, lastUpdated }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in market-data:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
