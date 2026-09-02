/**
 * Virtual Number Service
 * Handles all virtual number and SMS API communication
 */

import { apiGet, apiPost } from "@/lib/api-client";
import type {
  ApiResponse,
  VNCountry,
  VNService,
  VNPricing,
  VirtualNumberItem,
  VNDetail,
  VNSmsMessage,
  VNOrderPayload,
  VNOrderResponse,
  VNStats,
} from "@/types";

export const virtualNumberService = {
  /**
   * Get all available services
   * GET /virtual-numbers/services
   */
  async getServices(category?: string): Promise<ApiResponse<VNService[]>> {
    const query = category ? `?category=${category}` : "";
    return apiGet<VNService[]>(`/virtual-numbers/services${query}`);
  },

  /**
   * Get countries available for a service
   * GET /virtual-numbers/countries?service_id=X
   */
  async getCountries(serviceId: number): Promise<ApiResponse<VNCountry[]>> {
    return apiGet<VNCountry[]>(
      `/virtual-numbers/countries?service_id=${serviceId}`,
      { requiresAuth: true }
    );
  },

  /**
   * Get pricing for a service + country
   * GET /virtual-numbers/pricing?service_id=X&country_id=Y
   */
  async getPricing(
    serviceId: number,
    countryId: number
  ): Promise<ApiResponse<VNPricing>> {
    return apiGet<VNPricing>(
      `/virtual-numbers/pricing?service_id=${serviceId}&country_id=${countryId}`,
      { requiresAuth: true }
    );
  },

  /**
   * Order a virtual number
   * POST /virtual-numbers/order
   */
  async orderNumber(
    payload: VNOrderPayload
  ): Promise<ApiResponse<VNOrderResponse>> {
    return apiPost<VNOrderResponse, VNOrderPayload>(
      "/virtual-numbers/order",
      payload,
      { requiresAuth: true }
    );
  },

  /**
   * Get user's virtual numbers
   * GET /virtual-numbers/my-numbers
   */
  async getMyNumbers(params?: {
    status?: string;
    type?: string;
  }): Promise<ApiResponse<VirtualNumberItem[]>> {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.type) query.set("type", params.type);
    const qs = query.toString();
    return apiGet<VirtualNumberItem[]>(
      `/virtual-numbers/my-numbers${qs ? `?${qs}` : ""}`,
      { requiresAuth: true }
    );
  },

  /**
   * Get single number detail with messages
   * GET /virtual-numbers/{id}
   */
  async getNumber(id: number): Promise<ApiResponse<VNDetail>> {
    return apiGet<VNDetail>(`/virtual-numbers/${id}`, {
      requiresAuth: true,
    });
  },

  /**
   * Release a virtual number
   * POST /virtual-numbers/{id}/release
   */
  async releaseNumber(id: number): Promise<ApiResponse<null>> {
    return apiPost<null>(`/virtual-numbers/${id}/release`, undefined, {
      requiresAuth: true,
    });
  },

  /**
   * Refresh SMS for a number
   * POST /virtual-numbers/{id}/refresh-sms
   */
  async refreshSms(id: number): Promise<ApiResponse<VNSmsMessage[]>> {
    return apiPost<VNSmsMessage[]>(`/virtual-numbers/${id}/refresh-sms`, undefined, {
      requiresAuth: true,
    });
  },

  /**
   * Get user's virtual number stats
   * GET /virtual-numbers/stats
   */
  async getStats(): Promise<ApiResponse<VNStats>> {
    return apiGet<VNStats>("/virtual-numbers/stats", { requiresAuth: true });
  },
};
