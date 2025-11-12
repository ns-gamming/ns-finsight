import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, DollarSign, Phone, Mail, Briefcase, Target, User, MapPin, Droplet, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { RecentTransactions } from "@/components/RecentTransactions";
import { useAnalytics } from "@/hooks/useAnalytics";
import { EnhancedFinancialCharts } from "@/components/EnhancedFinancialCharts";
import { BudgetAlerts } from "@/components/BudgetAlerts";
import { FinancialTips } from "@/components/FinancialTips";
import { AdSense } from "@/components/AdSense";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email: string | null;
  date_of_birth: string | null;
  is_alive: boolean;
  avatar_url: string | null;
  metadata?: {
    phone?: string;
    occupation?: string;
    income?: number;
    expenses?: number;
    savings_goal?: number;
    emergency_contact?: string;
    blood_group?: string;
    address?: string;
    notes?: string;
  };
}

interface MemberStats {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
}

export default function FamilyMemberDashboard() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { trackPageView } = useAnalytics();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [stats, setStats] = useState<MemberStats>({
    totalIncome: 0,
    totalExpenses: 0,
    netAmount: 0,
    transactionCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [monthlyTrend, setMonthlyTrend] = useState<Array<{ month: string; income: number; expenses: number }>>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Array<{ category: string; amount: number }>>([]);

  useEffect(() => {
    trackPageView(`/family/${memberId}/dashboard`);
    fetchMemberData();
  }, [memberId, trackPageView]);

  const fetchMemberData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch member details
      const { data: memberData, error: memberError } = await supabase
        .from("family_members")
        .select("*")
        .eq("id", memberId)
        .eq("user_id", user.id)
        .single();

      if (memberError) throw memberError;
      setMember(memberData);

      // Fetch member's transactions for stats
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: transactions, error: transError } = await supabase
        .from("transactions")
        .select("amount, type")
        .eq("family_member_id", memberId)
        .gte("timestamp", thirtyDaysAgo.toISOString());

      if (transError) throw transError;

      // Calculate stats
      const income = transactions
        ?.filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      
      const expenses = transactions
        ?.filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      setStats({
        totalIncome: income,
        totalExpenses: expenses,
        netAmount: income - expenses,
        transactionCount: transactions?.length || 0,
      });

      // Fetch monthly trend data for charts
      const { data: allTransactions } = await supabase
        .from("transactions")
        .select("amount, type, timestamp, category_id, categories(name)")
        .eq("family_member_id", memberId)
        .order("timestamp", { ascending: true });

      if (allTransactions) {
        // Group by month
        const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
        allTransactions.forEach((t) => {
          const month = new Date(t.timestamp).toLocaleDateString("en", { month: "short", year: "numeric" });
          if (!monthlyData[month]) {
            monthlyData[month] = { income: 0, expenses: 0 };
          }
          if (t.type === "income") {
            monthlyData[month].income += Number(t.amount);
          } else {
            monthlyData[month].expenses += Number(t.amount);
          }
        });

        setMonthlyTrend(Object.entries(monthlyData).map(([month, data]) => ({
          month,
          income: data.income,
          expenses: data.expenses,
        })));

        // Category breakdown
        const categoryData: { [key: string]: number } = {};
        allTransactions.forEach((t) => {
          if (t.type === "expense" && t.categories) {
            const category = t.categories.name;
            categoryData[category] = (categoryData[category] || 0) + Number(t.amount);
          }
        });

        setCategoryBreakdown(Object.entries(categoryData).map(([category, amount]) => ({
          category,
          amount,
        })));
      }
    } catch (error: any) {
      toast.error("Failed to load member data", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading member dashboard...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Member not found</p>
          <Button onClick={() => navigate("/family")}>Back to Family</Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const metadata = member?.metadata || {};

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <Button
            variant="ghost"
            onClick={() => navigate("/family")}
            className="mb-4 hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Family
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary/20 hover:border-primary/40 transition-colors">
              <AvatarImage src={member.avatar_url || undefined} />
              <AvatarFallback className="text-3xl">{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{member.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="text-sm">{member.relationship}</Badge>
                {member.is_alive !== null && (
                  <Badge variant={member.is_alive ? "default" : "secondary"}>
                    {member.is_alive ? "Active" : "Inactive"}
                  </Badge>
                )}
                {member.date_of_birth && (
                  <Badge variant="secondary" className="gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date().getFullYear() - new Date(member.date_of_birth).getFullYear()} years
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm text-muted-foreground">
                {member.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                )}
                {metadata.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{metadata.phone}</span>
                  </div>
                )}
                {metadata.occupation && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{metadata.occupation}</span>
                  </div>
                )}
                {metadata.blood_group && (
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4" />
                    <span>Blood: {metadata.blood_group}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* AdSense Ad */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <AdSense slot="YOUR_FAMILY_DASHBOARD_AD_SLOT" />
        </div>

        {/* Detailed Info Cards */}
        {(metadata.address || metadata.emergency_contact || metadata.notes) && (
          <div className="grid gap-4 md:grid-cols-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {metadata.address && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{metadata.address}</p>
                </CardContent>
              </Card>
            )}
            {metadata.emergency_contact && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{metadata.emergency_contact}</p>
                </CardContent>
              </Card>
            )}
            {metadata.notes && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{metadata.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Financial Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{stats.totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
              {metadata.income && (
                <p className="text-xs text-muted-foreground mt-1">Monthly Target: ₹{metadata.income}</p>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">₹{stats.totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
              {metadata.expenses && (
                <p className="text-xs text-muted-foreground mt-1">Budget: ₹{metadata.expenses}</p>
              )}
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: '0.5s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.netAmount >= 0 ? 'text-success' : 'text-destructive'}`}>
                ₹{stats.netAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Income - Expenses</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: '0.6s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {metadata.savings_goal ? (
                <>
                  <div className="text-2xl font-bold text-primary">₹{metadata.savings_goal}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.netAmount >= 0 ? 
                      `${((stats.netAmount / metadata.savings_goal) * 100).toFixed(1)}% achieved` :
                      'Keep saving!'
                    }
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.transactionCount}</div>
                  <p className="text-xs text-muted-foreground">Total Transactions</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <EnhancedFinancialCharts 
            monthlyTrend={monthlyTrend}
            categoryBreakdown={categoryBreakdown}
          />
        </div>

        {/* AdSense Ad */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <AdSense slot="YOUR_FAMILY_DASHBOARD_AD_SLOT_2" format="horizontal" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Budget Alerts */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
            <BudgetAlerts />
          </div>

          {/* Financial Tips */}
          <div className="animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <FinancialTips />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>All transactions for {member.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions familyMemberId={memberId} limit={20} />
            </CardContent>
          </Card>
        </div>

        {/* AdSense Ad */}
        <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <AdSense slot="YOUR_FAMILY_DASHBOARD_AD_SLOT_3" />
        </div>
      </div>
    </div>
  );
}
