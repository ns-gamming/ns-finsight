import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, Zap, ArrowUpRight, ArrowDownRight, PiggyBank } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface QuickStatsProps {
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  totalIncome?: number;
  totalExpenses?: number;
  averageSavingsRate?: number;
  currency?: string;
}

export const QuickStats = ({
  netWorth,
  monthlyIncome,
  monthlyExpenses,
  savingsRate,
  totalIncome = 0,
  totalExpenses = 0,
  averageSavingsRate = 0,
  currency = "INR"
}: QuickStatsProps) => {
  const [animatedNetWorth, setAnimatedNetWorth] = useState(0);
  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedExpenses, setAnimatedExpenses] = useState(0);
  const [animatedSavings, setAnimatedSavings] = useState(0);
  const [animatedTotalIncome, setAnimatedTotalIncome] = useState(0);
  const [animatedTotalExpenses, setAnimatedTotalExpenses] = useState(0);
  const [animatedAvgSavings, setAnimatedAvgSavings] = useState(0);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

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
      setAnimatedTotalIncome(totalIncome * easeOut);
      setAnimatedTotalExpenses(totalExpenses * easeOut);
      setAnimatedAvgSavings(averageSavingsRate * easeOut);

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [netWorth, monthlyIncome, monthlyExpenses, savingsRate, totalIncome, totalExpenses, averageSavingsRate]);

  const savings = monthlyIncome - monthlyExpenses;
  const savingsChange = savings >= 0 ? 'positive' : 'negative';

  const getCurrencySymbol = () => {
    const symbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
      USDT: "₮",
    };
    return symbols[currency] || "₹";
  };

  const formatCurrency = (amount: number) => {
    return `${getCurrencySymbol()}${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const stats = [
    {
      id: "networth",
      title: "Net Worth",
      value: animatedNetWorth,
      icon: DollarSign,
      color: "primary",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      badge: { icon: Zap, text: "Live", variant: "outline" as const },
      description: "Total balance across all accounts, assets, and investments"
    },
    {
      id: "monthly-income",
      title: "Monthly Income",
      value: animatedIncome,
      icon: TrendingUp,
      color: "success",
      bgColor: "bg-success/10",
      textColor: "text-success",
      badge: { icon: Calendar, text: "This month", variant: "default" as const, className: "bg-success/10 text-success border-success/30" },
      description: "Total income received this month",
      delta: monthlyIncome > 0 ? "+12.5%" : "0%"
    },
    {
      id: "monthly-expenses",
      title: "Monthly Expenses",
      value: animatedExpenses,
      icon: TrendingDown,
      color: "destructive",
      bgColor: "bg-destructive/10",
      textColor: "text-destructive",
      badge: { icon: Calendar, text: "This month", variant: "default" as const, className: "bg-destructive/10 text-destructive border-destructive/30" },
      description: "Total expenses this month",
      delta: monthlyExpenses > 0 ? "+8.2%" : "0%"
    },
    {
      id: "savings-rate",
      title: "Savings Rate",
      value: animatedSavings,
      icon: Target,
      color: "primary",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      isPercentage: true,
      badge: savingsChange === 'positive'
        ? { icon: TrendingUp, text: "Good", variant: "default" as const, className: "bg-success/10 text-success border-success/30" }
        : { icon: TrendingDown, text: "Improve", variant: "default" as const, className: "bg-warning/10 text-warning border-warning/30" },
      description: `Savings rate = (Income – Expense) ÷ Income × 100. You saved ${formatCurrency(Math.abs(savings))}`
    },
    {
      id: "total-income",
      title: "Total Income",
      value: animatedTotalIncome,
      icon: ArrowUpRight,
      color: "success",
      bgColor: "bg-success/10",
      textColor: "text-success",
      badge: { icon: Calendar, text: "All time", variant: "outline" as const },
      description: "Cumulative income across all all time"
    },
    {
      id: "total-expenses",
      title: "Total Expenses",
      value: animatedTotalExpenses,
      icon: ArrowDownRight,
      color: "destructive",
      bgColor: "bg-destructive/10",
      textColor: "text-destructive",
      badge: { icon: Calendar, text: "All time", variant: "outline" as const },
      description: "Cumulative expenses across all time"
    },
    {
      id: "avg-savings-rate",
      title: "Average Savings Rate",
      value: animatedAvgSavings,
      icon: PiggyBank,
      color: "primary",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      isPercentage: true,
      badge: { icon: TrendingUp, text: "Average", variant: "outline" as const },
      description: "Your average savings rate over all months"
    }
  ];

  return (
    <>
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.slice(0, 4).map((stat, index) => {
          const Icon = stat.icon;
          const BadgeIcon = stat.badge.icon;

          return (
            <Card
              key={stat.id}
              className={cn(
                "shadow-card card-hover-effect glass-effect animate-glow-pulse transition-all duration-300",
                stat.bgColor
              )}
              style={{ animationDelay: `${index * 0.1}s`,
                background: `linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card)/${0.95 - index * 0.05}) 100%)`
              }}
              onClick={() => setSelectedCard(stat.id)}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Decorative circle */}
              <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${stat.bgColor} opacity-10 group-hover:scale-150 transition-transform duration-700`} />

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={stat.badge.variant} className={`text-xs ${stat.badge.className || ''} backdrop-blur-sm`}>
                    <BadgeIcon className="h-3 w-3 mr-1" />
                    {stat.badge.text}
                  </Badge>
                  <div className={`h-14 w-14 rounded-2xl animate-bounce-subtle ${stat.bgColor} flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                    <Icon className={`h-7 w-7 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.title}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`text-4xl font-black tabular-nums ${stat.textColor} group-hover:scale-105 transition-transform origin-left relative`}>
                    <span className="relative z-10">
                      {stat.isPercentage
                        ? `${stat.value.toFixed(0)}%`
                        : formatCurrency(stat.value)
                      }
                    </span>
                    <div className="absolute inset-0 animate-shimmer"></div>
                  </div>
                  {stat.delta && (
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${stat.textColor}`}>{stat.delta}</span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {stats.slice(4).map((stat, index) => {
          const Icon = stat.icon;
          const BadgeIcon = stat.badge.icon;

          return (
            <Card
              key={stat.id}
              className={cn(
                "shadow-card card-hover-effect glass-effect animate-glow-pulse transition-all duration-300",
                stat.bgColor
              )}
              style={{ animationDelay: `${(index + 4) * 0.1}s`,
                background: `linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card)/0.9) 100%)`
              }}
              onClick={() => setSelectedCard(stat.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${stat.bgColor} opacity-10 group-hover:scale-150 transition-transform duration-700`} />

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={stat.badge.variant} className={`text-xs ${stat.badge.className || ''} backdrop-blur-sm`}>
                    <BadgeIcon className="h-3 w-3 mr-1" />
                    {stat.badge.text}
                  </Badge>
                  <div className={`h-12 w-12 rounded-xl animate-bounce-subtle ${stat.bgColor} flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-md`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.title}</p>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-black tabular-nums ${stat.textColor} group-hover:scale-105 transition-transform origin-left relative`}>
                  <span className="relative z-10">
                    {stat.isPercentage
                      ? `${stat.value.toFixed(0)}%`
                      : formatCurrency(stat.value)
                    }
                  </span>
                  <div className="absolute inset-0 animate-shimmer"></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View Modal */}
      <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCard && (() => {
                const stat = stats.find(s => s.id === selectedCard);
                if (!stat) return null;
                const Icon = stat.icon;
                return (
                  <>
                    <Icon className={`h-5 w-5 ${stat.textColor}`} />
                    {stat.title}
                  </>
                );
              })()}
            </DialogTitle>
            <DialogDescription>
              {selectedCard && stats.find(s => s.id === selectedCard)?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCard && (() => {
              const stat = stats.find(s => s.id === selectedCard);
              if (!stat) return null;

              return (
                <div className="p-6 rounded-lg border bg-card">
                  <div className={`text-4xl font-bold ${stat.textColor} mb-2 relative`}>
                    <span className="relative z-10">
                      {stat.isPercentage
                        ? `${stat.value.toFixed(1)}%`
                        : formatCurrency(stat.value)
                      }
                    </span>
                    <div className="absolute inset-0 animate-shimmer"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stat.title === "Net Worth" && "This includes all your accounts, investments, stocks, crypto, and assets"}
                    {stat.title === "Monthly Income" && "Income received in the current month"}
                    {stat.title === "Monthly Expenses" && "Expenses paid in the current month"}
                    {stat.title === "Savings Rate" && `Current month savings: ${formatCurrency(savings)}`}
                    {stat.title === "Total Income" && "All-time cumulative income"}
                    {stat.title === "Total Expenses" && "All-time cumulative expenses"}
                    {stat.title === "Average Savings Rate" && "Your average savings rate over all months"}
                  </p>
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};