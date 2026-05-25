import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: (user: AuthUser) =>
        set({
          user,
          isAuthenticated: true,
          error: null,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),
      setUser: (user: AuthUser | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...userData }
            : null,
        })),
    }),
    {
      name: "femoj_auth",
      version: 1,
    }
  )
);
