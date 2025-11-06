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
  let navigate;
  
  try {
    navigate = useNavigate();
  } catch (error) {
    navigate = null;
  }

  const handleClick = () => {
    if (navigate) {
      navigate("/auth");
    } else {
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
      {text}
    </Button>
  );
}
