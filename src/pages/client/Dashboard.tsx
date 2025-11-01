import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock, CheckCircle2 } from "lucide-react";

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: cases, isLoading } = useQuery({
    queryKey: ["my-cases", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("cases")
        .select(`
          *,
          visa_types (
            name,
            country
          )
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-warning text-warning-foreground",
      in_progress: "bg-primary text-primary-foreground",
      submitted: "bg-accent text-accent-foreground",
      approved: "bg-success text-success-foreground",
      rejected: "bg-destructive text-destructive-foreground",
      on_hold: "bg-muted text-muted-foreground",
    };
    return colors[status] || "bg-muted";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {profile?.full_name || "Client"}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your visa applications
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cases?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cases?.filter((c) => c.status === "in_progress").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cases?.filter((c) => c.status === "approved").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Cases</CardTitle>
          <CardDescription>View and manage your visa applications</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : cases && cases.length > 0 ? (
            <div className="space-y-4">
              {cases.map((caseItem: any) => (
                <Card 
                  key={caseItem.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/portal/case/${caseItem.id}`)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {caseItem.case_number}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {caseItem.visa_types?.name} - {caseItem.visa_types?.country}
                        </p>
                        {caseItem.current_stage && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Stage: {caseItem.current_stage}
                          </p>
                        )}
                      </div>
                      <Badge className={getStatusColor(caseItem.status)}>
                        {caseItem.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No cases yet</p>
              <p className="text-sm">Contact us to start your visa application</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
