/**
 * useCredits Hook
 * React Query hook for credit balance and transactions
 */

import { useQuery } from "@tanstack/react-query";
import { creditService } from "@/services/creditService";

export function useCredits() {
  const {
    data: balanceData,
    isLoading: balanceLoading,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: ["credits", "balance"],
    queryFn: () => creditService.getBalance(),
    select: (res) => (res.success ? res.data : null),
  });

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
  } = useQuery({
    queryKey: ["credits", "transactions"],
    queryFn: () => creditService.getTransactions({ limit: 20 }),
    select: (res) => (res.success ? res.data : []),
  });

  return {
    creditBalance: balanceData?.credit_balance ?? 0,
    transactions: transactionsData ?? [],
    balanceLoading,
    transactionsLoading,
    refetchBalance,
  };
}
