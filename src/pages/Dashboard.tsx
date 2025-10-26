import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { TrendingUp, LogOut, Plus, Moon, Sun, RefreshCw, MessageSquare, Users, Link as LinkIcon } from "lucide-react";
import logoImage from "@/assets/ns-tracker-logo.png";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { BudgetDialog } from "@/components/BudgetDialog";
import { FinancialChatbot } from "@/components/FinancialChatbot";
import { useDashboardData } from "@/hooks/useDashboardData";
import { FinancialCharts } from "@/components/FinancialCharts";
import { RecentTransactions } from "@/components/RecentTransactions";
import { FamilyOverview } from "@/components/FamilyOverview";
import { MarketHoldings } from "@/components/MarketHoldings";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, refetch } = useDashboardData();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    // Load theme preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    toast.success(`${newTheme === "dark" ? "Dark" : "Light"} mode enabled`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="NS TRACKER Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-xl font-bold">NS TRACKER</h1>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowChatbot(true)} title="AI Financial Advisor" className="hover-scale">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/family")} title="Family Members" className="hover-scale">
                <Users className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover-scale">
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="hover-scale">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">Here's your financial overview</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-card animate-fade-in">
            <CardHeader className="pb-3">
              <CardDescription>Net Worth</CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {isLoading ? "..." : `₹${Number(dashboardData?.netWorth || 0).toFixed(2)}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Total balance</p>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in">
            <CardHeader className="pb-3">
              <CardDescription>Monthly Income</CardDescription>
              <CardTitle className="text-3xl tabular-nums text-success">
                {isLoading ? "..." : `₹${Number(dashboardData?.monthlyIncome || 0).toFixed(2)}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in">
            <CardHeader className="pb-3">
              <CardDescription>Monthly Expenses</CardDescription>
              <CardTitle className="text-3xl tabular-nums text-destructive">
                {isLoading ? "..." : `₹${Number(dashboardData?.monthlyExpenses || 0).toFixed(2)}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in">
            <CardHeader className="pb-3">
              <CardDescription>Savings Rate</CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {isLoading ? "..." : `${Number(dashboardData?.savingsRate || 0).toFixed(0)}%`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <FinancialCharts
            monthlyTrend={dashboardData?.monthlyTrend}
            categoryBreakdown={dashboardData?.categoryBreakdown}
          />
        </div>

        <div className="mb-8">
          <RecentTransactions transactions={dashboardData?.recentTransactions} />
        </div>

        <div className="mb-8">
          {/* Family overview by member */}
          {/* @ts-ignore - runtime data shape enforced */}
          <FamilyOverview items={dashboardData?.familySummary || []} />
        </div>

        <div className="mb-8">
          <MarketHoldings />
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your finances</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button className="gap-2" onClick={() => setShowAddTransaction(true)}>
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => toast.info("Bank connection coming soon!")}>
              <LinkIcon className="h-4 w-4" />
              Connect Bank Account
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setShowBudgetDialog(true)}>
              Set Budget
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => navigate("/family")}>
              <Users className="h-4 w-4" />
              Manage Family
            </Button>
          </CardContent>
        </Card>

        <AddTransactionDialog
          open={showAddTransaction}
          onOpenChange={setShowAddTransaction}
          onSuccess={() => refetch()}
        />

        <BudgetDialog
          open={showBudgetDialog}
          onOpenChange={setShowBudgetDialog}
          onSuccess={() => refetch()}
        />

        <FinancialChatbot
          open={showChatbot}
          onOpenChange={setShowChatbot}
        />
      </main>
    </div>
  );
};

export default Dashboard;
