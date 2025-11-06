import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Bell, X, AlertCircle, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface Alert {
  id: string;
  type: "anomaly" | "budget" | "insight";
  title: string;
  description: string;
  timestamp: string;
  severity: "info" | "warning" | "error";
  read: boolean;
}

export const SmartAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const alertsList: Alert[] = [];

      // Fetch anomalies
      const { data: anomalies } = await supabase
        .from("anomalies")
        .select("*, transactions(amount, merchant, timestamp)")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      anomalies?.forEach((anomaly) => {
        alertsList.push({
          id: anomaly.id,
          type: "anomaly",
          title: "Unusual Transaction Detected",
          description: `Transaction of ₹${anomaly.transactions?.amount} at ${anomaly.transactions?.merchant} seems unusual. ${anomaly.reason}`,
          timestamp: anomaly.created_at,
          severity: "warning",
          read: false,
        });
      });

      // Add insights (mock for now, can be enhanced with AI)
      const today = new Date();
      const thisMonth = today.getMonth();
      const { data: monthlySpending } = await supabase
        .from("transactions")
        .select("amount, metadata")
        .eq("user_id", user.id)
        .eq("type", "expense")
        .gte("timestamp", new Date(today.getFullYear(), thisMonth, 1).toISOString());

      const totalSpent = monthlySpending?.reduce((sum, t) => {
        const metadata = typeof t.metadata === 'object' && t.metadata !== null ? t.metadata as any : {};
        const baseAmount = metadata.base_amount || t.amount;
        return sum + Number(baseAmount);
      }, 0) || 0;

      if (totalSpent > 50000) {
        alertsList.push({
          id: `insight-${today.getTime()}`,
          type: "insight",
          title: "High Spending This Month",
          description: `You've spent ₹${totalSpent.toFixed(2)} this month, which is higher than usual.`,
          timestamp: new Date().toISOString(),
          severity: "info",
          read: false,
        });
      }

      setAlerts(alertsList);
    } catch (error) {
      console.error("Fetch alerts error:", error);
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = async (alertId: string, alertType: string) => {
    if (alertType === "anomaly") {
      await supabase
        .from("anomalies")
        .update({ status: "dismissed" })
        .eq("id", alertId);
    }
    setAlerts(alerts.filter((a) => a.id !== alertId));
    toast.success("Alert dismissed");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "anomaly":
        return <AlertCircle className="w-4 h-4" />;
      case "budget":
        return <DollarSign className="w-4 h-4" />;
      case "insight":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Smart Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted/50 rounded animate-pulse" />
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
          <Bell className="w-5 h-5 text-primary" />
          Smart Alerts
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-auto animate-scale-in">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No alerts at the moment</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-300 animate-slide-in-right"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  alert.severity === "error" ? "bg-destructive/10 text-destructive" :
                  alert.severity === "warning" ? "bg-yellow-500/10 text-yellow-600" :
                  "bg-primary/10 text-primary"
                }`}>
                  {getIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 -mt-1"
                      onClick={() => dismissAlert(alert.id, alert.type)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
