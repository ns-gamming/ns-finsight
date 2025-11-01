import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface QuickStatsProps {
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
}

export const QuickStats = ({ netWorth, monthlyIncome, monthlyExpenses, savingsRate }: QuickStatsProps) => {
  const [animatedNetWorth, setAnimatedNetWorth] = useState(0);
  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedExpenses, setAnimatedExpenses] = useState(0);
  const [animatedSavings, setAnimatedSavings] = useState(0);

  // Animate numbers on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedNetWorth(netWorth * easeOut);
      setAnimatedIncome(monthlyIncome * easeOut);
      setAnimatedExpenses(monthlyExpenses * easeOut);
      setAnimatedSavings(savingsRate * easeOut);

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [netWorth, monthlyIncome, monthlyExpenses, savingsRate]);

  const savings = monthlyIncome - monthlyExpenses;
  const savingsChange = savings >= 0 ? 'positive' : 'negative';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card className="shadow-card hover:shadow-medium transition-all hover:scale-105 animate-fade-in-up cursor-pointer group">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Net Worth</p>
            <CardTitle className="text-3xl tabular-nums gradient-text">
              ₹{animatedNetWorth.toFixed(0).toLocaleString()}
            </CardTitle>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
            <span className="text-xs text-muted-foreground">Total balance</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-medium transition-all hover:scale-105 animate-fade-in-up cursor-pointer group" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Monthly Income</p>
            <CardTitle className="text-3xl tabular-nums text-success">
              ₹{animatedIncome.toFixed(0).toLocaleString()}
            </CardTitle>
          </div>
          <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge className="bg-success/10 text-success border-success/30 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              This month
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-medium transition-all hover:scale-105 animate-fade-in-up cursor-pointer group" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Monthly Expenses</p>
            <CardTitle className="text-3xl tabular-nums text-destructive">
              ₹{animatedExpenses.toFixed(0).toLocaleString()}
            </CardTitle>
          </div>
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingDown className="h-6 w-6 text-destructive" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              This month
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-medium transition-all hover:scale-105 animate-fade-in-up cursor-pointer group" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <CardTitle className="text-3xl tabular-nums text-primary">
              {animatedSavings.toFixed(0)}%
            </CardTitle>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Target className="h-6 w-6 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {savingsChange === 'positive' ? (
              <Badge className="bg-success/10 text-success border-success/30 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Good
              </Badge>
            ) : (
              <Badge className="bg-warning/10 text-warning border-warning/30 text-xs">
                <TrendingDown className="h-3 w-3 mr-1" />
                Improve
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              ₹{Math.abs(savings).toFixed(0)} saved
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
