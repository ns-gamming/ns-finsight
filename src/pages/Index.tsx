import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Shield, Sparkles, BarChart3, Zap, Target, Users, ArrowRight, CheckCircle, Star, Globe, Lock, TrendingDown } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import logo from "@/assets/ns-finsight-logo.png";
import heroImage from "@assets/stock_images/professional_busines_b7850363.jpg";
import analyticsImage from "@assets/stock_images/financial_growth_cha_7eb32286.jpg";
import mobileImage from "@assets/stock_images/mobile_banking_app_s_8c14e23c.jpg";
import familyImage from "@assets/stock_images/happy_family_budget__9bf25b53.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { trackPageView, trackClick } = useAnalytics();

  useEffect(() => {
    trackPageView('/');
  }, [trackPageView]);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description: "Google Gemini automatically categorizes transactions, detects spending anomalies, and provides personalized financial advice.",
      color: "from-primary/10 to-primary/5",
      iconColor: "text-primary",
      delay: "0.1s"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Visualize spending patterns with interactive charts, track budgets in real-time, and forecast your financial future with precision.",
      color: "from-success/10 to-success/5",
      iconColor: "text-success",
      delay: "0.2s"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Military-grade encryption, privacy-preserving IP hashing, and secure data storage protect your sensitive financial information.",
      color: "from-warning/10 to-warning/5",
      iconColor: "text-warning",
      delay: "0.3s"
    },
    {
      icon: Users,
      title: "Family Finance Hub",
      description: "Manage family budgets, invite members, track shared expenses, and view individual spending patterns—all in one place.",
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
      delay: "0.4s"
    },
    {
      icon: Target,
      title: "Smart Goal Tracking",
      description: "Set financial goals, monitor progress with visual milestones, and celebrate achievements with our gamification system.",
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-500",
      delay: "0.5s"
    },
    {
      icon: Zap,
      title: "Real-Time Sync",
      description: "Instant synchronization across all devices with live notifications, automatic backups, and offline-first architecture.",
      color: "from-orange-500/10 to-orange-500/5",
      iconColor: "text-orange-500",
      delay: "0.6s"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "₹100M+", label: "Money Tracked", icon: TrendingUp },
    { value: "99.9%", label: "Uptime", icon: CheckCircle },
    { value: "4.9/5", label: "User Rating", icon: Star }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer",
      content: "NS FinSight transformed how I manage my finances. The AI insights helped me save ₹50,000 in just 3 months!",
      rating: 5
    },
    {
      name: "Rahul Patel",
      role: "Business Owner",
      content: "Perfect for managing both personal and business expenses. The family tracking feature is a game-changer for our household.",
      rating: 5
    },
    {
      name: "Anjali Verma",
      role: "Marketing Manager",
      content: "Beautiful interface, powerful analytics, and the AI chatbot gives genuinely helpful financial advice. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-50 backdrop-blur-sm bg-background/80 border-b border-border/50 sticky top-0 animate-fade-in">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate("/")}
            data-testid="logo-header"
          >
            <img 
              src={logo} 
              alt="NS FinSight Logo" 
              className="h-14 w-auto shadow-lg transition-all group-hover:scale-110"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              NS FinSight
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                trackClick('privacy-link', 'header');
                navigate("/privacy");
              }}
              className="hover-scale"
              data-testid="button-privacy-header"
            >
              Privacy
            </Button>
            <Button 
              onClick={() => {
                trackClick('get-started-header', 'header');
                navigate("/auth");
              }}
              className="hover-scale shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl"
              data-testid="button-get-started-header"
            >
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Professional Finance Management" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-primary/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm font-medium mb-6 animate-scale-in hover:bg-primary/15 transition-all cursor-pointer"
              data-testid="badge-ai-powered"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Financial Insights • Trusted by 10,000+ Users
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up">
              Take Control of Your
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-success bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                Financial Future
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
              Track expenses, analyze spending patterns, and get AI-powered insights to make smarter financial decisions. Built for individuals and families.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Button 
                size="lg" 
                onClick={() => {
                  trackClick('start-tracking-hero', 'hero-section');
                  navigate("/auth");
                }} 
                className="gap-2 hover-scale shadow-2xl text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80"
                data-testid="button-start-tracking-hero"
              >
                Start Tracking Free
                <TrendingUp className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => {
                  trackClick('learn-more-hero', 'hero-section');
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover-scale backdrop-blur-sm bg-background/50 text-lg px-8 py-6"
                data-testid="button-learn-more-hero"
              >
                Learn More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 bg-card/80 backdrop-blur-sm border border-border/50 hover-scale group">
                  <stat.icon className="w-8 h-8 mb-3 text-primary group-hover:scale-110 transition-transform mx-auto" />
                  <div className="text-3xl font-bold mb-1 gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              Everything You Need to
              <span className="block gradient-text">Master Your Finances</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Powerful features designed to help you track, analyze, and optimize your financial life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`p-8 bg-gradient-to-br ${feature.color} border border-border/50 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-fade-in-up group`}
                style={{ animationDelay: feature.delay }}
                data-testid={`card-feature-${index}`}
              >
                <div className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-card mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcases with Images */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Analytics Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24 max-w-7xl mx-auto">
            <div className="order-2 lg:order-1 animate-fade-in-up">
              <div className="inline-block px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Analytics Dashboard
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Visualize Your Financial Health
                <span className="block gradient-text mt-2">With Powerful Analytics</span>
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Interactive charts and graphs give you deep insights into your spending habits. Track daily, weekly, and monthly trends with beautiful visualizations.
              </p>
              <ul className="space-y-4">
                {["Real-time chart updates", "Customizable time ranges", "Category breakdowns", "Income vs Expense tracking"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <img 
                src={analyticsImage} 
                alt="Financial Analytics Dashboard" 
                className="rounded-2xl shadow-2xl border border-border hover-scale"
              />
            </div>
          </div>

          {/* Mobile App Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24 max-w-7xl mx-auto">
            <div className="animate-fade-in-up">
              <img 
                src={mobileImage} 
                alt="Mobile Banking App" 
                className="rounded-2xl shadow-2xl border border-border hover-scale"
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Globe className="w-4 h-4 inline mr-2" />
                Mobile & Web Access
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Track On The Go
                <span className="block gradient-text mt-2">Anytime, Anywhere</span>
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Access your financial data from any device. Our responsive design ensures a perfect experience whether you're on mobile, tablet, or desktop.
              </p>
              <ul className="space-y-4">
                {["Cross-device synchronization", "Offline mode support", "Push notifications", "Secure cloud backup"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Family Finance Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="order-2 lg:order-1 animate-fade-in-up">
              <div className="inline-block px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
                <Users className="w-4 h-4 inline mr-2" />
                Family Management
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Manage Family Finances
                <span className="block gradient-text mt-2">Together, Better</span>
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Create a shared financial space for your family. Track individual and collective expenses with detailed member dashboards and insights.
              </p>
              <ul className="space-y-4">
                {["Individual member profiles", "Shared expense tracking", "Family budget management", "Detailed analytics per member"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-warning flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <img 
                src={familyImage} 
                alt="Family Budget Planning" 
                className="rounded-2xl shadow-2xl border border-border hover-scale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              Loved By Thousands
              <span className="block gradient-text mt-2">Of Happy Users</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              See what our users have to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="p-8 bg-card hover:shadow-2xl hover-scale transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`card-testimonial-${index}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-success/5 to-warning/10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-scale-in">
              <Lock className="w-4 h-4 inline mr-2" />
              Secure • Private • Free
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Ready to Transform Your
              <span className="block gradient-text mt-2">Financial Life?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Join thousands of users who are already taking control of their finances with NS Tracker. Start your journey today—completely free!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Button 
                size="lg" 
                onClick={() => {
                  trackClick('create-account-cta', 'bottom-cta');
                  navigate("/auth");
                }}
                className="gap-2 hover-scale shadow-2xl text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80"
                data-testid="button-create-account-cta"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => {
                  trackClick('privacy-cta', 'bottom-cta');
                  navigate("/privacy");
                }}
                className="hover-scale text-lg px-8 py-6"
                data-testid="button-privacy-cta"
              >
                View Privacy Policy
                <Shield className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 items-center opacity-60">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span className="text-sm">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="NS FinSight" className="h-10 w-auto" />
                <span className="font-bold text-lg">NS FinSight</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your complete financial command center. Track, analyze, and optimize your financial life.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">Features</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Pricing</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Security</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Updates</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">About</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Blog</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Careers</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Contact</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/privacy")} 
                    className="p-0 h-auto text-sm text-muted-foreground hover:text-foreground"
                    data-testid="link-privacy-footer"
                  >
                    Privacy Policy
                  </Button>
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Cookie Policy</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Disclaimer</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 NS FinSight. Built with privacy and security in mind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
