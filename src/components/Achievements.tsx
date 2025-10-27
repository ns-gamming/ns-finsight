import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Award, TrendingUp, Target, Calendar, Zap } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description?: string;
  category: string;
  achieved_at: string;
  milestone_value?: number;
  icon?: string;
}

export const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
    checkAndAwardAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("achieved_at", { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error: any) {
      console.error("Failed to load achievements:", error);
    }
  };

  const checkAndAwardAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check for first transaction
      const { data: transactions } = await supabase
        .from("transactions")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (transactions && transactions.length > 0) {
        const { data: existing } = await supabase
          .from("achievements")
          .select("id")
          .eq("user_id", user.id)
          .eq("category", "first_transaction")
          .single();

        if (!existing) {
          await supabase.from("achievements").insert({
            user_id: user.id,
            title: "First Step",
            description: "Added your first transaction",
            category: "first_transaction",
            icon: "🎯",
          });
        }
      }

      // Check for savings milestone
      const { data: accounts } = await supabase
        .from("accounts")
        .select("balance")
        .eq("user_id", user.id);

      if (accounts) {
        const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
        
        if (totalBalance >= 10000) {
          const { data: existing } = await supabase
            .from("achievements")
            .select("id")
            .eq("user_id", user.id)
            .eq("category", "savings")
            .eq("milestone_value", 10000)
            .single();

          if (!existing) {
            await supabase.from("achievements").insert({
              user_id: user.id,
              title: "Savings Champion",
              description: "Reached ₹10,000 in savings",
              category: "savings",
              milestone_value: 10000,
              icon: "💰",
            });
          }
        }
      }

      // Check for 7-day streak
      const { data: userData } = await supabase
        .from("users")
        .select("created_at")
        .eq("id", user.id)
        .single();

      if (userData) {
        const daysSinceJoin = Math.floor(
          (new Date().getTime() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceJoin >= 7) {
          const { data: existing } = await supabase
            .from("achievements")
            .select("id")
            .eq("user_id", user.id)
            .eq("category", "streak")
            .eq("milestone_value", 7)
            .single();

          if (!existing) {
            await supabase.from("achievements").insert({
              user_id: user.id,
              title: "Consistent Tracker",
              description: "Used NS TRACKER for 7 days",
              category: "streak",
              milestone_value: 7,
              icon: "🔥",
            });
          }
        }
      }

      loadAchievements();
    } catch (error) {
      console.error("Failed to check achievements:", error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "savings": return <TrendingUp className="w-4 h-4" />;
      case "investment": return <Target className="w-4 h-4" />;
      case "budget": return <Calendar className="w-4 h-4" />;
      case "streak": return <Zap className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "savings": return "bg-success/10 text-success border-success/20";
      case "investment": return "bg-primary/10 text-primary border-primary/20";
      case "budget": return "bg-warning/10 text-warning border-warning/20";
      case "streak": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-secondary/10 text-secondary border-secondary/20";
    }
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <div>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your financial milestones and wins</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">Start tracking to unlock achievements!</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border ${getCategoryColor(achievement.category)} animate-fade-in hover:scale-105 transition-transform`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{achievement.icon || "🏆"}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      {getCategoryIcon(achievement.category)}
                    </div>
                    <p className="text-sm opacity-90 mb-2">{achievement.description}</p>
                    <p className="text-xs opacity-70">
                      {new Date(achievement.achieved_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
