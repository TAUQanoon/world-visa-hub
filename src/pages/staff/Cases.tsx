import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CaseStatusBadge } from "@/components/CaseStatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Eye, Clock } from "lucide-react";
import { format } from "date-fns";

interface Case {
  id: string;
  case_number: string;
  status: string;
  priority: string;
  current_stage: string | null;
  deadline: string | null;
  created_at: string;
  client: {
    id: string;
    full_name: string;
    email: string;
  };
  visa_type: {
    id: string;
    name: string;
    country: string;
  };
  assigned_staff: {
    id: string;
    full_name: string;
  } | null;
}

export default function Cases() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all cases
  const { data: cases, isLoading } = useQuery({
    queryKey: ["staff-cases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select(`
          id,
          case_number,
          status,
          priority,
          current_stage,
          deadline,
          created_at,
          client:profiles!cases_client_id_fkey(id, full_name, email),
          visa_type:visa_types(id, name, country),
          assigned_staff:profiles!cases_assigned_staff_id_fkey(id, full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as Case[];
    },
  });

  // Fetch clients for create form
  const { data: clients } = useQuery({
    queryKey: ["clients-with-role"],
    queryFn: async () => {
      const { data: clientRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "client");

      if (rolesError) throw rolesError;

      const clientIds = clientRoles.map((r) => r.user_id);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", clientIds);

      if (error) throw error;
      return data;
    },
  });

  // Fetch visa types
  const { data: visaTypes } = useQuery({
    queryKey: ["visa-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visa_types")
        .select("id, name, country")
        .eq("is_active", true)
        .order("country");

      if (error) throw error;
      return data;
    },
  });

  // Fetch staff members
  const { data: staffMembers } = useQuery({
    queryKey: ["staff-members"],
    queryFn: async () => {
      const { data: staffRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", ["staff", "admin"]);

      if (rolesError) throw rolesError;

      const staffIds = staffRoles.map((r) => r.user_id);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", staffIds);

      if (error) throw error;
      return data;
    },
  });

  // Update case mutation
  const updateCaseMutation = useMutation({
    mutationFn: async ({
      caseId,
      updates,
    }: {
      caseId: string;
      updates: Partial<Case>;
    }) => {
      const { error } = await supabase
        .from("cases")
        .update(updates)
        .eq("id", caseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-cases"] });
      toast({
        title: "Success",
        description: "Case updated successfully",
      });
      setIsDetailOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create case mutation
  const createCaseMutation = useMutation({
    mutationFn: async (newCase: {
      client_id: string;
      visa_type_id: string;
      assigned_staff_id?: string;
      priority: string;
      deadline?: string;
    }) => {
      // Generate case number first
      const { data: caseNumber, error: caseNumberError } = await supabase
        .rpc("generate_case_number");

      if (caseNumberError) throw caseNumberError;
      if (!caseNumber) throw new Error("Failed to generate case number");

      const { error } = await supabase.from("cases").insert([{
        ...newCase,
        case_number: caseNumber,
      }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-cases"] });
      toast({
        title: "Success",
        description: "Case created successfully",
      });
      setIsCreateOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter cases
  const filteredCases = cases?.filter((c) => {
    const matchesSearch =
      c.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cases</h1>
          <p className="text-muted-foreground">Manage immigration cases</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
              <DialogDescription>
                Create a new immigration case for a client
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createCaseMutation.mutate({
                  client_id: formData.get("client_id") as string,
                  visa_type_id: formData.get("visa_type_id") as string,
                  assigned_staff_id: formData.get("assigned_staff_id") as string || undefined,
                  priority: formData.get("priority") as string,
                  deadline: formData.get("deadline") as string || undefined,
                });
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="client_id">Client</Label>
                <Select name="client_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients?.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.full_name} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="visa_type_id">Visa Type</Label>
                <Select name="visa_type_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    {visaTypes?.map((vt) => (
                      <SelectItem key={vt.id} value={vt.id}>
                        {vt.country} - {vt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assigned_staff_id">Assign to Staff</Label>
                <Select name="assigned_staff_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers?.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input type="date" name="deadline" />
              </div>

              <Button type="submit" className="w-full" disabled={createCaseMutation.isPending}>
                {createCaseMutation.isPending ? "Creating..." : "Create Case"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by case number or client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cases Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case Number</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Visa Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredCases && filteredCases.length > 0 ? (
              filteredCases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.case_number}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{c.client.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {c.client.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{c.visa_type.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {c.visa_type.country}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CaseStatusBadge status={c.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={c.priority} />
                  </TableCell>
                  <TableCell>
                    {c.assigned_staff?.full_name || (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {c.deadline ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(c.deadline), "MMM dd, yyyy")}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No deadline</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCase(c);
                        setIsDetailOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No cases found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Case Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          {selectedCase && (
            <>
              <DialogHeader>
                <DialogTitle>Case {selectedCase.case_number}</DialogTitle>
                <DialogDescription>
                  View and update case details
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  updateCaseMutation.mutate({
                    caseId: selectedCase.id,
                    updates: {
                      status: formData.get("status") as string,
                      priority: formData.get("priority") as string,
                      current_stage: formData.get("current_stage") as string,
                      assigned_staff_id: formData.get("assigned_staff_id") as string || null,
                      deadline: formData.get("deadline") as string || null,
                    } as Partial<Case>,
                  });
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Client</Label>
                    <p className="text-sm font-medium">{selectedCase.client.full_name}</p>
                    <p className="text-xs text-muted-foreground">{selectedCase.client.email}</p>
                  </div>
                  <div>
                    <Label>Visa Type</Label>
                    <p className="text-sm font-medium">{selectedCase.visa_type.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedCase.visa_type.country}</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={selectedCase.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue={selectedCase.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="current_stage">Current Stage</Label>
                  <Input
                    name="current_stage"
                    defaultValue={selectedCase.current_stage || ""}
                    placeholder="e.g., Document Collection, Interview Scheduled"
                  />
                </div>

                <div>
                  <Label htmlFor="assigned_staff_id">Assigned Staff</Label>
                  <Select
                    name="assigned_staff_id"
                    defaultValue={selectedCase.assigned_staff?.id || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers?.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    type="date"
                    name="deadline"
                    defaultValue={selectedCase.deadline || ""}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={updateCaseMutation.isPending}>
                  {updateCaseMutation.isPending ? "Updating..." : "Update Case"}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
