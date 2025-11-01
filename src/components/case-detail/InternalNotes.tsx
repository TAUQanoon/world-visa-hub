import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface InternalNotesProps {
  caseId: string;
}

export function InternalNotes({ caseId }: InternalNotesProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [note, setNote] = useState("");

  const { data: internalMessages } = useQuery({
    queryKey: ["internal-notes", caseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name)
        `)
        .eq("case_id", caseId)
        .eq("is_internal", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("messages").insert([
        {
          case_id: caseId,
          sender_id: user!.id,
          message: note,
          is_internal: true,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["internal-notes", caseId] });
      setNote("");
      toast({
        title: "Success",
        description: "Internal note added",
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Internal Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Add an internal note (only visible to staff)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
          <Button
            onClick={() => addNoteMutation.mutate()}
            disabled={!note.trim() || addNoteMutation.isPending}
            size="sm"
          >
            {addNoteMutation.isPending ? "Adding..." : "Add Note"}
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {internalMessages && internalMessages.length > 0 ? (
            internalMessages.map((msg: any) => (
              <div key={msg.id} className="p-3 bg-accent/50 rounded-lg border border-accent">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{msg.sender.full_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(msg.created_at), "MMM dd, h:mm a")}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No internal notes yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
