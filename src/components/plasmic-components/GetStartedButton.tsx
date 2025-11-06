import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface GetStartedButtonProps {
  text?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  redirectTo?: string;
}

export function GetStartedButton({ 
  text = "Get Started", 
  variant = "default",
  size = "lg",
  className,
  redirectTo = "/auth"
}: GetStartedButtonProps) {
  let navigate;
  
  try {
    navigate = useNavigate();
  } catch (error) {
    navigate = null;
  }

  const handleClick = () => {
    if (navigate) {
      navigate(redirectTo);
    } else {
      window.location.href = redirectTo;
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
