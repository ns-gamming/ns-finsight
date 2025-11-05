import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Calendar } from "lucide-react";
import { DateRangeFilter } from "./DateRangeFilter";

interface EnhancedFinancialChartsProps {
  monthlyTrend?: Array<{ month: string; income: number; expenses: number; timestamp?: string }>;
  categoryBreakdown?: Array<{ category: string; amount: number }>;
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export const EnhancedFinancialCharts = ({ monthlyTrend = [], categoryBreakdown = [] }: EnhancedFinancialChartsProps) => {
  const [granularity, setGranularity] = useState<"day" | "month" | "year">("month");
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  const hasData = monthlyTrend.length > 0 || categoryBreakdown.length > 0;

  const exportToCSV = () => {
    const csv = [
      ["Month", "Income", "Expenses"],
      ...monthlyTrend.map(d => [d.month, d.income, d.expenses])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-data-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toFixed(2)}
            </p>
          ))}
          {payload[0]?.payload?.timestamp && (
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(payload[0].payload.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (!hasData) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            No transaction data yet. Add your first transaction to see insights!
          </CardContent>
        </Card>
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Category breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            No category data yet
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2 items-center">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select value={granularity} onValueChange={(v: any) => setGranularity(v)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {monthlyTrend.length > 0 && (
          <Card className="shadow-card hover-scale animate-fade-in transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📈 Income vs Expenses
              </CardTitle>
              <CardDescription>Trend analysis - {granularity}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3} 
                    name="Income" 
                    dot={{ fill: "hsl(var(--success))", r: 5 }}
                    activeDot={{ r: 7 }}
                    animationDuration={1000}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={3} 
                    name="Expenses" 
                    dot={{ fill: "hsl(var(--destructive))", r: 5 }}
                    activeDot={{ r: 7 }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {categoryBreakdown.length > 0 && (
          <Card className="shadow-card hover-scale animate-fade-in transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Spending by Category
              </CardTitle>
              <CardDescription>This period's breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="hsl(var(--primary))"
                    dataKey="amount"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {monthlyTrend.length > 0 && (
          <Card className="shadow-card md:col-span-2 hover-scale animate-fade-in transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 {granularity === "day" ? "Daily" : granularity === "month" ? "Monthly" : "Yearly"} Overview
              </CardTitle>
              <CardDescription>Bar chart comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(var(--success))" name="Income" radius={[8, 8, 0, 0]} animationDuration={800} />
                  <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" radius={[8, 8, 0, 0]} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};