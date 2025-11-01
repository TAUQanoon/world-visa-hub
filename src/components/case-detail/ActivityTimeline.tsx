import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, MessageSquare, User } from "lucide-react";
import { format } from "date-fns";

interface TimelineEvent {
  id: string;
  created_at: string;
  status: string | null;
  stage: string | null;
  notes: string | null;
  updated_by: {
    full_name: string;
  };
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  isLoading?: boolean;
}

export function ActivityTimeline({ events, isLoading }: ActivityTimelineProps) {
  const getEventIcon = (event: TimelineEvent) => {
    if (event.stage) return Clock;
    if (event.notes) return MessageSquare;
    return FileText;
  };

  const getEventDescription = (event: TimelineEvent) => {
    const parts = [];
    if (event.status) parts.push(`Status changed to ${event.status.replace("_", " ")}`);
    if (event.stage) parts.push(`Moved to stage: ${event.stage}`);
    return parts.join(" • ") || "Case updated";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading timeline...
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, index) => {
              const Icon = getEventIcon(event);
              return (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    {index < events.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm">
                        {getEventDescription(event)}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(event.created_at), "MMM dd, h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      by {event.updated_by.full_name}
                    </p>
                    {event.notes && (
                      <p className="text-sm text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                        {event.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activity yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
