import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, PiggyBank, Target, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TipCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  color: string;
}

const TipCard = ({ icon, title, description, category, color }: TipCardProps) => (
  <div className={`p-4 rounded-lg border ${color} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 animate-fade-in`}>
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-primary/10">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <Badge variant="secondary" className="text-xs">{category}</Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

export const FinancialTips = () => {
  const tips = [
    {
      icon: <PiggyBank className="w-4 h-4 text-primary" />,
      title: "50/30/20 Rule",
      description: "Allocate 50% for needs, 30% for wants, and 20% for savings. This balanced approach ensures financial stability while allowing flexibility.",
      category: "Budgeting",
      color: "border-blue-500/20 bg-blue-500/5"
    },
    {
      icon: <Target className="w-4 h-4 text-primary" />,
      title: "Emergency Fund Priority",
      description: "Build 3-6 months of expenses as emergency fund before aggressive investing. This protects you from unexpected financial shocks.",
      category: "Savings",
      color: "border-green-500/20 bg-green-500/5"
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-primary" />,
      title: "Diversify Investments",
      description: "Don't put all eggs in one basket. Spread investments across stocks, bonds, real estate, and gold for balanced growth and risk.",
      category: "Investment",
      color: "border-purple-500/20 bg-purple-500/5"
    },
    {
      icon: <Shield className="w-4 h-4 text-primary" />,
      title: "Review Subscriptions Monthly",
      description: "Cancel unused subscriptions and services. Small recurring charges add up - review them every month to save hundreds annually.",
      category: "Expense",
      color: "border-orange-500/20 bg-orange-500/5"
    },
    {
      icon: <Lightbulb className="w-4 h-4 text-primary" />,
      title: "Track Every Transaction",
      description: "Record all income and expenses without exception. Awareness is the first step to financial control and better decision-making.",
      category: "Habit",
      color: "border-yellow-500/20 bg-yellow-500/5"
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-primary" />,
      title: "Automate Savings",
      description: "Set up automatic transfers to savings on payday. Paying yourself first ensures consistent wealth building over time.",
      category: "Strategy",
      color: "border-cyan-500/20 bg-cyan-500/5"
    }
  ];

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary animate-pulse-slow" />
          <CardTitle>Financial Tips & Advice</CardTitle>
        </div>
        <CardDescription>Expert recommendations for better money management</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {tips.map((tip, index) => (
            <TipCard key={index} {...tip} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
