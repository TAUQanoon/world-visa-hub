import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  text?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function SignInButton({ 
  text = "Sign In", 
  variant = "default",
  size = "default",
  className 
}: SignInButtonProps) {
  const navigate = useNavigate();

  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      onClick={() => navigate("/auth")}
    >
      {text}
    </Button>
  );
}
