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

    // Calculate date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Fetch last 30 days transactions
    const { data: recentTransactions } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('timestamp', thirtyDaysAgo.toISOString())
      .order('timestamp', { ascending: false });

    // Fetch last 6 months transactions for monthly trend
    const { data: sixMonthsTransactions } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .gte('timestamp', sixMonthsAgo.toISOString())
      .order('timestamp', { ascending: true });

    // Fetch all accounts
    const { data: accounts } = await supabaseClient
      .from('accounts')
      .select('*')
      .eq('user_id', user.id);

    // Fetch all assets
    const { data: assets } = await supabaseClient
      .from('assets')
      .select('*')
      .eq('user_id', user.id);

    // Fetch stocks and crypto
    const { data: stocks } = await supabaseClient
      .from('stocks')
      .select('*')
      .eq('user_id', user.id);

    const { data: crypto } = await supabaseClient
      .from('crypto')
      .select('*')
      .eq('user_id', user.id);

    // Fetch family members
    const { data: familyMembers } = await supabaseClient
      .from('family_members')
      .select('id, name, is_alive')
      .eq('user_id', user.id);

    // Calculate net worth (accounts + assets + stocks + crypto)
    const accountBalance = accounts?.reduce((sum, acc) => sum + parseFloat((acc.balance as any) || 0), 0) || 0;
    const assetValue = assets?.reduce((sum, asset) => sum + parseFloat((asset.value as any) || 0), 0) || 0;
    const stockValue = stocks?.reduce((sum, stock) => {
      const currentPrice = parseFloat((stock.current_price as any) || stock.purchase_price);
      return sum + (currentPrice * parseFloat((stock.quantity as any) || 0));
    }, 0) || 0;
    const cryptoValue = crypto?.reduce((sum, coin) => {
      const currentPrice = parseFloat((coin.current_price as any) || coin.purchase_price);
      return sum + (currentPrice * parseFloat((coin.quantity as any) || 0));
    }, 0) || 0;
    
    const netWorth = accountBalance + assetValue + stockValue + cryptoValue;

    // Calculate income and expenses for last 30 days
    const income = recentTransactions
      ?.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat((t.amount as any) || 0), 0) || 0;

    const expenses = recentTransactions
      ?.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat((t.amount as any) || 0), 0) || 0;

    // Calculate savings rate
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    // Category breakdown (last 30 days, expenses only)
    const categorySpending: Record<string, number> = {};
    recentTransactions?.forEach(t => {
      if (t.type === 'expense' && t.category_id) {
        categorySpending[String(t.category_id)] = (categorySpending[String(t.category_id)] || 0) + parseFloat((t.amount as any) || 0);
      }
    });

    const topCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    // Fetch category names
    const categoryIds = topCategories.map(([id]) => id);
    const { data: categories } = await supabaseClient
      .from('categories')
      .select('id, name')
      .in('id', categoryIds.length ? categoryIds : ['00000000-0000-0000-0000-000000000000']);

    const categoryBreakdown = topCategories.map(([id, amount]) => ({
      category: categories?.find(c => String(c.id) === id)?.name || 'Unknown',
      amount,
    }));

    // Monthly trend over last 6 months
    const months: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short' });
      months.push({ key, label });
    }
    const monthlySums: Record<string, { income: number; expenses: number }> = {};
    sixMonthsTransactions?.forEach(t => {
      const d = new Date(t.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const amount = parseFloat((t.amount as any) || 0);
      if (!monthlySums[key]) monthlySums[key] = { income: 0, expenses: 0 };
      if (t.type === 'income') monthlySums[key].income += amount;
      if (t.type === 'expense') monthlySums[key].expenses += amount;
    });
    const monthlyTrend = months.map(m => ({
      month: m.label,
      income: monthlySums[m.key]?.income || 0,
      expenses: monthlySums[m.key]?.expenses || 0,
    }));

    // Family summary (last 30 days)
    const familyTotals: Record<string, { income: number; expenses: number }> = {};
    const memberMap = new Map<string, { name: string; is_alive: boolean | null }>();
    familyMembers?.forEach(m => memberMap.set(String(m.id), { name: m.name, is_alive: (m as any).is_alive }));
    recentTransactions?.forEach(t => {
      const key = t.family_member_id ? String(t.family_member_id) : 'unassigned';
      const amount = parseFloat((t.amount as any) || 0);
      if (!familyTotals[key]) familyTotals[key] = { income: 0, expenses: 0 };
      if (t.type === 'income') familyTotals[key].income += amount;
      if (t.type === 'expense') familyTotals[key].expenses += amount;
    });
    const familySummary = Object.entries(familyTotals).map(([id, v]) => ({
      id,
      name: id === 'unassigned' ? 'Unassigned' : (memberMap.get(id)?.name || 'Unknown'),
      is_alive: id === 'unassigned' ? null : (memberMap.get(id)?.is_alive ?? null),
      income: v.income,
      expenses: v.expenses,
      net: v.income - v.expenses,
    }));

    // Daily cashflow for sparkline (last 30 days)
    const dailyCashflow: Record<string, number> = {};
    recentTransactions?.forEach(t => {
      const date = new Date(t.timestamp).toISOString().split('T')[0];
      const amount = parseFloat((t.amount as any) || 0);
      dailyCashflow[date] = (dailyCashflow[date] || 0) + (t.type === 'income' ? amount : -amount);
    });

    const cashflowSparkline = Object.entries(dailyCashflow)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, amount }));

    const recentTx = (recentTransactions || []).map(t => ({
      id: String(t.id),
      amount: parseFloat((t.amount as any) || 0),
      type: String(t.type),
      merchant: String(t.merchant || 'Unknown'),
      timestamp: String(t.timestamp),
      memberName: t.family_member_id ? (memberMap.get(String(t.family_member_id))?.name || 'Unknown') : undefined,
    }));

    return new Response(
      JSON.stringify({
        netWorth,
        monthlyIncome: income,
        monthlyExpenses: expenses,
        savingsRate,
        categoryBreakdown,
        cashflowSparkline,
        transactionCount: recentTransactions?.length || 0,
        monthlyTrend,
        recentTransactions: recentTx,
        familySummary,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in dashboard function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
