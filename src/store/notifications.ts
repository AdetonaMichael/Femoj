/**
 * Notifications Store
 * Manages global notification state with Zustand
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Notification,
  NotificationStats,
  NotificationPreferences,
  NotificationFilterParams,
} from "@/types";

interface NotificationState {
  // Data
  notifications: Notification[];
  stats: NotificationStats | null;
  preferences: NotificationPreferences | null;

  // UI States
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  perPage: number;

  // Filter state
  currentFilters: NotificationFilterParams;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: number) => void;
  updateNotification: (id: number, notification: Partial<Notification>) => void;
  setStats: (stats: NotificationStats | null) => void;
  setPreferences: (preferences: NotificationPreferences | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  setCurrentPage: (page: number) => void;
  setPagination: (page: number, totalPages: number) => void;
  setFilters: (filters: NotificationFilterParams) => void;
  clearNotifications: () => void;
  clearAll: () => void;
}

const initialState = {
  notifications: [],
  stats: null,
  preferences: {
    enabled: true,
    transaction_notifications: true,
    system_notifications: true,
    promotion_notifications: true,
    update_notifications: true,
    alert_notifications: true,
    email_notifications: true,
    push_notifications: true,
  },
  isLoading: false,
  error: null,
  successMessage: null,
  currentPage: 1,
  totalPages: 1,
  perPage: 20,
  currentFilters: {},
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setNotifications: (notifications: Notification[]) => {
        set({ notifications });
      },

      addNotification: (notification: Notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
      },

      removeNotification: (id: number) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      updateNotification: (id: number, updates: Partial<Notification>) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          ),
        }));
      },

      setStats: (stats: NotificationStats | null) => {
        set({ stats });
      },

      setPreferences: (preferences: NotificationPreferences | null) => {
        set({ preferences });
      },

      setIsLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setSuccessMessage: (successMessage: string | null) => {
        set({ successMessage });
      },

      setCurrentPage: (currentPage: number) => {
        set({ currentPage });
      },

      setPagination: (page: number, totalPages: number) => {
        set({ currentPage: page, totalPages });
      },

      setFilters: (filters: NotificationFilterParams) => {
        set({
          currentFilters: filters,
          currentPage: 1, // Reset to first page when filters change
        });
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      clearAll: () => {
        set(initialState);
      },
    }),
    {
      name: "notification-store",
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
);
