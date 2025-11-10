import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Eye, Database, UserCheck, FileText, ArrowLeft } from "lucide-react";
import logoImage from "@/assets/ns-finsight-logo.png";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-white shadow-md ring-2 ring-primary/20">
                <img src={logoImage} alt="NS FinSight" className="h-full w-full object-contain p-1" />
              </div>
              <h1 className="text-xl font-bold">NS FinSight Privacy</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 gradient-text">Privacy & Security</h2>
          <p className="text-muted-foreground text-lg">Your data security is our top priority</p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Data Protection</CardTitle>
                  <CardDescription>Bank-grade security for your financial data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>🔒 <strong>AES-256 Encryption:</strong> All data encrypted at rest and in transit</p>
              <p>🔐 <strong>Secure Authentication:</strong> Industry-standard auth with optional 2FA</p>
              <p>🛡️ <strong>Row-Level Security:</strong> Database policies ensure you only access your data</p>
              <p>🔑 <strong>Secure Sessions:</strong> Auto-timeout after inactivity</p>
              <p>🚫 <strong>No Data Selling:</strong> We NEVER sell or share your data with third parties</p>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-success">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Data Collection & Storage</CardTitle>
                  <CardDescription>What information we collect and why</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold mb-1">Personal Information:</p>
                <p>• Email address (for authentication)</p>
                <p>• Display name (optional)</p>
                <p>• Profile picture (optional)</p>
                <p>• Age, gender, date of birth (optional, for personalized advice)</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Financial Data:</p>
                <p>• Transactions (income, expenses, transfers)</p>
                <p>• Accounts and balances</p>
                <p>• Investment holdings (stocks, crypto, precious metals)</p>
                <p>• Budgets, goals, and financial plans</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Usage Analytics:</p>
                <p>• Anonymized app usage patterns</p>
                <p>• IP addresses (hashed for security)</p>
                <p>• Device and browser information</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-warning to-destructive">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>How We Use Your Data</CardTitle>
                  <CardDescription>Transparency in data usage</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-success mb-1">✅ What We DO:</p>
                <p>• Provide financial tracking and insights</p>
                <p>• Generate AI-powered advice via Google Gemini API</p>
                <p>• Display real-time market data for your investments</p>
                <p>• Enable family finance management features</p>
                <p>• Improve app performance and user experience</p>
              </div>
              <div>
                <p className="font-semibold text-destructive mb-1">❌ What We DON'T DO:</p>
                <p>• NEVER sell your data to third parties</p>
                <p>• NEVER share with advertisers without consent</p>
                <p>• NEVER access your data without authorization</p>
                <p>• NEVER use your financial data for marketing</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Third-Party Services</CardTitle>
                  <CardDescription>External services we use</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold mb-1">Google Gemini AI:</p>
                <p>We use Google's Gemini API to provide personalized financial advice. Your financial data is sent to Google's servers for AI analysis but is not stored or used for Google's purposes beyond providing you insights.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Supabase (Database & Auth):</p>
                <p>All data is stored securely on Supabase infrastructure with industry-standard encryption and backup protocols.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Google AdSense (Optional):</p>
                <p>We may display contextual ads via Google AdSense. These ads use cookies to provide relevant content. You can opt out in your browser settings.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent">
                  <UserCheck className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle>Your Rights & Data Control</CardTitle>
                  <CardDescription>GDPR & CCPA compliance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p><strong>Right to Access:</strong> Request a copy of all your data</p>
              <p><strong>Right to Correction:</strong> Update or correct your information</p>
              <p><strong>Right to Deletion:</strong> Delete your account and all associated data</p>
              <p><strong>Right to Export:</strong> Download all your data in CSV/JSON format</p>
              <p><strong>Right to Opt-Out:</strong> Disable analytics and ad personalization</p>
              <p className="pt-2">To exercise these rights, contact us at: <strong>privacy@nsfinsight.app</strong></p>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in border-primary">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Data Retention & Deletion</CardTitle>
                  <CardDescription>How long we keep your data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• <strong>Active Accounts:</strong> Data retained while your account is active</p>
              <p>• <strong>Account Deletion:</strong> All data permanently deleted within 30 days of account closure</p>
              <p>• <strong>Backup Retention:</strong> Encrypted backups kept for 90 days for recovery purposes</p>
              <p>• <strong>Legal Requirements:</strong> Some data may be retained longer if required by law</p>
            </CardContent>
          </Card>

          <div className="p-6 rounded-xl bg-gradient-primary text-white text-center animate-fade-in">
            <Shield className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Your Trust, Our Priority</h3>
            <p className="opacity-90 mb-4">Bank-level encryption and security measures</p>
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
