import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

interface MessageComposerProps {
  onSend: (message: string, isInternal: boolean) => Promise<void>;
  disabled?: boolean;
}

export function MessageComposer({ onSend, disabled = false }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSend(message.trim(), isInternal);
      setMessage("");
      setIsInternal(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t bg-background p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Switch
          id="internal-note"
          checked={isInternal}
          onCheckedChange={setIsInternal}
          disabled={disabled || isSending}
        />
        <Label htmlFor="internal-note" className="text-sm font-medium cursor-pointer">
          Internal Note (visible only to staff)
        </Label>
      </div>
      <div className="flex gap-2">
        <Textarea
          placeholder="Type your message... (Ctrl+Enter to send)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
          className="min-h-[80px] resize-none"
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isSending}
          size="icon"
          className="h-[80px] w-12 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
