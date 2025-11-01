import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";

interface ClientInfoPanelProps {
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
}

export function ClientInfoPanel({
  clientId,
  clientName,
  clientEmail,
  clientPhone,
}: ClientInfoPanelProps) {
  const { data: clientCases } = useQuery({
    queryKey: ["client-total-cases", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("id, created_at")
        .eq("client_id", clientId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const registrationDate = clientCases && clientCases.length > 0 
    ? clientCases[0].created_at 
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{clientName}</p>
              <p className="text-xs text-muted-foreground">Full Name</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <a
                href={`mailto:${clientEmail}`}
                className="text-sm font-medium hover:underline"
              >
                {clientEmail}
              </a>
              <p className="text-xs text-muted-foreground">Email Address</p>
            </div>
          </div>

          {clientPhone && (
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <a
                  href={`tel:${clientPhone}`}
                  className="text-sm font-medium hover:underline"
                >
                  {clientPhone}
                </a>
                <p className="text-xs text-muted-foreground">Phone Number</p>
              </div>
            </div>
          )}

          {registrationDate && (
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {format(new Date(registrationDate), "MMM dd, yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">Client Since</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{clientCases?.length || 0} Cases</p>
              <p className="text-xs text-muted-foreground">Total Cases</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View All Cases
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
