import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Shield, UserCog } from "lucide-react";
import { UserRole } from "@/hooks/useUserRole";

type UserWithRoles = {
  id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  roles: UserRole[];
};

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all users with their roles
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: allRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Group roles by user_id
      const rolesByUser = allRoles.reduce((acc, role) => {
        if (!acc[role.user_id]) acc[role.user_id] = [];
        acc[role.user_id].push(role.role as UserRole);
        return acc;
      }, {} as Record<string, UserRole[]>);

      return profiles.map((profile) => ({
        ...profile,
        roles: rolesByUser[profile.id] || [],
      }));
    },
  });

  // Add role mutation
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Role added",
        description: "User role has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add role. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove role mutation
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({
        title: "Role removed",
        description: "User role has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove role. Please try again.",
        variant: "destructive",
      });
    },
  });

  const openRoleDialog = (user: UserWithRoles) => {
    setSelectedUser(user);
    setSelectedRoles([...user.roles]);
  };

  const closeRoleDialog = () => {
    setSelectedUser(null);
    setSelectedRoles([]);
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;

    // Prevent removing own admin role
    if (
      selectedUser.id === currentUser?.id &&
      selectedUser.roles.includes("admin") &&
      !selectedRoles.includes("admin")
    ) {
      toast({
        title: "Cannot remove own admin role",
        description: "You cannot remove your own admin privileges.",
        variant: "destructive",
      });
      return;
    }

    const currentRoles = new Set(selectedUser.roles);
    const newRoles = new Set(selectedRoles);

    // Roles to add
    const toAdd = selectedRoles.filter((role) => !currentRoles.has(role));

    // Roles to remove
    const toRemove = selectedUser.roles.filter((role) => !newRoles.has(role));

    try {
      // Add new roles
      for (const role of toAdd) {
        await addRoleMutation.mutateAsync({ userId: selectedUser.id, role });
      }

      // Remove old roles
      for (const role of toRemove) {
        await removeRoleMutation.mutateAsync({ userId: selectedUser.id, role });
      }

      closeRoleDialog();
    } catch (error) {
      console.error("Error updating roles:", error);
    }
  };

  const toggleRole = (role: UserRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "staff":
        return "default";
      case "client":
        return "secondary";
      default:
        return "outline";
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage user roles and permissions
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name || "No name"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant={getRoleBadgeVariant(role)}
                          >
                            {role}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No roles
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openRoleDialog(user)}
                    >
                      <UserCog className="h-4 w-4 mr-1" />
                      Manage Roles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={closeRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Manage Roles: {selectedUser?.full_name || selectedUser?.email}
            </DialogTitle>
            <DialogDescription>
              Select the roles for this user. Changes will be applied
              immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="role-client"
                checked={selectedRoles.includes("client")}
                onCheckedChange={() => toggleRole("client")}
              />
              <Label htmlFor="role-client" className="cursor-pointer">
                <div>
                  <div className="font-medium">Client</div>
                  <div className="text-sm text-muted-foreground">
                    Standard user with access to their own cases
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="role-staff"
                checked={selectedRoles.includes("staff")}
                onCheckedChange={() => toggleRole("staff")}
              />
              <Label htmlFor="role-staff" className="cursor-pointer">
                <div>
                  <div className="font-medium">Staff</div>
                  <div className="text-sm text-muted-foreground">
                    Can manage cases and view all client data
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="role-admin"
                checked={selectedRoles.includes("admin")}
                onCheckedChange={() => toggleRole("admin")}
                disabled={
                  selectedUser?.id === currentUser?.id &&
                  selectedUser?.roles.includes("admin")
                }
              />
              <Label htmlFor="role-admin" className="cursor-pointer">
                <div>
                  <div className="font-medium">Admin</div>
                  <div className="text-sm text-muted-foreground">
                    Full system access including user management
                  </div>
                </div>
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeRoleDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveRoles}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
