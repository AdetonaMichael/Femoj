"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import {
  Shield,
  Plus,
  Trash2,
  Loader2,
  X,
  Check,
  Users,
  Key,
  Edit2,
} from "lucide-react";
import {
  useAdminRoles,
  useAdminPermissions,
  useAdminCreateRole,
  useAdminUpdateRole,
  useAdminDeleteRole,
  useAdminCreatePermission,
  useAdminDeletePermission,
} from "@/hooks/useAdmin";
import { adminService } from "@/services/adminService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function RolesPage() {
  const { roles, isLoading: rolesLoading, refetch: refetchRoles } = useAdminRoles();
  const { permissions, isLoading: permissionsLoading } = useAdminPermissions();

  const createRole = useAdminCreateRole();
  const updateRole = useAdminUpdateRole();
  const deleteRole = useAdminDeleteRole();
  const createPermission = useAdminCreatePermission();
  const deletePermission = useAdminDeletePermission();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionName, setPermissionName] = useState("");
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");

  const handleCreateRole = () => {
    setEditingRole(null);
    setRoleName("");
    setSelectedPermissions([]);
    setShowRoleModal(true);
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setRoleName(role.name);
    setSelectedPermissions(role.permissions.map((p: any) => p.name));
    setShowRoleModal(true);
  };

  const handleSaveRole = () => {
    if (!roleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    if (editingRole) {
      updateRole.mutate(
        { id: editingRole.id, payload: { name: roleName, permissions: selectedPermissions } },
        { onSuccess: () => setShowRoleModal(false) }
      );
    } else {
      createRole.mutate(
        { name: roleName, permissions: selectedPermissions },
        { onSuccess: () => setShowRoleModal(false) }
      );
    }
  };

  const handleDeleteRole = (role: any) => {
    if (["admin", "user", "customer"].includes(role.name)) {
      toast.error("Cannot delete built-in role");
      return;
    }
    if (role.users_count > 0) {
      toast.error(`Cannot delete — assigned to ${role.users_count} user(s)`);
      return;
    }
    deleteRole.mutate(role.id);
  };

  const handleCreatePermission = () => {
    if (!permissionName.trim()) {
      toast.error("Permission name is required");
      return;
    }
    createPermission.mutate(
      { name: permissionName },
      { onSuccess: () => { setShowPermissionModal(false); setPermissionName(""); } }
    );
  };

  const handleDeletePermission = (perm: any) => {
    const builtIn = [
      "manage_users", "manage_roles", "manage_permissions",
      "manage_customers", "manage_transactions", "perform_transactions",
      "navigate_application",
    ];
    if (builtIn.includes(perm.name)) {
      toast.error("Cannot delete built-in permission");
      return;
    }
    deletePermission.mutate(perm.id);
  };

  const togglePermission = (permName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permName)
        ? prev.filter((p) => p !== permName)
        : [...prev, permName]
    );
  };

  const isLoading = rolesLoading || permissionsLoading;

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Manage roles, permissions, and access control
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={staggerItem} className="flex gap-2">
        <button
          onClick={() => setActiveTab("roles")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "roles"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shield className="w-4 h-4 inline mr-2" />
          Roles ({roles?.length ?? 0})
        </button>
        <button
          onClick={() => setActiveTab("permissions")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "permissions"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Key className="w-4 h-4 inline mr-2" />
          Permissions ({permissions?.length ?? 0})
        </button>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : activeTab === "roles" ? (
        /* ── Roles Tab ─────────────────────────────────────── */
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Roles</CardTitle>
                <CardDescription>
                  Create and manage roles. Assign permissions to control what each role can do.
                </CardDescription>
              </div>
              <Button size="sm" onClick={handleCreateRole}>
                <Plus className="w-4 h-4 mr-2" />
                Add Role
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roles?.map((role: any) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{role.name}</p>
                          <span className="text-xs text-muted-foreground">
                            {role.users_count} user{role.users_count !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {role.permissions?.map((p: any) => (
                            <span
                              key={p.name}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary"
                            >
                              {p.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {!["admin", "user", "customer"].includes(role.name) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRole(role)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* ── Permissions Tab ────────────────────────────────── */
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>
                  Granular permissions that can be assigned to roles.
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => setShowPermissionModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Permission
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {permissions?.map((perm: any) => (
                  <div
                    key={perm.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Key className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{perm.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {perm.roles_count} role{perm.roles_count !== 1 ? "s" : ""} using this
                        </p>
                      </div>
                    </div>
                    {![
                      "manage_users", "manage_roles", "manage_permissions",
                      "manage_customers", "manage_transactions", "perform_transactions",
                      "navigate_application",
                    ].includes(perm.name) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePermission(perm)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ── Role Modal ──────────────────────────────────────── */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-lg border border-border shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">
                {editingRole ? "Edit Role" : "Create Role"}
              </h2>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Role Name</label>
                <Input
                  placeholder="e.g. editor"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Permissions</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3">
                  {permissions?.map((perm: any) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.name)}
                        onChange={() => togglePermission(perm.name)}
                        className="rounded border-border"
                      />
                      <span className="text-sm">{perm.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-border">
              <Button variant="outline" onClick={() => setShowRoleModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveRole}
                disabled={createRole.isPending || updateRole.isPending}
              >
                {(createRole.isPending || updateRole.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingRole ? "Save Changes" : "Create Role"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Permission Modal ────────────────────────────────── */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-lg border border-border shadow-xl w-full max-w-sm mx-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold">Create Permission</h2>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="text-sm font-medium mb-1 block">Permission Name</label>
              <Input
                placeholder="e.g. manage_posts"
                value={permissionName}
                onChange={(e) => setPermissionName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-border">
              <Button variant="outline" onClick={() => setShowPermissionModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePermission}
                disabled={createPermission.isPending}
              >
                {createPermission.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
