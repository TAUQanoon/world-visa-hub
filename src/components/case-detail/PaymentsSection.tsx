import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Download } from "lucide-react";
import { format } from "date-fns";

interface Payment {
  id: string;
  amount: number;
  currency: string | null;
  description: string | null;
  status: string | null;
  created_at: string;
  paid_at: string | null;
}

interface PaymentsSectionProps {
  payments: Payment[];
  isLoading?: boolean;
}

export function PaymentsSection({ payments, isLoading }: PaymentsSectionProps) {
  const getStatusVariant = (status: string | null) => {
    switch (status) {
      case "paid":
        return "default";
      case "failed":
        return "destructive";
      case "pending":
      default:
        return "secondary";
    }
  };

  const totalAmount = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const paidAmount =
    payments
      ?.filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const pendingAmount = totalAmount - paidAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        {payments && payments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-primary">
                ${paidAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">
                ${pendingAmount.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading payments...
          </div>
        ) : payments && payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">
                      ${Number(payment.amount).toFixed(2)} {payment.currency || "USD"}
                    </p>
                    <Badge variant={getStatusVariant(payment.status)}>
                      {payment.status || "Pending"}
                    </Badge>
                  </div>
                  {payment.description && (
                    <p className="text-sm text-muted-foreground mb-1">
                      {payment.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Created: {format(new Date(payment.created_at), "MMM dd, yyyy")}</span>
                    {payment.paid_at && (
                      <>
                        <span>•</span>
                        <span>Paid: {format(new Date(payment.paid_at), "MMM dd, yyyy")}</span>
                      </>
                    )}
                  </div>
                </div>
                {payment.status === "paid" && (
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4 mr-2" />
                    Invoice
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No payment records yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
