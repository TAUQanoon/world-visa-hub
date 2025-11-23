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
  let signOut;
  
  try {
    const auth = useAuth();
    signOut = auth.signOut;
  } catch (error) {
    signOut = null;
  }

  const handleClick = () => {
    if (signOut) {
      signOut();
    } else {
      // Fallback: redirect to auth page if context not available
      window.location.href = "/auth";
    }
  };

  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {text}
    </Button>
  );
}
