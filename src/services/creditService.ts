/**
 * Credit Service
 * Handles credit balance and transaction API communication
 */

import { apiGet } from "@/lib/api-client";
import type { ApiResponse, CreditBalance, CreditTransaction } from "@/types";

export const creditService = {
  async getBalance(): Promise<ApiResponse<CreditBalance>> {
    return apiGet<CreditBalance>("/payment/credit-balance", {
      requiresAuth: true,
    });
  },

  async getTransactions(params?: {
    type?: string;
    limit?: number;
  }): Promise<ApiResponse<CreditTransaction[]>> {
    const query = new URLSearchParams();
    if (params?.type) query.set("type", params.type);
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return apiGet<CreditTransaction[]>(
      `/payment/credit-transactions${qs ? `?${qs}` : ""}`,
      { requiresAuth: true }
    );
  },
};
