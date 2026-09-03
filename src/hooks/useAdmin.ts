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
