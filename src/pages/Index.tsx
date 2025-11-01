import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Sparkles, BarChart3, Zap, Target, Users } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import logo from "@/assets/ns-tracker-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const { trackPageView, trackClick } = useAnalytics();

  useEffect(() => {
    trackPageView('/');
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="container mx-auto px-4 py-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/")}>
            <img 
              src={logo} 
              alt="NS Tracker Logo" 
              className="w-14 h-14 rounded-full shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all hover:rotate-6 hover:shadow-glow object-cover bg-transparent"
              style={{ backgroundColor: 'transparent' }}
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              NS Tracker
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                trackClick('privacy-link', 'header');
                navigate("/privacy");
              }}
              className="hover:scale-105 transition-transform"
            >
              Privacy
            </Button>
            <Button 
              onClick={() => {
                trackClick('get-started-header', 'header');
                navigate("/auth");
              }}
              className="hover:scale-105 hover:shadow-lg transition-all animate-pulse-slow"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-20 animate-fade-in-up">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-scale-bounce hover:bg-primary/20 transition-colors">
            <Sparkles className="w-4 h-4 inline mr-2" />
            AI-Powered Finance Tracking
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Take Control of Your
            <span className="block gradient-primary bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              Financial Future
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Track expenses, analyze spending patterns, and get AI-powered insights to make smarter financial decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button 
              size="lg" 
              onClick={() => {
                trackClick('start-tracking-hero', 'hero-section');
                navigate("/auth");
              }} 
              className="gap-2 hover:scale-105 hover:shadow-glow transition-all"
            >
              Start Tracking Free
              <TrendingUp className="w-4 h-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => {
                trackClick('learn-more-hero', 'hero-section');
                navigate("/privacy");
              }}
              className="hover:scale-105 transition-transform"
            >
              Learn More
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">₹100M+</div>
              <div className="text-sm text-muted-foreground">Money Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <div className="p-6 rounded-2xl bg-card shadow-card border border-border/50 hover:shadow-glow hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
            <p className="text-sm text-muted-foreground">
              Google Gemini automatically categorizes transactions and detects spending anomalies.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card shadow-card border border-border/50 hover:shadow-glow hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success/10 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <BarChart3 className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Visualize spending patterns, track budgets, and forecast your financial future.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card shadow-card border border-border/50 hover:shadow-glow hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-warning/10 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <Shield className="w-6 h-6 text-warning" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              Bank-level security with encrypted data and privacy-preserving IP hashing.
            </p>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/40 hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Updates</h3>
            <p className="text-sm text-muted-foreground">
              Live data synchronization across all your devices with instant notifications.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-success/5 to-success/10 border border-success/20 hover:border-success/40 hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-success/20 mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Goal Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Set financial goals and track progress with motivating achievements and milestones.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-warning/5 to-warning/10 border border-warning/20 hover:border-warning/40 hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in-up group" style={{ animationDelay: '1s' }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-warning/20 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-warning" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Family Finance</h3>
            <p className="text-sm text-muted-foreground">
              Manage family budgets, invite members, and track shared expenses together.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-glow animate-fade-in-up hover:shadow-xl transition-shadow" style={{ animationDelay: '1.1s' }}>
          <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Ready to transform your finances?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join thousands tracking smarter with NS Tracker
          </p>
          <Button 
            size="lg" 
            onClick={() => {
              trackClick('create-account-cta', 'bottom-cta');
              navigate("/auth");
            }}
            className="hover:scale-105 hover:shadow-glow transition-all animate-pulse-slow"
          >
            Create Free Account
          </Button>
        </div>
      </main>

      <footer className="border-t border-border mt-20 animate-fade-in">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p className="hover:text-foreground transition-colors">© 2025 NS Tracker. Built with privacy and security in mind.</p>
          <div className="mt-2">
            <Button 
              variant="link" 
              onClick={() => {
                trackClick('privacy-footer', 'footer');
                navigate("/privacy");
              }} 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
