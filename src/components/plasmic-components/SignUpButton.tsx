import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SignUpButtonProps {
  text?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function SignUpButton({ 
  text = "Sign Up", 
  variant = "default",
  size = "default",
  className 
}: SignUpButtonProps) {
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
