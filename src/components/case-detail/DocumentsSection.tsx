import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { format } from "date-fns";

interface Document {
  id: string;
  name: string;
  document_category: string | null;
  uploaded_at: string;
  status: string | null;
  file_size: number | null;
  file_path: string;
}

interface DocumentsSectionProps {
  documents: Document[];
  isLoading?: boolean;
}

export function DocumentsSection({ documents, isLoading }: DocumentsSectionProps) {
  const getStatusVariant = (status: string | null) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending_review":
      default:
        return "secondary";
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents</CardTitle>
        <Button size="sm" variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading documents...
          </div>
        ) : documents && documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {doc.document_category && (
                        <span className="text-xs text-muted-foreground">
                          {doc.document_category}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(doc.uploaded_at), "MMM dd, yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(doc.file_size)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={getStatusVariant(doc.status)}>
                    {doc.status?.replace("_", " ") || "Pending"}
                  </Badge>
                  <Button size="icon" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm mt-1">Upload your first document to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
