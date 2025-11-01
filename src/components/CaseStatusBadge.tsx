import { Badge } from "@/components/ui/badge";

type CaseStatus = "pending" | "in_progress" | "approved" | "rejected" | "on_hold";

interface CaseStatusBadgeProps {
  status: string;
}

export function CaseStatusBadge({ status }: CaseStatusBadgeProps) {
  const getVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default"; // primary color
      case "in_progress":
        return "secondary";
      case "rejected":
        return "destructive";
      case "on_hold":
        return "outline";
      case "pending":
      default:
        return "outline";
    }
  };

  const getLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Badge variant={getVariant(status)} className="capitalize">
      {getLabel(status)}
    </Badge>
  );
}
