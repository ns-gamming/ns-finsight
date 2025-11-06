import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Calendar, PieChart as PieChartIcon } from "lucide-react";

interface HeatmapData {
  date: string;
  amount: number;
  dayOfWeek: number;
  weekOfMonth: number;
}

interface CategoryTrend {
  category: string;
  data: { month: string; amount: number }[];
}

export const AnalyticsDashboard = () => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [categoryTrends, setCategoryTrends] = useState<CategoryTrend[]>([]);
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch last 90 days of transactions
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount, timestamp, type, category_id, categories(name), metadata")
        .eq("user_id", user.id)
        .gte("timestamp", ninetyDaysAgo.toISOString())
        .order("timestamp", { ascending: true });

      if (transactions) {
        // Process heatmap data
        const heatmap: { [key: string]: number } = {};
        transactions.forEach((t) => {
          if (t.type === "expense") {
            const date = new Date(t.timestamp).toISOString().split("T")[0];
            const metadata = typeof t.metadata === 'object' && t.metadata !== null ? t.metadata as any : {};
            const baseAmount = metadata.base_amount || t.amount;
            heatmap[date] = (heatmap[date] || 0) + Number(baseAmount);
          }
        });

        const heatmapArray = Object.entries(heatmap).map(([date, amount]) => {
          const d = new Date(date);
          return {
            date,
            amount,
            dayOfWeek: d.getDay(),
            weekOfMonth: Math.ceil(d.getDate() / 7),
          };
        });
        setHeatmapData(heatmapArray);

        // Process category trends
        const categoryMap: { [key: string]: { [month: string]: number } } = {};
        transactions.forEach((t) => {
          if (t.type === "expense" && t.categories) {
            const month = new Date(t.timestamp).toLocaleDateString("en", { month: "short", year: "numeric" });
            const category = t.categories.name;
            const metadata = typeof t.metadata === 'object' && t.metadata !== null ? t.metadata as any : {};
            const baseAmount = metadata.base_amount || t.amount;
            
            if (!categoryMap[category]) categoryMap[category] = {};
            categoryMap[category][month] = (categoryMap[category][month] || 0) + Number(baseAmount);
          }
        });

        const trends = Object.entries(categoryMap)
          .slice(0, 5) // Top 5 categories
          .map(([category, months]) => ({
            category,
            data: Object.entries(months).map(([month, amount]) => ({ month, amount })),
          }));
        setCategoryTrends(trends);

        // Simple prediction (average + 10% growth)
        const totalSpent = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => {
            const metadata = typeof t.metadata === 'object' && t.metadata !== null ? t.metadata as any : {};
            return sum + Number(metadata.base_amount || t.amount);
          }, 0);
        const avgMonthly = totalSpent / 3; // Last 3 months
        setPredictions({
          nextMonth: avgMonthly * 1.1,
          trend: "increasing",
        });
      }
    } catch (error) {
      console.error("Analytics error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getHeatmapColor = (amount: number) => {
    if (amount > 5000) return "#ef4444";
    if (amount > 3000) return "#f97316";
    if (amount > 1500) return "#fbbf24";
    if (amount > 500) return "#a3e635";
    return "#86efac";
  };

  if (loading) {
    return (
      <Card className="col-span-full animate-fade-in">
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted/50 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-primary" />
          Analytics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="heatmap" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Spending Heatmap
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Category Trends
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Predictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="heatmap" className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-7 gap-2 p-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
              {heatmapData.map((day, idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded hover:scale-110 transition-transform duration-200 cursor-pointer"
                  style={{ backgroundColor: getHeatmapColor(day.amount) }}
                  title={`${day.date}: ₹${day.amount.toFixed(2)}`}
                />
              ))}
            </div>
            <div className="flex justify-center gap-4 text-xs">
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#86efac" }} />
                Low
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#fbbf24" }} />
                Medium
              </span>
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ef4444" }} />
                High
              </span>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 animate-fade-in">
            {categoryTrends.map((trend, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="font-medium">{trend.category}</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={trend.data}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                      {trend.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(var(--primary))`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4 animate-fade-in">
            <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Predictive Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded">
                  <span className="text-muted-foreground">Predicted Next Month Spending</span>
                  <span className="text-2xl font-bold">₹{predictions?.nextMonth?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded">
                  <span className="text-muted-foreground">Trend</span>
                  <span className="flex items-center gap-2 font-medium text-orange-500">
                    <TrendingUp className="w-4 h-4" />
                    {predictions?.trend}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
