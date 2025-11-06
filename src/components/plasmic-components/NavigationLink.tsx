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
  const navigate = useNavigate();

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}
