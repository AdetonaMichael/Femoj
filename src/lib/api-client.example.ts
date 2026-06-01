/**
 * API Client Configuration & Usage Guide
 * 
 * This file demonstrates how to use the API client for making
 * authenticated requests to the Femoj backend API.
 */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from "@/lib/api-client";
import { getAccessToken, getAuthorizationHeader } from "@/lib/token";
import type { ApiResponse } from "@/types";

/**
 * Basic Usage Examples
 */

// ============================================
// GET Request (Public)
// ============================================
async function exampleGetPublic() {
  const response = await apiGet("/auth/verify", {
    requiresAuth: true,
  });

  if (response.success) {
    console.log("Token is valid:", response.data);
  } else {
    console.error("Errors:", response.errors);
  }
}

// ============================================
// POST Request with Body
// ============================================
async function examplePostWithBody() {
  const response = await apiPost(
    "/auth/login",
    {
      email: "user@example.com",
      password: "SecurePass123!",
    }
  );

  if (response.success && response.data) {
    console.log("Login successful:", response.data);
    // Token is automatically stored by the service
  }
}

// ============================================
// Protected Route (Authenticated)
// ============================================
async function exampleProtectedRoute() {
  const response = await apiGet("/auth/user", {
    requiresAuth: true, // Automatically adds Authorization header
  });

  if (response.success) {
    console.log("User data:", response.data);
  }
}

// ============================================
// Custom Headers
// ============================================
async function exampleCustomHeaders() {
  const response = await apiPost(
    "/auth/login",
    { email: "user@example.com", password: "pass" },
    {
      headers: {
        "X-Custom-Header": "custom-value",
        "User-Agent": "Femoj Mobile/1.0",
      },
    }
  );
}

/**
 * Advanced Usage
 */

// ============================================
// Error Handling Pattern
// ============================================
async function errorHandlingExample() {
  const response = await apiPost(
    "/auth/register",
    {
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone_number: "+234801234567",
      password: "SecurePass123!",
      password_confirmation: "SecurePass123!",
    }
  );

  if (!response.success) {
    // Handle errors
    if (response.errors) {
      for (const [field, messages] of Object.entries(response.errors)) {
        console.error(`${field}:`, messages.join(", "));
      }
    } else {
      console.error(response.message);
    }
  }
}

// ============================================
// Conditional Authentication
// ============================================
async function conditionalAuthExample() {
  const token = getAccessToken();

  const response = await apiPost(
    "/some-endpoint",
    { data: "value" },
    {
      requiresAuth: !!token, // Only add auth if token exists
    }
  );
}

// ============================================
// Manual Authorization Header
// ============================================
async function manualAuthExample() {
  const authHeader = getAuthorizationHeader();

  const response = await apiPost(
    "/auth/logout",
    {},
    {
      headers: authHeader || {}, // Can also pass manually if needed
      requiresAuth: true,
    }
  );
}

/**
 * Service Layer Pattern
 * 
 * This is how the auth service (src/services/api.ts) is structured
 */

// Example service implementation
export const exampleService = {
  /**
   * Public endpoint example
   */
  async publicMethod(payload: { example: string }) {
    return apiPost("/public/endpoint", payload);
  },

  /**
   * Protected endpoint example
   */
  async protectedMethod(id: string) {
    return apiGet(`/protected/resource/${id}`, {
      requiresAuth: true,
    });
  },

  /**
   * Endpoint that handles token automatically
   */
  async tokenHandlingMethod() {
    const response = await apiPost(
      "/auth/logout",
      {},
      { requiresAuth: true }
    );

    // Service can handle token management here
    if (response.success) {
      // Clear token after logout
      localStorage.removeItem("femoj_access_token");
    }

    return response;
  },
};

/**
 * Hook Pattern for Components
 * 
 * This is how auth hooks (src/hooks/useAuth.ts) use the API client
 */

import { useCallback, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { authService } from "@/services/api";

export function useExampleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setError } = useAuthStore();

  const authenticate = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authService.login({ email, password });

        if (response.success && response.data) {
          setUser(response.data.user);
          return { success: true };
        } else {
          const errorMessage = response.message || "Authentication failed";
          setError(errorMessage);
          return { success: false, errors: response.errors };
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        setError(message);
        return { success: false, error: message };
      } finally {
        setIsLoading(false);
      }
    },
    [setUser, setError]
  );

  return { authenticate, isLoading };
}

/**
 * Component Usage Pattern
 */

import { useRegister } from "@/hooks/useAuth";
import { registerStep1Schema } from "@/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function ExampleComponent() {
  const { register: performRegister } = useRegister();
  const form = useForm({
    resolver: zodResolver(registerStep1Schema),
  });

  const onSubmit = async (data: any) => {
    // Hook handles all the API logic
    const result = await performRegister(data);

    if (result.success) {
      console.log("Registration successful");
    } else {
      console.error("Registration failed:", result.errors);
    }
  };

  // JSX example (for documentation purposes)
  // Usage: <form onSubmit={form.handleSubmit(onSubmit)}>
  //          {/* Form fields */}
  //        </form>
}

/**
 * TypeScript Type Safety
 */

// Strongly typed API calls
async function typeSafeExample() {
  // Request and response types are inferred
  const response = await apiPost<{ user: { id: number; name: string } }>(
    "/users",
    {
      name: "John",
      email: "john@example.com",
    }
  );

  if (response.success && response.data) {
    // TypeScript knows response.data has user with id and name
    console.log(response.data.user.id);
  }
}

/**
 * API Response Structure
 * 
 * All API endpoints follow this response structure:
 */

interface StandardResponse<T> {
  success: boolean; // true | false
  message: string; // Human readable message
  data?: T; // Response data (only if success: true)
  errors?: Record<string, string[]>; // Field errors (only if success: false)
}

/**
 * Common Response Examples
 */

// Success response structure
const successExample = {
  success: true,
  message: "User registered successfully",
  data: {
    user: {
      id: 1,
      email: "user@example.com",
      first_name: "John",
      last_name: "Doe",
      phone_number: "+234801234567",
    },
    access_token: "eyJhbGciOiJIUzI1NiIs...",
    token_type: "Bearer",
  },
};

// Error response structure
const errorExample = {
  success: false,
  message: "Validation failed",
  errors: {
    email: ["The email has already been taken."],
    phone_number: ["Invalid Nigerian phone number format."],
    password: [
      "Password must contain uppercase, lowercase, numbers, and symbols.",
    ],
  },
};

/**
 * Debugging Tips
 */

// 1. Enable verbose logging in .env.local:
//    NEXT_PUBLIC_VERBOSE_API_LOGGING=true

// 2. Check stored token:
//    localStorage.getItem('femoj_access_token')

// 3. Check auth store state:
//    useAuthStore.getState()

// 4. Monitor API calls:
//    Open DevTools > Network tab > filter by Fetch/XHR

// 5. Test API endpoints directly:
//    Use curl or Postman with Authorization: Bearer <token> header

export {};
