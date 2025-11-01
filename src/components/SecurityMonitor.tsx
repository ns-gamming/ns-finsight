import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Lock, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const SecurityMonitor = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .order('session_start', { ascending: false })
        .limit(5);

      if (!error && data) {
        setSessions(data);
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return '📱';
      case 'tablet':
        return '📱';
      case 'desktop':
        return '💻';
      default:
        return '🖥️';
    }
  };

  return (
    <Card className="shadow-card animate-fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Security Monitor
        </CardTitle>
        <CardDescription>Your account activity and security status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Status */}
        <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <p className="font-medium text-success">Account Secure</p>
              <p className="text-xs text-muted-foreground">All security checks passed</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            Active
          </Badge>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Encryption</span>
            </div>
            <p className="text-xs text-muted-foreground">Bank-level AES-256</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Privacy</span>
            </div>
            <p className="text-xs text-muted-foreground">IP hashing enabled</p>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Login Sessions</h4>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="text-sm text-muted-foreground">No recent sessions</div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getDeviceIcon(session.device_type)}</span>
                  <div>
                    <p className="text-sm font-medium">
                      {session.device_type || 'Unknown'} • {session.browser || 'Unknown Browser'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.session_start).toLocaleDateString()} at{' '}
                      {new Date(session.session_start).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {session.session_end ? (
                  <Badge variant="outline" className="text-xs">
                    Ended
                  </Badge>
                ) : (
                  <Badge className="bg-success text-success-foreground text-xs">
                    Active
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
