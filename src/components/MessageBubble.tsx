import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface MessageBubbleProps {
  message: string;
  senderName: string;
  timestamp: string;
  isOwnMessage: boolean;
  isInternal?: boolean;
}

export function MessageBubble({
  message,
  senderName,
  timestamp,
  isOwnMessage,
  isInternal = false,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex flex-col mb-4 max-w-[80%]",
        isOwnMessage ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-foreground">{senderName}</span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(timestamp), "MMM d, h:mm a")}
        </span>
        {isInternal && (
          <Badge variant="secondary" className="text-xs">
            Internal
          </Badge>
        )}
      </div>
      <div
        className={cn(
          "rounded-lg px-4 py-2 break-words",
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : isInternal
            ? "bg-accent text-accent-foreground border border-border"
            : "bg-muted text-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}
