import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageBubble } from "@/components/MessageBubble";
import { MessageComposer } from "@/components/MessageComposer";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessagesSectionProps {
  caseId: string;
  showInternal?: boolean;
}

export function MessagesSection({ caseId, showInternal = false }: MessagesSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["case-messages", caseId, showInternal],
    queryFn: async () => {
      const query = supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, email)
        `)
        .eq("case_id", caseId)
        .order("created_at", { ascending: true });

      if (!showInternal) {
        query.eq("is_internal", false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!caseId,
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${caseId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `case_id=eq.${caseId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["case-messages", caseId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [caseId, queryClient]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (message: string, isInternal: boolean) => {
    const { error } = await supabase.from("messages").insert([
      {
        case_id: caseId,
        sender_id: user!.id,
        message,
        is_internal: isInternal,
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : messages && messages.length > 0 ? (
            <>
              {messages.map((msg: any) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.message}
                  senderName={msg.sender.full_name}
                  timestamp={msg.created_at}
                  isOwnMessage={msg.sender_id === user?.id}
                  isInternal={msg.is_internal}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm mt-1">Start the conversation with your consultant</p>
              </div>
            </div>
          )}
        </div>
        <div className="border-t pt-4">
          <MessageComposer onSend={handleSendMessage} />
        </div>
      </CardContent>
    </Card>
  );
}
