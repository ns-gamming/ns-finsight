import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, UserPlus, Users, Calendar, Mail, Eye } from "lucide-react";
import { FamilyInvite } from "@/components/FamilyInvite";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AdSense } from "@/components/AdSense";

// Assuming logoImage is imported from an image file path, e.g., import logoImage from '@/assets/logo.png';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  date_of_birth: string | null;
  is_alive: boolean;
  email: string | null;
}

const Family = () => {
  const navigate = useNavigate();
  const { trackPageView, trackClick } = useAnalytics();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    dateOfBirth: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    trackPageView('/family');
    checkAuthAndFetchData();
  }, [trackPageView]);

  const checkAuthAndFetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    await fetchMembers();
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      toast.error("Failed to load family members", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("family_members").insert({
        name: formData.name,
        relationship: formData.relationship,
        date_of_birth: formData.dateOfBirth || null,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Family member added successfully!");
      setFormData({ name: "", relationship: "", dateOfBirth: "" });
      setDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      toast.error("Failed to add family member", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const relationshipColors: Record<string, string> = {
    spouse: "bg-pink-500 text-white",
    partner: "bg-rose-500 text-white",
    child: "bg-blue-500 text-white",
    parent: "bg-purple-500 text-white",
    mother: "bg-purple-400 text-white",
    father: "bg-indigo-500 text-white",
    sibling: "bg-green-500 text-white",
    sister: "bg-orange-500 text-white",
    brother: "bg-emerald-500 text-white",
    relative: "bg-gray-500 text-white",
  };

  return (
    <div className="min-h-screen bg-background">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-muted-foreground">Loading family members...</div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in-up">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => {
                  trackClick('back-to-dashboard', 'family-page');
                  navigate("/dashboard");
                }}
                className="hover:scale-105 transition-transform"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <Users className="w-8 h-8" />
                  Family Members
                </h1>
                <p className="text-muted-foreground mt-1">Manage your family finances together</p>
              </div>
            </div>
            <div className="flex gap-2">
              <FamilyInvite onInviteSent={fetchMembers} />
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="gap-2 hover:scale-105 transition-transform"
                    onClick={() => trackClick('add-member-button', 'family-page')}
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Family Member</DialogTitle>
                    <DialogDescription>
                    Add comprehensive family member details including personal info, financial data, and emergency contacts
                  </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select
                        value={formData.relationship}
                        onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="relative">Other Relative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Member"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {members.length === 0 ? (
            <Card className="text-center py-12 animate-fade-in-up hover:shadow-lg transition-shadow">
              <CardContent>
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">No family members yet</h2>
                <p className="text-muted-foreground mb-4">Add your first family member to start tracking together</p>
                <Button onClick={() => setDialogOpen(true)} className="gap-2 hover:scale-105 transition-transform">
                  <UserPlus className="w-4 h-4" />
                  Add First Member
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                <Card 
                  key={member.id} 
                  className="hover:shadow-glow hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in-up group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => {
                    trackClick(`view-member-${member.id}`, 'family-page');
                    navigate(`/family/${member.id}/dashboard`);
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{member.name}</CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`mt-2 ${relationshipColors[member.relationship as keyof typeof relationshipColors] || "bg-gray-100"}`}
                        >
                          {member.relationship}
                        </Badge>
                      </div>
                      {member.is_alive !== null && (
                        <Badge variant={member.is_alive ? "default" : "secondary"}>
                          {member.is_alive ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {member.date_of_birth && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>Born: {new Date(member.date_of_birth).toLocaleDateString()}</span>
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Mail className="w-4 h-4" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          trackClick(`view-dashboard-${member.id}`, 'family-page');
                          navigate(`/family/${member.id}/dashboard`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        View Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Family;