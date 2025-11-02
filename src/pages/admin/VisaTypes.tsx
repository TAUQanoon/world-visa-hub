import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VisaTypeDialog } from "@/components/admin/VisaTypeDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function VisaTypes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVisaType, setSelectedVisaType] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visaTypeToDelete, setVisaTypeToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: visaTypes, isLoading } = useQuery({
    queryKey: ["visa-types-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visa_types")
        .select("*")
        .order("country", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("visa_types").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visa-types-admin"] });
      toast({ title: "Visa type deleted successfully" });
      setDeleteDialogOpen(false);
      setVisaTypeToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting visa type",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (visaType: any) => {
    setSelectedVisaType(visaType);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedVisaType(null);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setVisaTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (visaTypeToDelete) {
      deleteMutation.mutate(visaTypeToDelete);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Visa Types Management</h2>
          <p className="text-muted-foreground mt-2">Configure visa types and their requirements</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Visa Type
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visaTypes?.map((visaType) => (
          <Card key={visaType.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg">{visaType.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{visaType.country}</Badge>
                    <Badge variant="outline">{visaType.category}</Badge>
                  </div>
                </div>
                <Badge variant={visaType.is_active ? "default" : "secondary"}>
                  {visaType.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {visaType.description || "No description"}
              </p>
              {visaType.processing_time_estimate && (
                <p className="text-sm">
                  <span className="font-medium">Processing Time:</span>{" "}
                  {visaType.processing_time_estimate}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(visaType)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(visaType.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {visaTypes?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No visa types configured yet.</p>
            <Button onClick={handleCreate} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create First Visa Type
            </Button>
          </CardContent>
        </Card>
      )}

      <VisaTypeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        visaType={selectedVisaType}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this visa type. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
