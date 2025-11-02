import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaseHeader } from "@/components/case-detail/CaseHeader";
import { CaseProgressTracker } from "@/components/case-detail/CaseProgressTracker";
import { DocumentsSection } from "@/components/case-detail/DocumentsSection";
import { MessagesSection } from "@/components/case-detail/MessagesSection";
import { PaymentsSection } from "@/components/case-detail/PaymentsSection";
import { ActivityTimeline } from "@/components/case-detail/ActivityTimeline";
import { StaffQuickActions } from "@/components/case-detail/StaffQuickActions";
import { InternalNotes } from "@/components/case-detail/InternalNotes";
import { ClientInfoPanel } from "@/components/case-detail/ClientInfoPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function StaffCaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const { data: caseData, isLoading: caseLoading } = useQuery({
    queryKey: ["case-detail", caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select(`
          *,
          client:profiles!cases_client_id_fkey(id, full_name, email, phone),
          visa_type:visa_types(
            id, name, country, description, 
            processing_time_estimate, workflow_stages, requirements
          ),
          assigned_staff:profiles!cases_assigned_staff_id_fkey(id, full_name, email)
        `)
        .eq("id", caseId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!caseId,
  });

  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ["case-documents", caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("case_id", caseId)
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!caseId,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["case-payments", caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("case_id", caseId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!caseId,
  });

  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ["case-timeline", caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_timeline")
        .select(`
          *,
          updated_by:profiles!case_timeline_updated_by_fkey(full_name)
        `)
        .eq("case_id", caseId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!caseId,
  });

  if (caseLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Case not found</h2>
        <Button onClick={() => navigate("/staff/cases")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cases
        </Button>
      </div>
    );
  }

  const workflowStages = (caseData.visa_type?.workflow_stages || []) as Array<{ name: string; description?: string; duration?: string }>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/staff/cases")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Case Management</h1>
          <p className="text-muted-foreground">
            Cases &gt; {caseData.case_number}
          </p>
        </div>
      </div>

      <StaffQuickActions
        caseId={caseId!}
        currentStatus={caseData.status}
        currentStage={caseData.current_stage}
        currentPriority={caseData.priority || "normal"}
        currentDeadline={caseData.deadline}
        currentAssignedStaff={caseData.assigned_staff_id}
        workflowStages={workflowStages}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CaseHeader
            caseNumber={caseData.case_number}
            visaType={caseData.visa_type?.name || "Unknown"}
            country={caseData.visa_type?.country || "Unknown"}
            status={caseData.status}
            priority={caseData.priority || "normal"}
            assignedStaff={caseData.assigned_staff}
            createdAt={caseData.created_at}
            deadline={caseData.deadline}
            processingTimeEstimate={caseData.visa_type?.processing_time_estimate}
          />

          <CaseProgressTracker
            workflowStages={workflowStages}
            currentStage={caseData.current_stage}
          />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <DocumentsSection caseId={caseId!} documents={documents || []} isLoading={documentsLoading} />
              <PaymentsSection payments={payments || []} isLoading={paymentsLoading} />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsSection caseId={caseId!} documents={documents || []} isLoading={documentsLoading} />
            </TabsContent>

            <TabsContent value="messages">
              <MessagesSection caseId={caseId!} showInternal={true} />
            </TabsContent>

            <TabsContent value="payments">
              <PaymentsSection payments={payments || []} isLoading={paymentsLoading} />
            </TabsContent>

            <TabsContent value="timeline">
              <ActivityTimeline events={timeline || []} isLoading={timelineLoading} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <ClientInfoPanel
            clientId={caseData.client.id}
            clientName={caseData.client.full_name}
            clientEmail={caseData.client.email}
            clientPhone={caseData.client.phone}
          />
          <InternalNotes caseId={caseId!} />
        </div>
      </div>
    </div>
  );
}
