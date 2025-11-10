import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Shield, BarChart3, Users, Lock, Sparkles, TrendingUp, Zap, CheckCircle, Eye, EyeOff } from "lucide-react";
import logoImage from "@/assets/ns-tracker-logo.png";
import authBg from "@assets/stock_images/modern_abstract_grad_aebdcbb0.jpg";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back! Redirecting to your dashboard...");
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created successfully! Please check your email to verify your account.", {
        duration: 5000
      });
    }
    setLoading(false);
  };

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time tracking with animated graphs and detailed insights",
      gradient: "from-primary to-primary/60"
    },
    {
      icon: Users,
      title: "Family Management",
      description: "Track finances for all family members in one place",
      gradient: "from-success to-success/60"
    },
    {
      icon: Shield,
      title: "AI Financial Advisor",
      description: "Personalized advice powered by Google Gemini AI",
      gradient: "from-warning to-warning/60"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={authBg} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-primary/10 to-background/90"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-success/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-warning/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8 animate-fade-in">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <img 
                src={logoImage} 
                alt="NS TRACKER" 
                className="h-20 w-20 rounded-full ring-4 ring-primary/50 shadow-2xl relative z-10 hover-scale" 
              />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-success bg-clip-text text-transparent">
                NS TRACKER
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Your Complete Financial Command Center
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`feature-card-${index}`}
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 mt-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-success" />
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4 text-success" />
              <span>Encrypted Data</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>10,000+ Users</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full animate-scale-in">
          {/* Glassmorphism Card */}
          <Card className="w-full shadow-2xl backdrop-blur-xl bg-card/80 border-2 border-border/50 overflow-hidden">
            <CardHeader className="text-center space-y-2 pb-6">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
                <img src={logoImage} alt="NS TRACKER" className="h-14 w-14 rounded-full ring-2 ring-primary shadow-lg" />
                <div>
                  <h1 className="text-2xl font-bold gradient-text">NS TRACKER</h1>
                  <p className="text-xs text-muted-foreground">Financial Command Center</p>
                </div>
              </div>

              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                <Sparkles className="w-3 h-3 mr-2" />
                Join 10,000+ Smart Investors
              </div>
              
              <CardTitle className="text-3xl font-bold">Welcome</CardTitle>
              <CardDescription className="text-base">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-8">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50">
                  <TabsTrigger 
                    value="signin" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    data-testid="tab-signin"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    data-testid="tab-signup"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email-signin" className="text-sm font-medium">Email Address</Label>
                      <Input 
                        id="email-signin" 
                        type="email" 
                        placeholder="you@example.com"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                        data-testid="input-email-signin"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signin" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Input 
                          id="password-signin" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                          className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors pr-12"
                          data-testid="input-password-signin"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl transition-all" 
                      disabled={loading}
                      data-testid="button-signin"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Signing in...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Sign In
                          <TrendingUp className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-warning" />
                      Google OAuth coming soon - Sign in with your Google account
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email-signup" className="text-sm font-medium">Email Address</Label>
                      <Input 
                        id="email-signup" 
                        type="email" 
                        placeholder="you@example.com"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                        data-testid="input-email-signup"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Input 
                          id="password-signup" 
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          required 
                          minLength={6} 
                          className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors pr-12"
                          data-testid="input-password-signup"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Minimum 6 characters
                      </p>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-gradient-to-r from-success to-success/80 hover:shadow-xl transition-all" 
                      disabled={loading}
                      data-testid="button-signup"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating Account...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Create Free Account
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <a 
                        href="/privacy" 
                        className="text-primary hover:underline font-medium"
                        data-testid="link-privacy-policy"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Security Badge */}
              <div className="mt-8 p-4 rounded-xl bg-success/10 border border-success/20">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Your Data is Secure</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We use bank-level 256-bit encryption to protect your financial data. Your privacy is our top priority.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Trust Indicators */}
          <div className="lg:hidden flex flex-wrap justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-success" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-success" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
