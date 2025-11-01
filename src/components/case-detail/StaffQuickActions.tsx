import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface StaffQuickActionsProps {
  caseId: string;
  currentStatus: string;
  currentStage: string | null;
  currentPriority: string;
  currentDeadline: string | null;
  currentAssignedStaff: string | null;
  workflowStages: Array<{ name: string; description?: string; duration?: string }>;
}

export function StaffQuickActions({
  caseId,
  currentStatus,
  currentStage,
  currentPriority,
  currentDeadline,
  currentAssignedStaff,
  workflowStages,
}: StaffQuickActionsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deadline, setDeadline] = useState<Date | undefined>(
    currentDeadline ? new Date(currentDeadline) : undefined
  );

  const { data: staffMembers } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data: staffRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", ["staff", "admin"]);

      const staffIds = staffRoles?.map((r) => r.user_id) || [];
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", staffIds);

      return data || [];
    },
  });

  const updateCaseMutation = useMutation({
    mutationFn: async (updates: any) => {
      const { error: caseError } = await supabase
        .from("cases")
        .update(updates)
        .eq("id", caseId);

      if (caseError) throw caseError;

      // Create timeline entry
      const { error: timelineError } = await supabase
        .from("case_timeline")
        .insert([
          {
            case_id: caseId,
            updated_by: user!.id,
            status: updates.status || null,
            stage: updates.current_stage || null,
            notes: `Updated via quick actions`,
          },
        ]);

      if (timelineError) throw timelineError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case-detail", caseId] });
      queryClient.invalidateQueries({ queryKey: ["case-timeline", caseId] });
      toast({
        title: "Success",
        description: "Case updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="sticky top-0 z-10">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3">
          <Select
            defaultValue={currentStatus}
            onValueChange={(value) => updateCaseMutation.mutate({ status: value })}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={currentStage || undefined}
            onValueChange={(value) => updateCaseMutation.mutate({ current_stage: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Update Stage" />
            </SelectTrigger>
            <SelectContent>
              {workflowStages.map((stage) => (
                <SelectItem key={stage.name} value={stage.name}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue={currentPriority}
            onValueChange={(value) => updateCaseMutation.mutate({ priority: value })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select
            defaultValue={currentAssignedStaff || undefined}
            onValueChange={(value) =>
              updateCaseMutation.mutate({ assigned_staff_id: value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Assign to..." />
            </SelectTrigger>
            <SelectContent>
              {staffMembers?.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {deadline ? format(deadline, "MMM dd, yyyy") : "Set Deadline"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={deadline}
                onSelect={(date) => {
                  setDeadline(date);
                  if (date) {
                    updateCaseMutation.mutate({
                      deadline: date.toISOString().split("T")[0],
                    });
                  }
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
