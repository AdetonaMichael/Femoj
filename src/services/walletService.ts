/**
 * Wallet Service
 * Handles all wallet and credit bundle API communication
 */

import { apiGet, apiPost } from "@/lib/api-client";
import type {
  ApiResponse,
  WalletBalance,
  WalletTransactionItem,
  WalletTransactionsResponse,
  CreditBundle,
  CreditBundlePurchaseResponse,
  CreditBundleVerifyResponse,
  CreditPurchaseHistoryItem,
} from "@/types";

export const walletService = {
  /**
   * Get wallet balance
   * GET /payment/wallet/balance
   */
  async getBalance(): Promise<ApiResponse<WalletBalance>> {
    return apiGet<WalletBalance>("/payment/wallet/balance", {
      requiresAuth: true,
    });
  },

  /**
   * Get wallet transaction history
   * GET /payment/wallet/transactions
   */
  async getTransactions(params?: {
    limit?: number;
    page?: number;
    type?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ApiResponse<WalletTransactionsResponse>> {
    const query = new URLSearchParams();
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.page) query.set("page", String(params.page));
    if (params?.type) query.set("type", params.type);
    if (params?.date_from) query.set("date_from", params.date_from);
    if (params?.date_to) query.set("date_to", params.date_to);
    const qs = query.toString();
    const endpoint = `/payment/wallet/transactions${qs ? `?${qs}` : ""}`;
    return apiGet<WalletTransactionsResponse>(endpoint, {
      requiresAuth: true,
    });
  },

  /**
   * Get credit bundles
   * GET /payment/credit-bundles
   */
  async getBundles(): Promise<ApiResponse<CreditBundle[]>> {
    return apiGet<CreditBundle[]>("/payment/credit-bundles");
  },

  /**
   * Initialize credit bundle purchase
   * POST /payment/credit-bundles/purchase
   */
  async initializePurchase(payload: {
    bundle_id: number;
    payment_provider: string;
  }): Promise<ApiResponse<CreditBundlePurchaseResponse>> {
    return apiPost<CreditBundlePurchaseResponse>(
      "/payment/credit-bundles/purchase",
      payload,
      { requiresAuth: true }
    );
  },

  /**
   * Verify credit bundle purchase
   * POST /payment/credit-bundles/verify
   */
  async verifyPurchase(payload: {
    reference: string;
  }): Promise<ApiResponse<CreditBundleVerifyResponse>> {
    return apiPost<CreditBundleVerifyResponse>(
      "/payment/credit-bundles/verify",
      payload,
      { requiresAuth: true }
    );
  },

  /**
   * Get credit purchase history
   * GET /payment/credit-bundles/history
   */
  async getPurchaseHistory(
    limit?: number
  ): Promise<ApiResponse<CreditPurchaseHistoryItem[]>> {
    const endpoint = `/payment/credit-bundles/history${limit ? `?limit=${limit}` : ""}`;
    return apiGet<CreditPurchaseHistoryItem[]>(endpoint, {
      requiresAuth: true,
    });
  },
};
