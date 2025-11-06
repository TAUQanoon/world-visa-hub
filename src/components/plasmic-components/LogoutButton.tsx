import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  text?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export function LogoutButton({ 
  text = "Logout", 
  variant = "ghost",
  size = "default",
  className,
  showIcon = true
}: LogoutButtonProps) {
  const { signOut } = useAuth();

  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      onClick={signOut}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {text}
    </Button>
  );
}
