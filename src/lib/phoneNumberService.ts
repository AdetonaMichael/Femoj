import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

let authToken: string | null = null;

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Handle response errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    throw error;
  }
);

export function setAuthToken(token: string | null) {
  if (token) {
    authToken = token;
    console.log("[PhoneNumberService] Auth token set", {
      tokenLength: token.length,
      tokenPreview: token.slice(0, 20) + "...",
    });
  } else {
    authToken = null;
    console.log("[PhoneNumberService] Auth token cleared");
  }
}

export interface AvailableNumbersParams {
  country_code: string;
  area_code?: string;
  contains?: string;
  phone_number_pattern?: string;
  limit?: number;
  offset?: number;
  features?: string[];
}

export interface SearchPhoneNumbersParams {
  country_code: string;
  area_code?: string;
  contains?: string;
  locality?: string;
  administrative_area?: string;
  postal_code?: string;
  features?: string[];
  limit?: number;
  offset?: number;
}

export interface PurchasePhoneNumberParams {
  phone_number: string;
  friendly_name?: string;
  connection_id?: string;
}

export interface PhoneNumber {
  id: string;
  phone_number: string;
  country_code: string;
  area_code?: string;
  type: string;
  cost: {
    amount: string;
    currency: string;
  };
  capabilities: string[];
  features?: string[];
  friendly_name?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  settings?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  results?: T;
  phone_numbers?: T;
  pagination?: {
    limit: number;
    offset: number;
    total_available?: number;
    total?: number;
  };
  errors?: Record<string, any>;
}

class PhoneNumberService {
  // Get available phone numbers
  async getAvailableNumbers(
    params: AvailableNumbersParams
  ): Promise<ApiResponse<PhoneNumber[]>> {
    try {
      console.log("[PhoneNumberService] Fetching available numbers with params:", params);
      const response = await client.get<ApiResponse<PhoneNumber[]>>(
        "/phone-numbers/available",
        {
          params,
        }
      );
      console.log("[PhoneNumberService] Full raw response:", response);
      console.log("[PhoneNumberService] Response data:", response.data);
      console.log("[PhoneNumberService] Response data.data:", response.data?.data);
      console.log("[PhoneNumberService] Available numbers response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[PhoneNumberService] Available numbers error:", error);
      throw this.handleError(error);
    }
  }

  // Search phone numbers
  async searchPhoneNumbers(
    params: SearchPhoneNumbersParams
  ): Promise<ApiResponse<PhoneNumber[]>> {
    try {
      const response = await client.post<ApiResponse<PhoneNumber[]>>(
        "/phone-numbers/search",
        params
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Purchase a phone number
  async purchasePhoneNumber(
    params: PurchasePhoneNumberParams
  ): Promise<ApiResponse<PhoneNumber>> {
    try {
      const response = await client.post<ApiResponse<PhoneNumber>>(
        "/phone-numbers/purchase",
        params
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user's phone numbers
  async getMyPhoneNumbers(params?: {
    status?: "active" | "pending" | "deleted";
    phone_number?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<PhoneNumber[]>> {
    try {
      const response = await client.get<ApiResponse<PhoneNumber[]>>(
        "/phone-numbers",
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get phone number details
  async getPhoneNumber(phoneNumberId: string): Promise<ApiResponse<PhoneNumber>> {
    try {
      const response = await client.get<ApiResponse<PhoneNumber>>(
        `/phone-numbers/${phoneNumberId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update phone number
  async updatePhoneNumber(
    phoneNumberId: string,
    params: {
      friendly_name?: string;
      connection_id?: string;
      settings?: Record<string, any>;
    }
  ): Promise<ApiResponse<PhoneNumber>> {
    try {
      const response = await client.patch<ApiResponse<PhoneNumber>>(
        `/phone-numbers/${phoneNumberId}`,
        params
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Release phone number
  async releasePhoneNumber(phoneNumberId: string): Promise<ApiResponse> {
    try {
      const response = await client.delete<ApiResponse>(
        `/phone-numbers/${phoneNumberId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get phone number types
  async getPhoneNumberTypes(): Promise<ApiResponse<Record<string, string>>> {
    try {
      console.log("[PhoneNumberService] Fetching phone number types from:", `${client.defaults.baseURL}/phone-numbers/info/types`);
      const response = await client.get<
        ApiResponse<Record<string, string>>
      >("/phone-numbers/info/types");
      console.log("[PhoneNumberService] Phone number types response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[PhoneNumberService] Phone number types error:", error);
      throw this.handleError(error);
    }
  }

  // Get supported countries
  async getSupportedCountries(limit?: number, offset?: number): Promise<ApiResponse<{ data: Array<{ code: string; name: string }>; pagination: { total: number; limit: number; offset: number; has_more: boolean } }>> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit.toString());
      if (offset) params.append("offset", offset.toString());
      
      const url = params.toString() 
        ? `/phone-numbers/info/countries?${params.toString()}` 
        : "/phone-numbers/info/countries";
      
      console.log("[PhoneNumberService] Fetching countries from:", `${client.defaults.baseURL}${url}`);
      const response = await client.get<ApiResponse>(url);
      console.log("[PhoneNumberService] Countries response:", response.data);
      return response.data;
    } catch (error) {
      console.error("[PhoneNumberService] Countries error:", error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data?.message || "An error occurred",
        errors: error.response.data?.errors || {},
        details: error.response.data,
      };
    }
    return {
      status: 500,
      message: error.message || "Network error",
      errors: {},
    };
  }
}

export default new PhoneNumberService();
