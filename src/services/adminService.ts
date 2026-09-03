/**
 * Admin Service
 * Handles all admin API communication
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client";
import type {
  ApiResponse,
  AdminDashboardStats,
  AdminUser,
  CreditTransaction,
  VNPricing,
} from "@/types";

export const adminService = {
  // Dashboard
  async getDashboard(): Promise<ApiResponse<AdminDashboardStats>> {
    return apiGet<AdminDashboardStats>("/admin/dashboard", {
      requiresAuth: true,
    });
  },

  // Users
  async getUsers(params?: {
    search?: string;
    status?: string;
    verified?: string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    if (params?.verified) query.set("verified", params.verified);
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));
    const qs = query.toString();
    return apiGet<any>(`/admin/users${qs ? `?${qs}` : ""}`, {
      requiresAuth: true,
    });
  },

  async getUser(id: number): Promise<ApiResponse<{ user: AdminUser; stats: any }>> {
    return apiGet<{ user: AdminUser; stats: any }>(`/admin/users/${id}`, {
      requiresAuth: true,
    });
  },

  async toggleUserStatus(id: number): Promise<ApiResponse<any>> {
    return apiPut<any>(`/admin/users/${id}/toggle-status`, {}, {
      requiresAuth: true,
    });
  },

  // Credit Transactions
  async getCreditTransactions(params?: {
    user_id?: number;
    type?: string;
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.user_id) query.set("user_id", String(params.user_id));
    if (params?.type) query.set("type", params.type);
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));
    const qs = query.toString();
    return apiGet<any>(`/admin/credits/transactions${qs ? `?${qs}` : ""}`, {
      requiresAuth: true,
    });
  },

  async adjustCredits(payload: {
    user_id: number;
    amount: number;
    description: string;
  }): Promise<ApiResponse<any>> {
    return apiPost<any>("/admin/credits/adjust", payload, {
      requiresAuth: true,
    });
  },

  // Services
  async getServices(): Promise<ApiResponse<any[]>> {
    return apiGet<any[]>("/admin/services", {
      requiresAuth: true,
    });
  },

  async updateServicePricing(
    serviceId: number,
    payload: {
      country_id: number;
      credit_price_activation: number;
      credit_price_rent_30d: number;
    }
  ): Promise<ApiResponse<any>> {
    return apiPut<any>(`/admin/services/${serviceId}/pricing`, payload, {
      requiresAuth: true,
    });
  },

  // Transactions
  async getTransactions(params?: {
    user_id?: number;
    type?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.user_id) query.set("user_id", String(params.user_id));
    if (params?.type) query.set("type", params.type);
    if (params?.status) query.set("status", params.status);
    if (params?.date_from) query.set("date_from", params.date_from);
    if (params?.date_to) query.set("date_to", params.date_to);
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));
    const qs = query.toString();
    return apiGet<any>(`/admin/transactions${qs ? `?${qs}` : ""}`, {
      requiresAuth: true,
    });
  },

  // Numbers
  async getNumbers(params?: {
    search?: string;
    status?: string;
    service_id?: number;
    country_id?: number;
    page?: number;
    per_page?: number;
  }): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.status) query.set("status", params.status);
    if (params?.service_id) query.set("service_id", String(params.service_id));
    if (params?.country_id) query.set("country_id", String(params.country_id));
    if (params?.page) query.set("page", String(params.page));
    if (params?.per_page) query.set("per_page", String(params.per_page));
    const qs = query.toString();
    return apiGet<any>(`/admin/numbers${qs ? `?${qs}` : ""}`, {
      requiresAuth: true,
    });
  },

  // Credit Bundles
  async getCreditBundles(): Promise<ApiResponse<any[]>> {
    return apiGet<any[]>("/admin/credit-bundles", {
      requiresAuth: true,
    });
  },

  async createCreditBundle(payload: {
    name: string;
    credits: number;
    price: number;
    description?: string;
    is_active?: boolean;
  }): Promise<ApiResponse<any>> {
    return apiPost<any>("/admin/credit-bundles", payload, {
      requiresAuth: true,
    });
  },

  async updateCreditBundle(
    id: number,
    payload: Partial<{
      name: string;
      credits: number;
      price: number;
      description: string;
      is_active: boolean;
    }>
  ): Promise<ApiResponse<any>> {
    return apiPut<any>(`/admin/credit-bundles/${id}`, payload, {
      requiresAuth: true,
    });
  },

  async deleteCreditBundle(id: number): Promise<ApiResponse<any>> {
    return apiDelete<any>(`/admin/credit-bundles/${id}`, {
      requiresAuth: true,
    });
  },
};
