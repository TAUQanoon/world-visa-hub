import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface ProtectedContentProps {
  children?: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export function ProtectedContent({ 
  children,
  fallback = null,
  requireAuth = true
}: ProtectedContentProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <>{fallback}</>;
  }

  if (!requireAuth && user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
