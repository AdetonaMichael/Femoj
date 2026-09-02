/**
 * useVirtualNumbers Hook
 * React Query hook for virtual number operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { virtualNumberService } from "@/services/virtualNumberService";
import type { VNOrderPayload } from "@/types";
import { toast } from "sonner";

export function useVirtualNumbers() {
  const queryClient = useQueryClient();

  // Services query
  const {
    data: servicesData,
    isLoading: servicesLoading,
  } = useQuery({
    queryKey: ["vn-services"],
    queryFn: () => virtualNumberService.getServices(),
    select: (res) => (res.success ? res.data : []),
  });

  // My numbers query
  const {
    data: numbersData,
    isLoading: numbersLoading,
    refetch: refetchNumbers,
  } = useQuery({
    queryKey: ["vn-my-numbers"],
    queryFn: () => virtualNumberService.getMyNumbers(),
    select: (res) => (res.success ? res.data : []),
    refetchInterval: 30000, // Poll every 30s for new SMS
  });

  // Stats query
  const {
    data: statsData,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["vn-stats"],
    queryFn: () => virtualNumberService.getStats(),
    select: (res) => (res.success ? res.data : null),
  });

  // Get countries for a service
  const useCountries = (serviceId: number | null) => {
    return useQuery({
      queryKey: ["vn-countries", serviceId],
      queryFn: () => virtualNumberService.getCountries(serviceId!),
      select: (res) => (res.success ? res.data : []),
      enabled: !!serviceId,
    });
  };

  // Get pricing
  const usePricing = (serviceId: number | null, countryId: number | null) => {
    return useQuery({
      queryKey: ["vn-pricing", serviceId, countryId],
      queryFn: () => virtualNumberService.getPricing(serviceId!, countryId!),
      select: (res) => (res.success ? res.data : null),
      enabled: !!serviceId && !!countryId,
    });
  };

  // Get single number detail
  const useNumberDetail = (id: number | null) => {
    return useQuery({
      queryKey: ["vn-detail", id],
      queryFn: () => virtualNumberService.getNumber(id!),
      select: (res) => (res.success ? res.data : null),
      enabled: !!id,
      refetchInterval: 10000, // Poll every 10s for new SMS
    });
  };

  // Order number mutation
  const orderMutation = useMutation({
    mutationFn: (payload: VNOrderPayload) =>
      virtualNumberService.orderNumber(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Virtual number purchased successfully!");
        queryClient.invalidateQueries({ queryKey: ["vn-my-numbers"] });
        queryClient.invalidateQueries({ queryKey: ["vn-stats"] });
        queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
      } else {
        toast.error(res.message || "Failed to purchase number");
      }
    },
    onError: () => {
      toast.error("Failed to purchase number. Please try again.");
    },
  });

  // Release number mutation
  const releaseMutation = useMutation({
    mutationFn: (id: number) => virtualNumberService.releaseNumber(id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Number released successfully");
        queryClient.invalidateQueries({ queryKey: ["vn-my-numbers"] });
        queryClient.invalidateQueries({ queryKey: ["vn-stats"] });
      } else {
        toast.error(res.message || "Failed to release number");
      }
    },
  });

  // Refresh SMS mutation
  const refreshSmsMutation = useMutation({
    mutationFn: (id: number) => virtualNumberService.refreshSms(id),
  });

  return {
    services: servicesData,
    servicesLoading,
    numbers: numbersData,
    numbersLoading,
    stats: statsData,
    statsLoading,
    refetchNumbers,
    useCountries,
    usePricing,
    useNumberDetail,
    orderNumber: orderMutation.mutateAsync,
    isOrdering: orderMutation.isPending,
    releaseNumber: releaseMutation.mutateAsync,
    isReleasing: releaseMutation.isPending,
    refreshSms: refreshSmsMutation.mutateAsync,
  };
}
