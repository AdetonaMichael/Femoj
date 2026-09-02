/**
 * useReferrals Hook
 * Custom hook for referral data fetching using React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { referralService } from "@/services/referralService";
import { toast } from "sonner";

export function useReferrals() {
  const queryClient = useQueryClient();

  const {
    data: linkData,
    isLoading: linksLoading,
    error: linksError,
  } = useQuery({
    queryKey: ["referrals", "my-link"],
    queryFn: () => referralService.getMyLink(),
    select: (res) => (res.success ? res.data : null),
  });

  const {
    data: referralsData,
    isLoading: referralsLoading,
    error: referralsError,
  } = useQuery({
    queryKey: ["referrals", "my-referrals"],
    queryFn: () => referralService.getMyReferrals(),
    select: (res) => (res.success ? res.data : []),
  });

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["referrals", "stats"],
    queryFn: () => referralService.getStats(),
    select: (res) => (res.success ? res.data : null),
  });

  const {
    data: milestonesData,
    isLoading: milestonesLoading,
    error: milestonesError,
  } = useQuery({
    queryKey: ["referrals", "milestones"],
    queryFn: () => referralService.getMilestones(),
    select: (res) => (res.success ? res.data : []),
  });

  const createLinkMutation = useMutation({
    mutationFn: (payload: { programId: number; userId: number }) =>
      referralService.createLink(payload),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["referrals", "my-link"] });
        toast.success("Referral link created!");
      } else {
        toast.error(res.message || "Failed to create referral link");
      }
    },
    onError: () => {
      toast.error("Failed to create referral link");
    },
  });

  const createLink = useCallback(
    (programId: number, userId: number) => {
      createLinkMutation.mutate({ programId, userId });
    },
    [createLinkMutation]
  );

  return {
    links: linkData,
    referrals: referralsData,
    stats: statsData,
    milestones: milestonesData,
    isLoading: linksLoading || referralsLoading || statsLoading || milestonesLoading,
    error: linksError || referralsError || statsError || milestonesError,
    createLink,
    isCreatingLink: createLinkMutation.isPending,
  };
}
