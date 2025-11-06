import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface NavigationLinkProps {
  href: string;
  children?: ReactNode;
  className?: string;
}

export function NavigationLink({ 
  href,
  children,
  className 
}: NavigationLinkProps) {
  let navigate;
  
  try {
    navigate = useNavigate();
  } catch (error) {
    // Not in router context, use window.location as fallback
    navigate = null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (navigate) {
      navigate(href);
    } else {
      // Fallback to window.location if router context is not available
      window.location.href = href;
    }
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
