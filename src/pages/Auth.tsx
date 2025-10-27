import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Shield, BarChart3, Users } from "lucide-react";
import logoImage from "@/assets/ns-tracker-logo.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/dashboard");
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate("/dashboard");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message);
    else toast.success("Signed in successfully!");
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error(error.message);
    else toast.success("Account created!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-primary/10 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block space-y-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <img src={logoImage} alt="NS TRACKER" className="h-16 w-16 rounded-full ring-4 ring-primary shadow-xl" />
            <div>
              <h1 className="text-4xl font-bold gradient-text">NS TRACKER</h1>
              <p className="text-muted-foreground">Your Complete Financial Command Center</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover-scale">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">Real-time tracking with animated graphs</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover-scale">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg gradient-success flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Family Management</h3>
                <p className="text-sm text-muted-foreground">Track finances for all family members</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover-scale">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-warning to-destructive flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI Financial Advisor</h3>
                <p className="text-sm text-muted-foreground">Personalized advice powered by AI</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full shadow-2xl animate-scale-in">
          <CardHeader className="text-center">
            <div className="md:hidden flex items-center justify-center gap-3 mb-4">
              <img src={logoImage} alt="NS TRACKER" className="h-12 w-12 rounded-full ring-2 ring-primary" />
              <h1 className="text-2xl font-bold">NS TRACKER</h1>
            </div>
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Sign in or create account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signin">Email</Label>
                    <Input id="email-signin" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin">Password</Label>
                    <Input id="password-signin" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input id="email-signup" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
