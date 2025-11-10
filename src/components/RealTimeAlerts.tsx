
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Bell, X, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

interface Alert {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable: boolean;
  action_url?: string;
}

export const RealTimeAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useRealtimeUpdates({
    table: "transactions",
    onInsert: (payload) => {
      if (payload.amount > 5000) {
        const newAlert: Alert = {
          id: crypto.randomUUID(),
          type: "warning",
          title: "Large Transaction Detected",
          message: `A transaction of ₹${payload.amount} was added to ${payload.merchant}`,
          timestamp: new Date().toISOString(),
          read: false,
          actionable: true,
        };
        setAlerts((prev) => [newAlert, ...prev]);
        toast.warning(newAlert.title, { description: newAlert.message });
      }
    },
  });

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Real-Time Alerts
          </CardTitle>
          {alerts.filter((a) => !a.read).length > 0 && (
            <Badge variant="destructive">
              {alerts.filter((a) => !a.read).length} new
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No alerts at the moment</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border transition-all ${
                alert.read ? "bg-muted/30" : "bg-card border-primary/20"
              }`}
            >
              <div className="flex items-start gap-3">
                {getIcon(alert.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!alert.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(alert.id)}
                    >
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
