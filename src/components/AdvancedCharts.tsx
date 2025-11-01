import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, PieChart as PieChartIcon } from "lucide-react";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

interface AdvancedChartsProps {
  monthlyTrend?: Array<{ month: string; income: number; expenses: number; }>;
  categoryBreakdown?: Array<{ category: string; amount: number; }>;
  dailyData?: Array<{ date: string; amount: number; type: string; }>;
}

export const AdvancedCharts = ({ monthlyTrend = [], categoryBreakdown = [], dailyData = [] }: AdvancedChartsProps) => {
  // Generate comparison data
  const comparisonData = monthlyTrend.map(item => ({
    ...item,
    savings: item.income - item.expenses,
    savingsRate: item.income > 0 ? ((item.income - item.expenses) / item.income * 100) : 0
  }));

  // Top 5 categories
  const topCategories = [...categoryBreakdown].sort((a, b) => b.amount - a.amount).slice(0, 5);

  // Budget performance (mock data - replace with real data)
  const budgetPerformance = categoryBreakdown.map(cat => ({
    category: cat.category,
    actual: cat.amount,
    budget: cat.amount * 1.2,
    fullMark: cat.amount * 1.5
  }));

  // Weekly trend (last 7 days)
  const weeklyTrend = dailyData.slice(-7).map(item => ({
    day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    income: item.type === 'income' ? item.amount : 0,
    expense: item.type === 'expense' ? item.amount : 0
  }));

  const totalIncome = comparisonData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = comparisonData.reduce((sum, item) => sum + item.expenses, 0);
  const avgSavingsRate = comparisonData.length > 0 
    ? comparisonData.reduce((sum, item) => sum + item.savingsRate, 0) / comparisonData.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
        <Card className="shadow-card hover:shadow-medium transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Total Income (6 months)
            </CardDescription>
            <CardTitle className="text-2xl text-success">₹{totalIncome.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-card hover:shadow-medium transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              Total Expenses (6 months)
            </CardDescription>
            <CardTitle className="text-2xl text-destructive">₹{totalExpenses.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-card hover:shadow-medium transition-shadow">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-primary" />
              Avg Savings Rate
            </CardDescription>
            <CardTitle className="text-2xl text-primary">{avgSavingsRate.toFixed(1)}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="shadow-card animate-fade-in-up">
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>Monthly financial overview with savings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={comparisonData}>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    fill="url(#colorIncome)" 
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    animationDuration={1000}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    fill="url(#colorExpenses)" 
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    animationDuration={1000}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    animationDuration={1500}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="shadow-card animate-fade-in-up">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Last 7 days income & expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="income" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} animationDuration={800} />
                    <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} animationDuration={800} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle>Savings Rate Trend</CardTitle>
                <CardDescription>Monthly savings percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={comparisonData}>
                    <defs>
                      <linearGradient id="colorSavingsRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" unit="%" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="savingsRate" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#colorSavingsRate)"
                      strokeWidth={3}
                      animationDuration={1200}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="shadow-card animate-fade-in-up">
              <CardHeader>
                <CardTitle>Spending Distribution</CardTitle>
                <CardDescription>Breakdown by category</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
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
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle>Top 5 Categories</CardTitle>
                <CardDescription>Highest spending areas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={topCategories} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--popover))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="shadow-card animate-fade-in-up">
            <CardHeader>
              <CardTitle>Budget vs Actual</CardTitle>
              <CardDescription>Performance against budget targets</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={budgetPerformance.slice(0, 6)}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                  <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                  <Radar 
                    name="Actual" 
                    dataKey="actual" 
                    stroke="hsl(var(--destructive))" 
                    fill="hsl(var(--destructive))" 
                    fillOpacity={0.6}
                    animationDuration={1000}
                  />
                  <Radar 
                    name="Budget" 
                    dataKey="budget" 
                    stroke="hsl(var(--success))" 
                    fill="hsl(var(--success))" 
                    fillOpacity={0.3}
                    animationDuration={1200}
                  />
                  <Legend />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4">
          <Card className="shadow-card animate-fade-in-up">
            <CardHeader>
              <CardTitle>Multi-Metric Analysis</CardTitle>
              <CardDescription>Comprehensive financial view</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', r: 5 }}
                    animationDuration={800}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--destructive))', r: 5 }}
                    animationDuration={1000}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
