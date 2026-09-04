/**
 * useAdmin Hook
 * React Query hook for admin data fetching
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

export function useAdminDashboard() {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminService.getDashboard(),
    select: (res) => (res.success ? res.data : null),
  });

  return {
    stats: dashboardData,
    isLoading,
    error,
    refetch,
  };
}

export function useAdminUsers(params?: {
  search?: string;
  status?: string;
  page?: number;
}) {
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => adminService.getUsers(params),
    select: (res) => (res.success ? res.data : null),
  });

  return {
    users: usersData,
    isLoading,
    refetch,
  };
}

export function useAdminCreditTransactions(params?: {
  user_id?: number;
  type?: string;
  page?: number;
}) {
  const {
    data: transactionsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin", "credit-transactions", params],
    queryFn: () => adminService.getCreditTransactions(params),
    select: (res) => (res.success ? res.data : null),
  });

  return {
    transactions: transactionsData,
    isLoading,
    refetch,
  };
}

export function useAdminServices() {
  const {
    data: servicesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: () => adminService.getServices(),
    select: (res) => (res.success ? res.data : []),
  });

  return {
    services: servicesData,
    isLoading,
    refetch,
  };
}

export function useAdminUpdatePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceId,
      payload,
    }: {
      serviceId: number;
      payload: {
        country_id: number;
        credit_price_activation: number;
        credit_price_rent_30d: number;
      };
    }) => adminService.updateServicePricing(serviceId, payload),
    onSuccess: () => {
      toast.success("Pricing updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    },
    onError: () => {
      toast.error("Failed to update pricing");
    },
  });
}

export function useAdminTransactions(params?: {
  user_id?: number;
  type?: string;
  status?: string;
  page?: number;
}) {
  const {
    data: transactionsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin", "transactions", params],
    queryFn: () => adminService.getTransactions(params),
    select: (res) => (res.success ? res.data : null),
  });

  return {
    transactions: transactionsData,
    isLoading,
    refetch,
  };
}

export function useAdminNumbers(params?: {
  search?: string;
  status?: string;
  page?: number;
}) {
  const {
    data: numbersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin", "numbers", params],
    queryFn: () => adminService.getNumbers(params),
    select: (res) => (res.success ? res.data : null),
  });

  return {
    numbers: numbersData,
    isLoading,
    refetch,
  };
}

export function useAdminCreditBundles() {
  const {
    data: bundlesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin", "credit-bundles"],
    queryFn: () => adminService.getCreditBundles(),
    select: (res) => (res.success ? res.data : []),
  });

  return {
    bundles: bundlesData,
    isLoading,
    refetch,
  };
}

// ── Role Management Hooks ─────────────────────────────────

export function useAdminRoles() {
  const {
    data: rolesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin", "roles"],
    queryFn: () => adminService.getRoles(),
    select: (res) => (res.success ? res.data : []),
  });

  return {
    roles: rolesData,
    isLoading,
    refetch,
  };
}

export function useAdminPermissions() {
  const {
    data: permissionsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin", "permissions"],
    queryFn: () => adminService.getPermissions(),
    select: (res) => (res.success ? res.data : []),
  });

  return {
    permissions: permissionsData,
    isLoading,
    refetch,
  };
}

export function useAdminCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; permissions?: string[] }) =>
      adminService.createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] });
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create role");
    },
  });
}

export function useAdminUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { name: string; permissions?: string[] };
    }) => adminService.updateRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] });
      toast.success("Role updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update role");
    },
  });
}

export function useAdminDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] });
      toast.success("Role deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete role");
    },
  });
}

export function useAdminCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string }) =>
      adminService.createPermission(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "permissions"] });
      toast.success("Permission created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create permission");
    },
  });
}

export function useAdminDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminService.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "permissions"] });
      toast.success("Permission deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete permission");
    },
  });
}

export function useAdminUserRoles() {
  const queryClient = useQueryClient();

  const assignRole = useMutation({
    mutationFn: ({
      userId,
      roleName,
    }: {
      userId: number;
      roleName: string;
    }) => adminService.assignRoleToUser(userId, roleName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Role assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to assign role");
    },
  });

  const revokeRole = useMutation({
    mutationFn: ({
      userId,
      roleId,
    }: {
      userId: number;
      roleId: number;
    }) => adminService.revokeRoleFromUser(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Role revoked successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to revoke role");
    },
  });

  return {
    assignRole,
    revokeRole,
  };
}
