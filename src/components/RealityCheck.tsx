import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Globe, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useDashboardData } from "@/hooks/useDashboardData";

export const RealityCheck = () => {
  const { data } = useDashboardData();
  const [percentile, setPercentile] = useState(0);
  const [globalRank, setGlobalRank] = useState("");
  const [savingsRank, setSavingsRank] = useState("");

  useEffect(() => {
    if (data) {
      // Calculate percentile based on monthly income
      // Average global income ranges (simplified for demo)
      const income = data.monthlyIncome;
      let rank = 50;
      
      if (income > 200000) rank = 95;
      else if (income > 100000) rank = 85;
      else if (income > 50000) rank = 70;
      else if (income > 30000) rank = 55;
      else if (income > 20000) rank = 45;
      else rank = 30;

      setPercentile(rank);

      // Determine global wealth position
      if (rank >= 90) setGlobalRank("Top 10% - Excellent Financial Position");
      else if (rank >= 70) setGlobalRank("Top 30% - Above Average Earnings");
      else if (rank >= 50) setGlobalRank("Middle Class - Average Earnings");
      else setGlobalRank("Growing Phase - Keep Building");

      // Savings rate analysis
      const savingsRate = data.savingsRate;
      if (savingsRate > 30) setSavingsRank("Exceptional Saver - Top 5%");
      else if (savingsRate > 20) setSavingsRank("Great Saver - Top 20%");
      else if (savingsRate > 10) setSavingsRank("Good Saver - Top 50%");
      else setSavingsRank("Room for Improvement");
    }
  }, [data]);

  if (!data) return null;

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary animate-pulse-slow" />
          <CardTitle>Reality Check</CardTitle>
        </div>
        <CardDescription>See how you compare globally</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Position */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Your Global Position</span>
            </div>
            <span className="text-sm font-bold text-primary">{percentile}th Percentile</span>
          </div>
          <Progress value={percentile} className="h-3" />
          <p className="text-xs text-muted-foreground">{globalRank}</p>
        </div>

        {/* Income Comparison */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold">Monthly Income Analysis</p>
          </div>
          <p className="text-2xl font-bold text-primary">₹{data.monthlyIncome.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.monthlyIncome > 50000 
              ? "You're earning above the national average!"
              : "Keep growing your income streams"}
          </p>
        </div>

        {/* Savings Rate */}
        <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-green-600" />
            <p className="text-sm font-semibold">Savings Performance</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{data.savingsRate.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">{savingsRank}</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">Monthly Expenses</p>
            <p className="text-lg font-bold">₹{data.monthlyExpenses.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border">
            <p className="text-xs text-muted-foreground mb-1">Net Worth</p>
            <p className="text-lg font-bold">₹{data.netWorth.toLocaleString()}</p>
          </div>
        </div>

        {/* Personalized Insight */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <p className="text-xs font-medium">💡 Personal Insight</p>
          <p className="text-xs text-muted-foreground mt-1">
            {data.savingsRate > 20 
              ? "Excellent work! You're saving more than most people. Consider investing surplus for wealth growth."
              : data.savingsRate > 0
              ? "Good start! Try to increase savings by 5% each month for faster wealth building."
              : "Focus on creating a positive cash flow. Start small - even ₹500/month makes a difference."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
