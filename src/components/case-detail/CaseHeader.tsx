import { Card, CardContent } from "@/components/ui/card";
import { CaseStatusBadge } from "@/components/CaseStatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, User } from "lucide-react";
import { format } from "date-fns";

interface CaseHeaderProps {
  caseNumber: string;
  visaType: string;
  country: string;
  status: string;
  priority: string;
  assignedStaff?: {
    full_name: string;
  } | null;
  createdAt: string;
  deadline?: string | null;
  processingTimeEstimate?: string | null;
}

export function CaseHeader({
  caseNumber,
  visaType,
  country,
  status,
  priority,
  assignedStaff,
  createdAt,
  deadline,
  processingTimeEstimate,
}: CaseHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">{caseNumber}</h2>
              <p className="text-lg text-muted-foreground mt-1">
                {visaType} - {country}
              </p>
            </div>
            <div className="flex gap-2">
              <CaseStatusBadge status={status} />
              <PriorityBadge priority={priority} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {assignedStaff && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {assignedStaff.full_name.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Assigned Consultant</span>
                  <span className="text-sm font-medium">{assignedStaff.full_name}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Created</span>
                <span className="text-sm font-medium">
                  {format(new Date(createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>

            {deadline && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Deadline</span>
                  <span className="text-sm font-medium">
                    {format(new Date(deadline), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            )}

            {processingTimeEstimate && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Est. Processing Time</span>
                  <span className="text-sm font-medium">{processingTimeEstimate}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
