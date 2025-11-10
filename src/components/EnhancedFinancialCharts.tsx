
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EnhancedFinancialChartsProps {
  monthlyTrend?: Array<{ month: string; income: number; expenses: number; timestamp?: string }>;
  categoryBreakdown?: Array<{ category: string; amount: number }>;
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export const EnhancedFinancialCharts = ({ monthlyTrend = [], categoryBreakdown = [] }: EnhancedFinancialChartsProps) => {
  const [granularity, setGranularity] = useState<"day" | "month" | "year">("month");
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showTrendLine, setShowTrendLine] = useState(false);
  const [smoothCurve, setSmoothCurve] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState<"slow" | "normal" | "fast">("normal");

  const hasData = monthlyTrend.length > 0 || categoryBreakdown.length > 0;

  // Calculate detailed statistics
  const stats = monthlyTrend.reduce((acc, item) => {
    acc.totalIncome += item.income;
    acc.totalExpenses += item.expenses;
    acc.netSavings += (item.income - item.expenses);
    return acc;
  }, { totalIncome: 0, totalExpenses: 0, netSavings: 0 });

  const avgIncome = monthlyTrend.length > 0 ? stats.totalIncome / monthlyTrend.length : 0;
  const avgExpenses = monthlyTrend.length > 0 ? stats.totalExpenses / monthlyTrend.length : 0;
  const savingsRate = stats.totalIncome > 0 ? (stats.netSavings / stats.totalIncome) * 100 : 0;

  const animationDuration = animationSpeed === "slow" ? 1500 : animationSpeed === "fast" ? 500 : 1000;

  const exportToCSV = () => {
    const csv = [
      ["Month", "Income", "Expenses", "Savings", "Savings Rate"],
      ...monthlyTrend.map(d => [
        d.month, 
        d.income, 
        d.expenses, 
        d.income - d.expenses,
        d.income > 0 ? `${((d.income - d.expenses) / d.income * 100).toFixed(2)}%` : "0%"
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ns-finsight-data-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const exportToPNG = () => {
    // This would require html2canvas or similar library
    alert("PNG export coming soon!");
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload.find((p: any) => p.dataKey === "income")?.value || 0;
      const expenses = payload.find((p: any) => p.dataKey === "expenses")?.value || 0;
      const savings = income - expenses;
      const rate = income > 0 ? (savings / income * 100).toFixed(1) : 0;

      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-xl">
          <p className="font-bold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <p className="text-xs font-medium">{entry.name}:</p>
              <p className="text-xs font-bold">₹{entry.value.toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t border-border mt-2 pt-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              Net Savings: <span className={savings >= 0 ? "text-success font-bold" : "text-destructive font-bold"}>₹{savings.toFixed(2)}</span>
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Percent className="w-3 h-3" />
              Savings Rate: <span className="font-bold">{rate}%</span>
            </p>
          </div>
          {payload[0]?.payload?.timestamp && (
            <p className="text-xs text-muted-foreground mt-1 border-t border-border pt-1">
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card hover-lift">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs">
              <TrendingUp className="w-4 h-4 text-success" />
              Avg Income
            </CardDescription>
            <CardTitle className="text-xl text-success">₹{avgIncome.toFixed(0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-card hover-lift">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs">
              <TrendingDown className="w-4 h-4 text-destructive" />
              Avg Expenses
            </CardDescription>
            <CardTitle className="text-xl text-destructive">₹{avgExpenses.toFixed(0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-card hover-lift">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs">
              <DollarSign className="w-4 h-4 text-primary" />
              Net Savings
            </CardDescription>
            <CardTitle className={`text-xl ${stats.netSavings >= 0 ? 'text-success' : 'text-destructive'}`}>
              ₹{stats.netSavings.toFixed(0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-card hover-lift">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-xs">
              <Percent className="w-4 h-4 text-primary" />
              Savings Rate
            </CardDescription>
            <CardTitle className="text-xl text-primary">{savingsRate.toFixed(1)}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Controls */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="space-y-4">
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

                <Select value={chartType} onValueChange={(v: any) => setChartType(v)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={animationSpeed} onValueChange={(v: any) => setAnimationSpeed(v)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
                  <Download className="w-4 h-4" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportToPNG} className="gap-2">
                  <Download className="w-4 h-4" />
                  PNG
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2 border-t">
              <div className="flex items-center space-x-2">
                <Switch id="grid" checked={showGrid} onCheckedChange={setShowGrid} />
                <Label htmlFor="grid" className="text-xs">Grid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="legend" checked={showLegend} onCheckedChange={setShowLegend} />
                <Label htmlFor="legend" className="text-xs">Legend</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="labels" checked={showLabels} onCheckedChange={setShowLabels} />
                <Label htmlFor="labels" className="text-xs">Labels</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="smooth" checked={smoothCurve} onCheckedChange={setSmoothCurve} />
                <Label htmlFor="smooth" className="text-xs">Smooth</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="trend" checked={showTrendLine} onCheckedChange={setShowTrendLine} />
                <Label htmlFor="trend" className="text-xs">Trend</Label>
              </div>
            </div>
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
              <ResponsiveContainer width="100%" height={350}>
                {chartType === "line" ? (
                  <LineChart data={monthlyTrend}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />}
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    {showLegend && <Legend />}
                    <Line 
                      type={smoothCurve ? "monotone" : "linear"}
                      dataKey="income" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={3} 
                      name="Income" 
                      dot={{ fill: "hsl(var(--success))", r: 5 }}
                      activeDot={{ r: 7 }}
                      animationDuration={animationDuration}
                    />
                    <Line 
                      type={smoothCurve ? "monotone" : "linear"}
                      dataKey="expenses" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={3} 
                      name="Expenses" 
                      dot={{ fill: "hsl(var(--destructive))", r: 5 }}
                      activeDot={{ r: 7 }}
                      animationDuration={animationDuration}
                    />
                  </LineChart>
                ) : chartType === "bar" ? (
                  <BarChart data={monthlyTrend}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />}
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    {showLegend && <Legend />}
                    <Bar dataKey="income" fill="hsl(var(--success))" name="Income" radius={[8, 8, 0, 0]} animationDuration={animationDuration} />
                    <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" radius={[8, 8, 0, 0]} animationDuration={animationDuration} />
                  </BarChart>
                ) : (
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />}
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    {showLegend && <Legend />}
                    <Area 
                      type={smoothCurve ? "monotone" : "linear"}
                      dataKey="income" 
                      stroke="hsl(var(--success))" 
                      fill="url(#colorIncome)"
                      strokeWidth={2}
                      name="Income" 
                      animationDuration={animationDuration}
                    />
                    <Area 
                      type={smoothCurve ? "monotone" : "linear"}
                      dataKey="expenses" 
                      stroke="hsl(var(--destructive))" 
                      fill="url(#colorExpenses)"
                      strokeWidth={2}
                      name="Expenses" 
                      animationDuration={animationDuration}
                    />
                  </AreaChart>
                )}
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
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={showLabels}
                    label={showLabels ? ({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%` : undefined}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="amount"
                    animationBegin={0}
                    animationDuration={animationDuration}
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
                  {showLegend && <Legend />}
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
