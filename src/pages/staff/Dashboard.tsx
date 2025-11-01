import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Clock, CheckCircle2, AlertCircle, Users } from "lucide-react";

export default function StaffDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["staff-stats"],
    queryFn: async () => {
      const [casesResult, clientsResult, documentsResult] = await Promise.all([
        supabase.from("cases").select("status", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact" }),
        supabase.from("documents").select("status", { count: "exact" }).eq("status", "pending_review"),
      ]);

      const totalCases = casesResult.count || 0;
      const inProgress = casesResult.data?.filter((c) => c.status === "in_progress").length || 0;
      const completed = casesResult.data?.filter((c) => c.status === "approved").length || 0;
      const pending = casesResult.data?.filter((c) => c.status === "pending").length || 0;
      const totalClients = clientsResult.count || 0;
      const pendingDocs = documentsResult.count || 0;

      return { totalCases, inProgress, completed, pending, totalClients, pendingDocs };
    },
  });

  const { data: recentCases } = useQuery({
    queryKey: ["recent-cases"],
    queryFn: async () => {
      const { data } = await supabase
        .from("cases")
        .select(`
          *,
          visa_types (name, country),
          profiles!cases_client_id_fkey (full_name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Staff Dashboard</h2>
        <p className="text-muted-foreground mt-2">Overview of all cases and clients</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCases || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.inProgress || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completed || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Cases</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCases && recentCases.length > 0 ? (
            <div className="space-y-4">
              {recentCases.map((caseItem: any) => (
                <div key={caseItem.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-semibold">{caseItem.case_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {caseItem.profiles?.full_name} - {caseItem.visa_types?.name}
                    </p>
                  </div>
                  <span className="text-sm px-2 py-1 rounded bg-primary/10 text-primary">
                    {caseItem.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No cases yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
