import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createHash } from 'https://deno.land/std@0.168.0/node/crypto.ts';

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

    const { amount, currency, type, merchant, notes, description, category_id, account_id, timestamp, tags, family_member_id, payment_source } = await req.json();

    // Validate required fields
    if (!amount || !type) {
      throw new Error('Missing required fields: amount, type');
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new Error('Amount must be a positive number');
    }

    // Sanitize string inputs
    const sanitizedMerchant = merchant?.trim().substring(0, 255);
    const sanitizedNotes = notes?.trim().substring(0, 1000);
    const sanitizedDescription = description?.trim().substring(0, 1000);

    // Map savings to expense for DB constraint, store original in metadata
    const dbType = type === 'savings' ? 'expense' : type;
    const originalType = type;

    // Get client IP and hash it
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    const salt = Deno.env.get('IP_HASH_SALT') || 'default-salt';
    const ipHash = createHash('sha256').update(salt + clientIP).digest('hex');

    // Currency conversion for non-INR
    const userCurrency = currency || 'INR';
    let baseAmount = amountNum;
    let exchangeRate = 1;

    if (userCurrency !== 'INR') {
      try {
        // Handle USDT as USD equivalent for conversion
        const convertFrom = userCurrency === 'USDT' ? 'USD' : userCurrency;
        
        const conversionResponse = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${convertFrom}`
        );
        
        if (conversionResponse.ok) {
          const conversionData = await conversionResponse.json();
          exchangeRate = conversionData.rates['INR'] || 1;
          baseAmount = amountNum * exchangeRate;
        }
      } catch (convError) {
        console.error('Currency conversion error:', convError);
        // Continue with original amount if conversion fails
      }
    }

    // Prepare metadata
    const metadata: any = {
      original_type: originalType,
      description: sanitizedDescription,
      payment_source: payment_source,
    };

    if (userCurrency !== 'INR') {
      metadata.exchange_rate = exchangeRate;
      metadata.base_currency = 'INR';
      metadata.base_amount = baseAmount;
    }

    // Insert transaction
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        amount: amountNum,
        currency: userCurrency,
        type: dbType,
        merchant: sanitizedMerchant,
        notes: sanitizedNotes,
        category_id,
        account_id,
        timestamp: timestamp || new Date().toISOString(),
        tags,
        family_member_id,
        ip_hash: ipHash,
        metadata,
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction insert error:', transactionError);
      throw transactionError;
    }

    // Log the action
    await supabaseClient.from('logs').insert({
      user_id: user.id,
      action: 'create_transaction',
      ip_hash: ipHash,
      user_agent: req.headers.get('user-agent'),
      metadata: { transaction_id: transaction.id },
    });

    return new Response(
      JSON.stringify({ transaction }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in transactions function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
