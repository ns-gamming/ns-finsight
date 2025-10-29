import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { RecentTransactions } from "@/components/RecentTransactions";
import { useAnalytics } from "@/hooks/useAnalytics";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  email: string | null;
  date_of_birth: string | null;
  is_alive: boolean;
  avatar_url: string | null;
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

          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-primary/20 hover:border-primary/40 transition-colors">
              <AvatarImage src={member.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">{getInitials(member.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{member.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{member.relationship}</Badge>
                {member.is_alive !== null && (
                  <Badge variant={member.is_alive ? "default" : "secondary"}>
                    {member.is_alive ? "Active" : "Inactive"}
                  </Badge>
                )}
              </div>
              {member.email && (
                <p className="text-sm text-muted-foreground mt-1">{member.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{stats.totalIncome.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">₹{stats.totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.netAmount >= 0 ? 'text-success' : 'text-destructive'}`}>
                ₹{stats.netAmount.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">Income - Expenses</p>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up hover:shadow-lg transition-shadow" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.transactionCount}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Transactions for {member.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions familyMemberId={memberId} limit={10} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
