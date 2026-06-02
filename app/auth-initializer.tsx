"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { getAccessToken } from "@/lib/token";
import { setAuthToken as setPhoneServiceAuthToken } from "@/lib/phoneNumberService";

/**
 * Auth Initializer Component
 * Hydrates auth state from localStorage on app mount
 * This ensures login persistence across page refreshes
 */
export function AuthInitializer() {
  useEffect(() => {
    // Hydrate auth store from localStorage on mount
    const token = getAccessToken();
    if (token) {
      // If we have a token, mark as authenticated
      useAuthStore.setState({
        accessToken: token,
        isAuthenticated: true,
      });
      // Set token for phone number service API client
      setPhoneServiceAuthToken(token);
      console.log("[AuthInitializer] Token restored and passed to phoneNumberService");
    }
  }, []);

  return null;
}
