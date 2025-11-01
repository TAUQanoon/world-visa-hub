import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Upload, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function ClientDocuments() {
  const { user } = useAuth();

  const { data: documents, isLoading } = useQuery({
    queryKey: ["my-documents", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("documents")
        .select(`
          *,
          cases (
            case_number,
            visa_types (
              name,
              country
            )
          )
        `)
        .eq("uploaded_by", user.id)
        .order("uploaded_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_review: "bg-warning text-warning-foreground",
      approved: "bg-success text-success-foreground",
      rejected: "bg-destructive text-destructive-foreground",
    };
    return colors[status] || "bg-muted";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-2">
            Manage your case documents
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>All documents uploaded for your cases</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="space-y-4">
              {documents.map((doc: any) => (
                <Card key={doc.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">{doc.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Case: {doc.cases?.case_number} - {doc.cases?.visa_types?.name}
                          </p>
                          {doc.document_category && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Category: {doc.document_category}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(doc.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(doc.status)}
                            {doc.status.replace("_", " ")}
                          </span>
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents yet</p>
              <p className="text-sm">Upload documents for your cases</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
