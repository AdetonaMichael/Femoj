"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { getAccessToken } from "@/lib/token";

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
    }
  }, []);

  return null;
}
