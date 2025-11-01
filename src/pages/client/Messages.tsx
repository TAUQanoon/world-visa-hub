import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export default function ClientMessages() {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  const { data: messages, isLoading } = useQuery({
    queryKey: ["my-messages", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("messages")
        .select(`
          *,
          cases (
            case_number,
            visa_types (
              name,
              country
            )
          ),
          sender:profiles!messages_sender_id_fkey (
            full_name
          )
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .eq("is_internal", false)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const { data: cases } = useQuery({
    queryKey: ["my-cases-for-messages", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("cases")
        .select("id, case_number")
        .eq("client_id", user.id);
      return data || [];
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-2">
          Communicate with your case manager
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send New Message</CardTitle>
          <CardDescription>Contact your case manager about any case</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={4}
          />
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
          <CardDescription>All conversations about your cases</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg: any) => (
                <Card key={msg.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{msg.sender?.full_name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">
                          Case: {msg.cases?.case_number}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                        {!msg.read_at && msg.recipient_id === user?.id && (
                          <Badge variant="default" className="mt-1">New</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm">Start a conversation with your case manager</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
