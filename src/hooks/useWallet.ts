/**
 * useWallet Hook
 * Custom hook for wallet data fetching using React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { walletService } from "@/services/walletService";
import { toast } from "sonner";
import type { WalletTransactionItem } from "@/types";

export function useWallet() {
  const queryClient = useQueryClient();

  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: ["wallet", "balance"],
    queryFn: () => walletService.getBalance(),
    select: (res) => (res.success ? res.data : null),
  });

  const {
    data: transactionsResponse,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useQuery({
    queryKey: ["wallet", "transactions"],
    queryFn: () => walletService.getTransactions({ limit: 20 }),
    select: (res): { transactions: WalletTransactionItem[]; pagination: any } | null => {
      if (!res.success) return null;
      const txns: WalletTransactionItem[] = Array.isArray(res.data) ? res.data : (res.data as any)?.data || [];
      const pagination = (res as any).pagination || (res.data as any)?.pagination || null;
      return { transactions: txns, pagination };
    },
  });

  const {
    data: bundlesData,
    isLoading: bundlesLoading,
    error: bundlesError,
  } = useQuery({
    queryKey: ["credit-bundles"],
    queryFn: () => walletService.getBundles(),
    select: (res) => (res.success ? res.data : []),
  });

  const {
    data: purchaseHistory,
    isLoading: historyLoading,
  } = useQuery({
    queryKey: ["credit-bundles", "history"],
    queryFn: () => walletService.getPurchaseHistory(10),
    select: (res) => (res.success ? res.data : []),
  });

  const initializePurchaseMutation = useMutation({
    mutationFn: (payload: { bundle_id: number; payment_provider: string }) =>
      walletService.initializePurchase(payload),
    onSuccess: (res) => {
      if (res.success && res.data) {
        // Redirect to Paystack
        if (res.data.authorization_url) {
          window.location.href = res.data.authorization_url;
        }
      } else {
        toast.error(res.message || "Failed to initialize payment");
      }
    },
    onError: () => {
      toast.error("Failed to initialize payment. Please try again.");
    },
  });

  const verifyPurchaseMutation = useMutation({
    mutationFn: (payload: { reference: string }) =>
      walletService.verifyPurchase(payload),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "Payment verified successfully!");
        queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
        queryClient.invalidateQueries({ queryKey: ["wallet", "transactions"] });
        queryClient.invalidateQueries({ queryKey: ["credit-bundles", "history"] });
      } else {
        toast.error(res.message || "Payment verification failed");
      }
    },
    onError: () => {
      toast.error("Payment verification failed. Please try again.");
    },
  });

  const initializePurchase = useCallback(
    (bundleId: number, paymentProvider: string) => {
      initializePurchaseMutation.mutate({
        bundle_id: bundleId,
        payment_provider: paymentProvider,
      });
    },
    [initializePurchaseMutation]
  );

  const verifyPurchase = useCallback(
    async (reference: string) => {
      return verifyPurchaseMutation.mutateAsync({ reference });
    },
    [verifyPurchaseMutation]
  );

  return {
    balance: balanceData,
    transactions: transactionsResponse?.transactions || [],
    pagination: transactionsResponse?.pagination,
    bundles: bundlesData,
    purchaseHistory,
    isLoading: balanceLoading || transactionsLoading || bundlesLoading,
    balanceLoading,
    transactionsLoading,
    bundlesLoading,
    historyLoading,
    error: balanceError || transactionsError || bundlesError,
    initializePurchase,
    isInitializing: initializePurchaseMutation.isPending,
    verifyPurchase,
    isVerifying: verifyPurchaseMutation.isPending,
    refetchBalance,
  };
}
