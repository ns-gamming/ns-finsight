import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { TrendingUp, LogOut, Plus, Moon, Sun, RefreshCw, MessageSquare, Users, Link as LinkIcon, Shield, Keyboard } from "lucide-react";
import logoImage from "../assets/ns-finsight-logo.png";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { BudgetDialog } from "@/components/BudgetDialog";
import { FinancialChatbot } from "@/components/FinancialChatbot";
import { useDashboardData } from "@/hooks/useDashboardData";
import { EnhancedFinancialCharts } from "@/components/EnhancedFinancialCharts";
import { AdvancedCharts } from "@/components/AdvancedCharts";
import { ShortcutsHelp } from "@/components/ShortcutsHelp";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { SecurityMonitor } from "@/components/SecurityMonitor";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import { QuickStats } from "@/components/QuickStats";
import { RecentTransactions } from "@/components/RecentTransactions";
import { FamilyOverview } from "@/components/FamilyOverview";
import { BudgetAlerts } from "@/components/BudgetAlerts";
import { SmartAlerts } from "@/components/SmartAlerts";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { BillReminders } from "@/components/BillReminders";
import { MarketHoldings } from "@/components/MarketHoldings";
import { UserProfile } from "@/components/UserProfile";
import { OrderTracking } from "@/components/OrderTracking";
import { PreciousMetals } from "@/components/PreciousMetals";
import { Achievements } from "@/components/Achievements";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { NewsWidget } from "@/components/NewsWidget";
import { AdSense } from "@/components/AdSense";
import { FinancialTips } from "@/components/FinancialTips";
import { RealityCheck } from "@/components/RealityCheck";
import { NotesWidget } from "@/components/NotesWidget";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { WalletManagement } from "@/components/WalletManagement";
import { UnifiedAssetDialog } from "@/components/UnifiedAssetDialog";
import { RealTimeAlerts } from "@/components/RealTimeAlerts";
import { CategoryManager } from "@/components/CategoryManager";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAssetDialog, setShowAssetDialog] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, refetch } = useDashboardData();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    toast.success(`${newTheme === "dark" ? "Dark" : "Light"} mode enabled`);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'n', ctrlKey: true, action: () => setShowAddTransaction(true), description: 'Add transaction' },
    { key: 'b', ctrlKey: true, action: () => setShowBudgetDialog(true), description: 'Set budget' },
    { key: 'c', ctrlKey: true, action: () => setShowChatbot(true), description: 'Open AI advisor' },
    { key: 'f', ctrlKey: true, action: () => navigate('/family'), description: 'View family' },
    { key: 'r', ctrlKey: true, action: () => refetch(), description: 'Refresh data' },
    { key: 'd', ctrlKey: true, action: toggleTheme, description: 'Toggle theme' },
    { key: '/', ctrlKey: true, action: () => setShowShortcuts(true), description: 'Show shortcuts' },
  ]);

  // Real-time updates for transactions
  useRealtimeUpdates({
    table: 'transactions',
    onInsert: () => refetch(),
    onUpdate: () => refetch(),
    onDelete: () => refetch(),
    enabled: true,
  });

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setTimeout(() => setInitialLoading(false), 1000); // Small delay for smooth transition
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

  if (initialLoading) {
    return <LoadingScreen />;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-floating-smooth"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-success/8 rounded-full blur-3xl animate-floating-smooth animate-morph" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-chart-4/5 rounded-full blur-3xl animate-pulse-slow animate-morph" style={{ animationDelay: "4s" }}></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-warning/5 rounded-full blur-2xl animate-floating-smooth" style={{ animationDelay: "3s" }}></div>
      </div>

      <header className="border-b border-border/50 glass-morphism sticky top-0 z-50 animate-slide-in-up backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-md animate-ripple"></div>
                <div className="h-full w-full rounded-full overflow-hidden bg-white shadow-lg ring-2 ring-primary/40 relative z-10 hover-glow">
                  <img 
                    src={logoImage} 
                    alt="NS FinSight Logo" 
                    className="h-full w-full object-contain p-1 transition-transform duration-300 hover:scale-110"
                    loading="eager"
                    onError={(e) => {
                      console.error('Logo failed to load');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary/90 to-success bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto] hover:scale-105 transition-transform">
                NS FinSight
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowChatbot(true)} title="AI Financial Advisor" className="hover-glow hover:scale-110 transition-all duration-300">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/family")} title="Family Members" className="hover-glow hover:scale-110 transition-all duration-300">
                <Users className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/privacy")} title="Privacy & Security" className="hover-glow hover:scale-110 transition-all duration-300">
                <Shield className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover-glow hover:scale-110 transition-all duration-300 hover:rotate-180">
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" onClick={handleSignOut} className="hover-glow hover:scale-105 transition-all duration-300">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
        <div className="mb-6 sm:mb-8 flex items-center justify-between animate-card-entrance">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-foreground via-primary to-foreground/70 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">Welcome back!</h2>
            <p className="text-muted-foreground text-sm sm:text-lg opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>Here's your financial overview</p>
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isLoading} className="shrink-0 hover-glow hover:scale-110 transition-all duration-300">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="opacity-0 animate-card-entrance" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                <QuickStats
                  netWorth={dashboardData?.netWorth || 0}
                  monthlyIncome={dashboardData?.monthlyIncome || 0}
                  monthlyExpenses={dashboardData?.monthlyExpenses || 0}
                  savingsRate={dashboardData?.savingsRate || 0}
                  totalIncome={dashboardData?.totalIncome || 0}
                  totalExpenses={dashboardData?.totalExpenses || 0}
                  averageSavingsRate={dashboardData?.averageSavingsRate || 0}
                  currency="INR"
                />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mb-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="opacity-0 animate-card-entrance card-shine" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                  <RealTimeAlerts />
                </div>
                <div className="opacity-0 animate-card-entrance card-shine" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                  <SmartAlerts />
                </div>
                <div className="opacity-0 animate-card-entrance card-shine" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                  <BudgetAlerts />
                </div>
                <div className="opacity-0 animate-card-entrance card-shine" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
                  <BillReminders />
                </div>
              </div>
              <div className="space-y-6">
                <div className="opacity-0 animate-card-entrance card-shine" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                  <RecentTransactions transactions={dashboardData?.recentTransactions} />
                </div>
              </div>
            </div>

            <div className="mb-8 opacity-0 animate-card-entrance card-shine perspective-card" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
              <AnalyticsDashboard />
            </div>

            <div className="mb-8 opacity-0 animate-card-entrance card-shine" style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}>
              <WalletManagement />
            </div>

            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              <div className="opacity-0 animate-card-entrance card-shine perspective-card" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
                <AdvancedCharts
                  monthlyTrend={dashboardData?.monthlyTrend}
                  categoryBreakdown={dashboardData?.categoryBreakdown}
                />
              </div>
              <div className="opacity-0 animate-card-entrance card-shine" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
                {/* @ts-ignore - runtime data shape enforced */}
                <FamilyOverview items={dashboardData?.familySummary || []} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <UserProfile />
              <SecurityMonitor />
            </div>

            <div className="mb-8">
              <CategoryManager />
            </div>

            <div className="mb-8">
              <Achievements />
            </div>

            <div className="mb-8">
              <AdSense slot="1234567890" format="horizontal" className="my-8" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mb-8">
              <div className="lg:col-span-2">
                <MarketHoldings />
              </div>
              <div className="space-y-6">
                <NewsWidget />
                <NotesWidget />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              <FinancialTips />
              <RealityCheck />
            </div>

            <div className="mb-8">
              <AdSense slot="0987654321" format="auto" />
            </div>

            <div className="mb-8">
              <PreciousMetals />
            </div>

            <div className="mb-8">
              <AdSense slot="2345678901" format="horizontal" />
            </div>

            <div className="mb-8">
              <OrderTracking />
            </div>

            <Card className="shadow-card opacity-0 animate-card-entrance glass-morphism border-border/50" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="animate-gradient-shift bg-gradient-to-r from-primary to-success bg-clip-text text-transparent bg-[length:200%_auto]">Quick Actions</span>
                </CardTitle>
                <CardDescription>Manage your finances efficiently</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button className="gap-2 hover-glow hover:scale-110 transition-all duration-300" onClick={() => setShowAddTransaction(true)}>
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </Button>
                <Button className="gap-2 hover-glow hover:scale-110 transition-all duration-300" onClick={() => setShowAssetDialog(true)}>
                  <TrendingUp className="h-4 w-4" />
                  Add Asset
                </Button>
                <Button variant="outline" className="gap-2 hover-glow hover:scale-110 transition-all duration-300" onClick={() => toast.info("Bank connection coming soon!")}>
                  <LinkIcon className="h-4 w-4" />
                  Connect Bank Account
                </Button>
                <Button variant="outline" className="gap-2 hover-glow hover:scale-110 transition-all duration-300" onClick={() => setShowBudgetDialog(true)}>
                  Set Budget
                </Button>
                <Button variant="outline" className="gap-2 hover-glow hover:scale-110 transition-all duration-300" onClick={() => navigate("/family")}>
                  <Users className="h-4 w-4" />
                  Manage Family
                </Button>
                  <Button variant="outline" className="gap-2 hover-glow hover:scale-110 transition-all duration-300" onClick={() => setShowShortcuts(true)}>
                    <Keyboard className="h-4 w-4" />
                    Keyboard Shortcuts
                  </Button>
              </CardContent>
            </Card>
          </>
        )}

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

        <UnifiedAssetDialog
          open={showAssetDialog}
          onOpenChange={setShowAssetDialog}
          onSuccess={() => refetch()}
        />

        <FinancialChatbot
          open={showChatbot}
          onOpenChange={setShowChatbot}
        />

        <ShortcutsHelp
          open={showShortcuts}
          onOpenChange={setShowShortcuts}
        />

        {/* Floating Action Button for quick transaction add */}
        <FloatingActionButton onClick={() => setShowAddTransaction(true)} />
      </main>
    </div>
  );
};

export default Dashboard;