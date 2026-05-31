import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { getAccessToken, setAccessToken, clearAllTokens } from "@/lib/token";

interface AuthState {
  // User data
  user: User | null;
  accessToken: string | null;

  // Auth states
  isAuthenticated: boolean;
  isLoading: boolean;
  isVerifyingToken: boolean;

  // UI states
  error: string | null;
  successMessage: string | null;

  // Auth flow states
  registrationEmail: string | null;
  registrationToken: string | null;
  resetPasswordEmail: string | null;
  resetToken: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setIsVerifyingToken: (verifying: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  setRegistrationEmail: (email: string | null) => void;
  setRegistrationToken: (token: string | null) => void;
  setResetPasswordEmail: (email: string | null) => void;
  setResetToken: (token: string | null) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  hydrate: () => void;
}

/**
 * Auth Store
 * Manages global authentication state with persistence
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isVerifyingToken: false,
      error: null,
      successMessage: null,
      registrationEmail: null,
      registrationToken: null,
      resetPasswordEmail: null,
      resetToken: null,

      // Actions
      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setAccessToken: (token: string | null) => {
        if (token) {
          setAccessToken(token);
        } else {
          clearAllTokens();
        }
        set({ accessToken: token });
      },

      setIsAuthenticated: (authenticated: boolean) => {
        set({ isAuthenticated: authenticated });
      },

      setIsLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setIsVerifyingToken: (verifying: boolean) => {
        set({ isVerifyingToken: verifying });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setSuccessMessage: (message: string | null) => {
        set({ successMessage: message });
      },

      setRegistrationEmail: (email: string | null) => {
        set({ registrationEmail: email });
      },

      setRegistrationToken: (token: string | null) => {
        set({ registrationToken: token });
      },

      setResetPasswordEmail: (email: string | null) => {
        set({ resetPasswordEmail: email });
      },

      setResetToken: (token: string | null) => {
        set({ resetToken: token });
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },

      logout: () => {
        clearAllTokens();
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
          registrationEmail: null,
          registrationToken: null,
          resetPasswordEmail: null,
          resetToken: null,
        });
      },

      /**
       * Hydrate state from localStorage
       * Call this on app initialization to restore persisted state
       */
      hydrate: () => {
        const storedToken = getAccessToken();
        set({
          accessToken: storedToken,
          isAuthenticated: !!storedToken,
        });
      },
    }),
    {
      name: "femoj_auth_store",
      version: 1,
      // Persist only these keys
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        registrationEmail: state.registrationEmail,
        resetPasswordEmail: state.resetPasswordEmail,
      }),
    }
  )
);
