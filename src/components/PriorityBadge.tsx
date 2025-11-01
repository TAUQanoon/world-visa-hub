import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowUp, Circle } from "lucide-react";

type Priority = "normal" | "high" | "urgent";

interface PriorityBadgeProps {
  priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getConfig = (priority: string) => {
    switch (priority) {
      case "urgent":
        return {
          variant: "destructive" as const,
          icon: AlertCircle,
          label: "Urgent",
        };
      case "high":
        return {
          variant: "default" as const,
          icon: ArrowUp,
          label: "High",
        };
      case "normal":
      default:
        return {
          variant: "secondary" as const,
          icon: Circle,
          label: "Normal",
        };
    }
  };

  const config = getConfig(priority);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
