import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  showName?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function UserAvatar({ 
  showName = false,
  size = "default",
  className 
}: UserAvatarProps) {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12"
  };

  const initials = user.email?.substring(0, 2).toUpperCase() || "??";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={user.user_metadata?.avatar_url} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      {showName && (
        <span className="text-sm font-medium">
          {user.user_metadata?.full_name || user.email}
        </span>
      )}
    </div>
  );
}
