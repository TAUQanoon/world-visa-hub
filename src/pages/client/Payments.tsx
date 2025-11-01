import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function ClientPayments() {
  const { user } = useAuth();

  const { data: payments, isLoading } = useQuery({
    queryKey: ["my-payments", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("payments")
        .select(`
          *,
          cases (
            case_number,
            client_id,
            visa_types (
              name,
              country
            )
          )
        `)
        .eq("cases.client_id", user.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-warning text-warning-foreground",
      paid: "bg-success text-success-foreground",
      failed: "bg-destructive text-destructive-foreground",
      refunded: "bg-muted text-muted-foreground",
    };
    return colors[status] || "bg-muted";
  };

  const totalPaid = payments?.filter((p: any) => p.status === "paid")
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;

  const totalPending = payments?.filter((p: any) => p.status === "pending")
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground mt-2">
          Track your payment history and status
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All payments for your cases</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : payments && payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment: any) => (
                <Card key={payment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {payment.description || "Payment"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Case: {payment.cases?.case_number} - {payment.cases?.visa_types?.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created: {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                        {payment.paid_at && (
                          <p className="text-xs text-muted-foreground">
                            Paid: {new Date(payment.paid_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          ${Number(payment.amount).toFixed(2)}
                        </p>
                        <Badge className={getStatusColor(payment.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No payments yet</p>
              <p className="text-sm">Payment information will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
