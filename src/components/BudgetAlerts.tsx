import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface BudgetStatus {
  category: string;
  budgetAmount: number;
  spent: number;
  percentage: number;
  status: "safe" | "warning" | "exceeded";
}

export const BudgetAlerts = () => {
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgetStatus();
    const interval = setInterval(fetchBudgetStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchBudgetStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch active budgets
      const { data: budgetData, error: budgetError } = await supabase
        .from("budgets")
        .select("*, categories(name)")
        .eq("user_id", user.id)
        .gte("end_date", new Date().toISOString().split("T")[0]);

      if (budgetError) throw budgetError;

      // Calculate spending for each budget
      const statusPromises = budgetData?.map(async (budget) => {
        const { data: transactions } = await supabase
          .from("transactions")
          .select("amount, metadata")
          .eq("user_id", user.id)
          .eq("category_id", budget.category_id)
          .eq("type", "expense")
          .gte("timestamp", budget.start_date)
          .lte("timestamp", budget.end_date);

        const spent = transactions?.reduce((sum, t) => {
          const metadata = typeof t.metadata === 'object' && t.metadata !== null ? t.metadata as any : {};
          const baseAmount = metadata.base_amount || t.amount;
          return sum + Number(baseAmount);
        }, 0) || 0;

        const percentage = (spent / Number(budget.amount)) * 100;
        let status: "safe" | "warning" | "exceeded" = "safe";
        
        if (percentage >= 100) status = "exceeded";
        else if (percentage >= 80) status = "warning";

        // Show toast notification if exceeded or warning
        if (status === "exceeded" && percentage >= 100 && percentage < 105) {
          toast.error(`Budget exceeded for ${budget.categories?.name}!`, {
            description: `You've spent ₹${spent.toFixed(2)} of ₹${budget.amount}`,
          });
        } else if (status === "warning" && percentage >= 80 && percentage < 85) {
          toast.warning(`Budget warning for ${budget.categories?.name}`, {
            description: `You've used ${percentage.toFixed(0)}% of your budget`,
          });
        }

        return {
          category: budget.categories?.name || "Unknown",
          budgetAmount: Number(budget.amount),
          spent,
          percentage: Math.min(percentage, 100),
          status,
        };
      }) || [];

      const statuses = await Promise.all(statusPromises);
      setBudgets(statuses);
    } catch (error: any) {
      console.error("Budget status error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Budget Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          Budget Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgets.length === 0 ? (
          <Alert>
            <AlertDescription>No active budgets found. Create budgets to track your spending!</AlertDescription>
          </Alert>
        ) : (
          budgets.map((budget, idx) => (
            <div key={idx} className="space-y-2 p-3 rounded-lg border bg-card hover:shadow-md transition-all duration-300 animate-scale-in">
              <div className="flex justify-between items-center">
                <span className="font-medium">{budget.category}</span>
                <Badge
                  variant={
                    budget.status === "exceeded"
                      ? "destructive"
                      : budget.status === "warning"
                      ? "default"
                      : "secondary"
                  }
                  className="animate-fade-in"
                >
                  {budget.status === "safe" && <CheckCircle className="w-3 h-3 mr-1" />}
                  {budget.status === "warning" && <TrendingUp className="w-3 h-3 mr-1" />}
                  {budget.status === "exceeded" && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {budget.percentage.toFixed(0)}%
                </Badge>
              </div>
              <Progress value={budget.percentage} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{budget.spent.toFixed(2)} spent</span>
                <span>₹{budget.budgetAmount.toFixed(2)} budget</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
