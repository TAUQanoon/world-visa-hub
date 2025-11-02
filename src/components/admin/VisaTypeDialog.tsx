import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.string().min(1, "Country is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  processing_time_estimate: z.string().optional(),
  requirements: z.string().optional(),
  workflow_stages: z.string().optional(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface VisaTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visaType?: any;
}

export function VisaTypeDialog({
  open,
  onOpenChange,
  visaType,
}: VisaTypeDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      category: "",
      description: "",
      processing_time_estimate: "",
      requirements: "",
      workflow_stages: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (visaType) {
      form.reset({
        name: visaType.name || "",
        country: visaType.country || "",
        category: visaType.category || "",
        description: visaType.description || "",
        processing_time_estimate: visaType.processing_time_estimate || "",
        requirements: JSON.stringify(visaType.requirements || [], null, 2),
        workflow_stages: JSON.stringify(visaType.workflow_stages || [], null, 2),
        is_active: visaType.is_active ?? true,
      });
    } else {
      form.reset({
        name: "",
        country: "",
        category: "",
        description: "",
        processing_time_estimate: "",
        requirements: "[]",
        workflow_stages: "[]",
        is_active: true,
      });
    }
  }, [visaType, form]);

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      let requirements = [];
      let workflow_stages = [];

      try {
        requirements = values.requirements ? JSON.parse(values.requirements) : [];
      } catch (e) {
        throw new Error("Invalid JSON format for requirements");
      }

      try {
        workflow_stages = values.workflow_stages ? JSON.parse(values.workflow_stages) : [];
      } catch (e) {
        throw new Error("Invalid JSON format for workflow stages");
      }

      const payload = {
        name: values.name,
        country: values.country,
        category: values.category,
        description: values.description || null,
        processing_time_estimate: values.processing_time_estimate || null,
        requirements,
        workflow_stages,
        is_active: values.is_active,
      };

      if (visaType) {
        const { error } = await supabase
          .from("visa_types")
          .update(payload)
          .eq("id", visaType.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("visa_types").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visa-types-admin"] });
      toast({
        title: visaType ? "Visa type updated" : "Visa type created",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {visaType ? "Edit Visa Type" : "Create Visa Type"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Student Visa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Canada" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Study" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this visa type"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="processing_time_estimate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processing Time Estimate</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 3-6 months" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='["Valid passport", "Proof of funds"]'
                      className="font-mono text-sm"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="workflow_stages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Stages (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='["Initial Review", "Document Collection", "Submission"]'
                      className="font-mono text-sm"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      This visa type will be visible to clients
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
