import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ClientProfileForm } from "@/components/client-profile/ClientProfileForm";
import { TravelHistoryList } from "@/components/client-profile/TravelHistoryList";

export default function ClientProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("basic");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: clientProfile, isLoading: clientProfileLoading } = useQuery({
    queryKey: ["client-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const updateBasicProfile = useMutation({
    mutationFn: async (data: { full_name: string; phone: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user!.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({ title: "Profile updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  const saveClientProfile = useMutation({
    mutationFn: async (data: any) => {
      if (clientProfile) {
        const { error } = await supabase
          .from("client_profiles")
          .update(data)
          .eq("id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("client_profiles")
          .insert([{ ...data, id: user!.id }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
      toast({ title: "Profile updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  const handleBasicUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateBasicProfile.mutate({ full_name: fullName, phone });
  };

  if (profileLoading || clientProfileLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="extended">Personal Details</TabsTrigger>
          <TabsTrigger value="travel">Travel History</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBasicUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile?.email || ""} disabled />
                </div>

                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={updateBasicProfile.isPending}>
                  {updateBasicProfile.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="extended" className="mt-6">
          <ClientProfileForm
            defaultValues={clientProfile ? {
              date_of_birth: clientProfile.date_of_birth || undefined,
              place_of_birth: clientProfile.place_of_birth || undefined,
              nationality: clientProfile.nationality || undefined,
              passport_number: clientProfile.passport_number || undefined,
              passport_issue_date: clientProfile.passport_issue_date || undefined,
              passport_expiry_date: clientProfile.passport_expiry_date || undefined,
              passport_issuing_country: clientProfile.passport_issuing_country || undefined,
              gender: (clientProfile.gender as "male" | "female" | "other" | "prefer_not_to_say") || undefined,
              marital_status: (clientProfile.marital_status as "single" | "married" | "divorced" | "widowed" | "separated") || undefined,
              address_line1: clientProfile.address_line1 || undefined,
              address_line2: clientProfile.address_line2 || undefined,
              city: clientProfile.city || undefined,
              state_province: clientProfile.state_province || undefined,
              postal_code: clientProfile.postal_code || undefined,
              country: clientProfile.country || undefined,
              emergency_contact_name: clientProfile.emergency_contact_name || undefined,
              emergency_contact_phone: clientProfile.emergency_contact_phone || undefined,
              emergency_contact_relationship: clientProfile.emergency_contact_relationship || undefined,
            } : {}}
            onSubmit={async (data) => saveClientProfile.mutate(data)}
            isLoading={saveClientProfile.isPending}
          />
        </TabsContent>

        <TabsContent value="travel" className="mt-6">
          <TravelHistoryList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
