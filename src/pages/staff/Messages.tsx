import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MessageBubble } from "@/components/MessageBubble";
import { CaseListItem } from "@/components/CaseListItem";
import { MessageComposer } from "@/components/MessageComposer";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch cases with message info
  const { data: cases, isLoading: casesLoading } = useQuery({
    queryKey: ["staff-cases-with-messages", searchQuery, filterStatus, showUnreadOnly],
    queryFn: async () => {
      let query = supabase
        .from("cases")
        .select(`
          *,
          client:profiles!cases_client_id_fkey(full_name),
          visa_type:visa_types(name),
          messages(id, created_at, message, sender_id, read_at)
        `)
        .order("updated_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`case_number.ilike.%${searchQuery}%`);
      }

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map((c: any) => {
        const messages = c.messages || [];
        const unreadCount = messages.filter(
          (m: any) => m.sender_id !== user?.id && !m.read_at
        ).length;
        const lastMessage = messages.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        return {
          ...c,
          client_name: c.client?.full_name || "Unknown",
          visa_type_name: c.visa_type?.name || "Unknown",
          unread_count: unreadCount,
          last_message: lastMessage?.message,
          last_message_at: lastMessage?.created_at,
        };
      }).filter((c: any) => !showUnreadOnly || c.unread_count > 0);
    },
  });

  // Fetch messages for selected case
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["case-messages", selectedCaseId],
    queryFn: async () => {
      if (!selectedCaseId) return [];

      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name)
        `)
        .eq("case_id", selectedCaseId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedCaseId,
  });

  // Mark messages as read when viewing
  useEffect(() => {
    if (selectedCaseId && messages && user) {
      const unreadMessages = messages.filter(
        (m: any) => m.sender_id !== user.id && !m.read_at
      );

      if (unreadMessages.length > 0) {
        supabase
          .from("messages")
          .update({ read_at: new Date().toISOString() })
          .eq("case_id", selectedCaseId)
          .neq("sender_id", user.id)
          .is("read_at", null)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["staff-cases-with-messages"] });
          });
      }
    }
  }, [selectedCaseId, messages, user, queryClient]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["staff-cases-with-messages"] });
          if (selectedCaseId) {
            queryClient.invalidateQueries({ queryKey: ["case-messages", selectedCaseId] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCaseId, queryClient]);

  const handleSendMessage = async (message: string, isInternal: boolean) => {
    if (!selectedCaseId || !user) return;

    const selectedCase = cases?.find((c: any) => c.id === selectedCaseId);
    if (!selectedCase) return;

    const { error } = await supabase.from("messages").insert({
      case_id: selectedCaseId,
      sender_id: user.id,
      recipient_id: selectedCase.client_id,
      message,
      is_internal: isInternal,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Message sent",
      description: isInternal ? "Internal note added" : "Message sent to client",
    });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Left Panel - Cases List */}
      <Card className="w-96 flex flex-col">
        <div className="p-4 border-b space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant={showUnreadOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Unread
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {casesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))
            ) : cases && cases.length > 0 ? (
              cases.map((c: any) => (
                <CaseListItem
                  key={c.id}
                  caseNumber={c.case_number}
                  clientName={c.client_name}
                  lastMessage={c.last_message}
                  lastMessageAt={c.last_message_at}
                  unreadCount={c.unread_count}
                  isSelected={selectedCaseId === c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {showUnreadOnly
                    ? "No cases with unread messages"
                    : "No cases found matching your criteria"}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Right Panel - Messages */}
      <Card className="flex-1 flex flex-col">
        {selectedCaseId ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                {cases?.find((c: any) => c.id === selectedCaseId)?.case_number}
              </h2>
              <p className="text-sm text-muted-foreground">
                {cases?.find((c: any) => c.id === selectedCaseId)?.client_name}
              </p>
            </div>
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-3/4 mb-4" />
                ))
              ) : messages && messages.length > 0 ? (
                <>
                  {messages.map((msg: any) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg.message}
                      senderName={msg.sender?.full_name || "Unknown"}
                      timestamp={msg.created_at}
                      isOwnMessage={msg.sender_id === user?.id}
                      isInternal={msg.is_internal}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              )}
            </ScrollArea>
            <MessageComposer onSend={handleSendMessage} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a case to view messages</p>
          </div>
        )}
      </Card>
    </div>
  );
}
