import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar, User as UserIcon, Award, TrendingUp } from "lucide-react";

interface UserProfile {
  display_name?: string;
  gender?: string;
  age?: number;
  date_of_birth?: string;
  profile_picture_url?: string;
  created_at?: string;
}

export const UserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(false);
  const [daysUsing, setDaysUsing] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("display_name, gender, age, date_of_birth, profile_picture_url, created_at")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data || {});
      
      if (data?.created_at) {
        const createdDate = new Date(data.created_at);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysUsing(diffDays);
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("users")
        .update({
          display_name: profile.display_name,
          gender: profile.gender,
          age: profile.age,
          date_of_birth: profile.date_of_birth,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-primary" />
          <CardTitle>Your Profile</CardTitle>
        </div>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium">Days Using NS TRACKER</p>
            </div>
            <p className="text-2xl font-bold text-primary">{daysUsing}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={profile.display_name || ""}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={profile.gender || ""} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={profile.age || ""}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || undefined })}
              placeholder="Enter your age"
              min="1"
              max="150"
            />
          </div>

          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={profile.date_of_birth || ""}
              onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
            />
          </div>
        </div>

        <Button onClick={updateProfile} disabled={loading} className="w-full">
          {loading ? "Updating..." : "Update Profile"}
        </Button>
      </CardContent>
    </Card>
  );
};
