import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const travelSchema = z.object({
  country: z.string().min(1, "Country is required").max(100),
  purpose: z.enum(["tourism", "business", "study", "work", "other"]).optional(),
  entry_date: z.string().min(1, "Entry date is required"),
  exit_date: z.string().min(1, "Exit date is required"),
  visa_type: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

type TravelFormData = z.infer<typeof travelSchema>;

interface TravelHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRecord?: any;
}

export function TravelHistoryDialog({ open, onOpenChange, editingRecord }: TravelHistoryDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<TravelFormData>({
    resolver: zodResolver(travelSchema),
    defaultValues: editingRecord || {},
  });

  const mutation = useMutation({
    mutationFn: async (data: TravelFormData) => {
      const insertData = {
        country: data.country,
        entry_date: data.entry_date,
        exit_date: data.exit_date,
        purpose: data.purpose || undefined,
        visa_type: data.visa_type || undefined,
        notes: data.notes || undefined,
      };
      
      if (editingRecord) {
        const { error } = await supabase
          .from("client_travel_history")
          .update(insertData)
          .eq("id", editingRecord.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("client_travel_history")
          .insert([{ ...insertData, client_id: user!.id }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["travel-history"] });
      toast({ title: editingRecord ? "Travel record updated" : "Travel record added" });
      reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({ title: "Failed to save travel record", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingRecord ? "Edit" : "Add"} Travel Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input id="country" {...register("country")} />
              {errors.country && (
                <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="purpose">Purpose *</Label>
              <Select onValueChange={(value) => setValue("purpose", value as any)} defaultValue={editingRecord?.purpose}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tourism">Tourism</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.purpose && (
                <p className="text-sm text-destructive mt-1">{errors.purpose.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="entry_date">Entry Date *</Label>
              <Input type="date" id="entry_date" {...register("entry_date")} />
              {errors.entry_date && (
                <p className="text-sm text-destructive mt-1">{errors.entry_date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="exit_date">Exit Date *</Label>
              <Input type="date" id="exit_date" {...register("exit_date")} />
              {errors.exit_date && (
                <p className="text-sm text-destructive mt-1">{errors.exit_date.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="visa_type">Visa Type</Label>
              <Input id="visa_type" {...register("visa_type")} />
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...register("notes")} rows={3} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingRecord ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}