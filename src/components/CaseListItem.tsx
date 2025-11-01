import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface CaseListItemProps {
  caseNumber: string;
  clientName: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  isSelected: boolean;
  onClick: () => void;
}

export function CaseListItem({
  caseNumber,
  clientName,
  lastMessage,
  lastMessageAt,
  unreadCount,
  isSelected,
  onClick,
}: CaseListItemProps) {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-colors hover:bg-accent/50",
        isSelected && "bg-accent border-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{caseNumber}</h3>
            {unreadCount > 0 && (
              <Badge variant="default" className="h-5 min-w-[20px] px-1.5">
                {unreadCount}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{clientName}</p>
        </div>
      </div>
      {lastMessage && (
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {lastMessage}
          </p>
          {lastMessageAt && (
            <p className="text-xs text-muted-foreground">
              {format(new Date(lastMessageAt), "MMM d, h:mm a")}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
