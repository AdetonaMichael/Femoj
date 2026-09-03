/**
 * useRoles Hook
 * Fetches user roles for role switcher
 */

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { UserRoles } from "@/types";

export function useRoles() {
  const {
    data: rolesData,
    isLoading,
  } = useQuery({
    queryKey: ["auth", "roles"],
    queryFn: () => apiGet<UserRoles>("/auth/roles", { requiresAuth: true }),
    select: (res) => (res.success ? res.data : null),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    roles: rolesData?.roles ?? [],
    permissions: rolesData?.permissions ?? [],
    isAdmin: rolesData?.is_admin ?? false,
    isLoading,
  };
}
