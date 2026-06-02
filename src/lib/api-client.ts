/**
 * HTTP Client for API Communication
 * Handles all API requests with proper error handling and type safety
 */

import type { ApiResponse, ApiErrorResponse } from "@/types";
import { getAuthorizationHeader } from "./token";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL environment variable is not set");
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

/**
 * Fetch wrapper with error handling and type safety
 */
export async function apiFetch<TData = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<TData>> {
  const { requiresAuth = false, ...fetchOptions } = options;

  const url = `${BASE_URL}${endpoint}`;
  const headers = new Headers(fetchOptions.headers || {});

  // Add authorization header if required
  if (requiresAuth) {
    const authHeader = getAuthorizationHeader();
    if (!authHeader) {
      return {
        success: false,
        message: "Unauthorized - No token found",
        errors: { auth: ["Please login again"] },
      } as ApiErrorResponse;
    }
    headers.set("Authorization", authHeader.Authorization);
  }

  // Add default content type for JSON
  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  // Log request if verbose logging is enabled
  if (process.env.NEXT_PUBLIC_VERBOSE_API_LOGGING === "true") {
    console.log("[API Request]", {
      url,
      method: fetchOptions.method || "GET",
      headers: Object.fromEntries(headers),
    });
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();

    // Log response if verbose logging is enabled
    if (process.env.NEXT_PUBLIC_VERBOSE_API_LOGGING === "true") {
      console.log("[API Response]", {
        url,
        status: response.status,
        data,
      });
    }

    // Handle non-2xx responses
    if (!response.ok) {
      // Handle rate limiting (429) with a friendly message
      if (response.status === 429) {
        return {
          success: false,
          message: data.message || "You're making requests too quickly. Please wait a moment and try again.",
          errors: data.errors || { rateLimit: ["Too many requests"] },
        } as ApiErrorResponse;
      }

      return {
        success: false,
        message: data.message || `API Error: ${response.status}`,
        errors: data.errors || { general: [response.statusText] },
      } as ApiErrorResponse;
    }

    return data as ApiResponse<TData>;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Network error occurred";

    console.error("[API Error]", {
      url,
      error: errorMessage,
    });

    return {
      success: false,
      message: "Network error. Please check your connection.",
      errors: { network: [errorMessage] },
    } as ApiErrorResponse;
  }
}

/**
 * GET request
 */
export function apiGet<TData = unknown>(
  endpoint: string,
  options?: RequestOptions
) {
  return apiFetch<TData>(endpoint, {
    ...options,
    method: "GET",
  });
}

/**
 * POST request
 */
export function apiPost<TData = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  options?: RequestOptions
) {
  return apiFetch<TData>(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request
 */
export function apiPut<TData = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  options?: RequestOptions
) {
  return apiFetch<TData>(endpoint, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PATCH request
 */
export function apiPatch<TData = unknown, TBody = unknown>(
  endpoint: string,
  body?: TBody,
  options?: RequestOptions
) {
  return apiFetch<TData>(endpoint, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export function apiDelete<TData = unknown>(
  endpoint: string,
  options?: RequestOptions
) {
  return apiFetch<TData>(endpoint, {
    ...options,
    method: "DELETE",
  });
}
