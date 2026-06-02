/**
 * useNotifications Hook
 * Custom hook for managing notifications with state management
 */

import { useCallback, useEffect } from "react";
import { notificationService, adminNotificationService } from "@/services/notifications";
import { useNotificationStore } from "@/store/notifications";
import type {
  Notification,
  NotificationFilterParams,
  NotificationPreferences,
} from "@/types";

interface UseNotificationsOptions {
  autoFetch?: boolean;
  fetchInterval?: number; // in milliseconds
  adminMode?: boolean;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const {
    autoFetch = true,
    fetchInterval = 30000, // 30 seconds
    adminMode = false,
  } = options;

  const {
    notifications,
    stats,
    preferences,
    isLoading,
    error,
    successMessage,
    currentPage,
    totalPages,
    currentFilters,
    setNotifications,
    addNotification,
    removeNotification,
    updateNotification,
    setStats,
    setPreferences,
    setIsLoading,
    setError,
    setSuccessMessage,
    setPagination,
    setFilters,
    clearNotifications,
  } = useNotificationStore();

  /**
   * Fetch notifications list
   */
  const fetchNotifications = useCallback(
    async (page = 1, filters?: NotificationFilterParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await notificationService.getNotifications({
          page,
          per_page: 20,
          ...filters,
        });

        if (response.success && response.data) {
          setNotifications(response.data.data || []);
          if (response.data.pagination) {
            setPagination(response.data.pagination.current_page, response.data.pagination.last_page);
          } else {
            setPagination(1, 1);
          }
          setFilters(filters || {});
        } else {
          setError(response.message || "Failed to fetch notifications");
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        console.error("Error fetching notifications:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [setNotifications, setPagination, setFilters, setIsLoading, setError]
  );

  /**
   * Fetch notification statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      const response = await notificationService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching notification stats:", err);
    }
  }, [setStats]);

  /**
   * Fetch notification preferences
   */
  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getPreferences();
      if (response.success && response.data) {
        setPreferences(response.data);
        setError(null);
      } else {
        setError(response.message || "Failed to load preferences");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error loading preferences";
      setError(errorMsg);
      console.error("Error fetching notification preferences:", err);
    } finally {
      setIsLoading(false);
    }
  }, [setPreferences, setIsLoading, setError]);

  /**
   * Mark single notification as read
   */
  const markAsRead = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await notificationService.markAsRead(id);

        if (response.success && response.data) {
          updateNotification(id, {
            read_at: new Date().toISOString(),
          });
          setSuccessMessage("Notification marked as read");
          // Refetch stats
          await fetchStats();
        } else {
          setError(response.message || "Failed to mark as read");
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        console.error("Error marking notification as read:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [updateNotification, setIsLoading, setError, setSuccessMessage, fetchStats]
  );

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationService.markAllAsRead();

      if (response.success) {
        const now = new Date().toISOString();
        notifications.forEach((notif) => {
          if (!notif.read_at) {
            updateNotification(notif.id, { read_at: now });
          }
        });
        setSuccessMessage("All notifications marked as read");
        // Refetch stats
        await fetchStats();
      } else {
        setError(response.message || "Failed to mark all as read");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      console.error("Error marking all as read:", err);
    } finally {
      setIsLoading(false);
    }
  }, [notifications, updateNotification, setIsLoading, setError, setSuccessMessage, fetchStats]);

  /**
   * Delete single notification
   */
  const deleteNotification = useCallback(
    async (id: number) => {
      setError(null);

      try {
        const response = await notificationService.deleteNotification(id);

        if (response.success) {
          removeNotification(id);
          setSuccessMessage("Notification deleted");
          // Refetch stats
          await fetchStats();
        } else {
          setError(response.message || "Failed to delete notification");
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        console.error("Error deleting notification:", err);
      }
    },
    [removeNotification, setError, setSuccessMessage, fetchStats]
  );

  /**
   * Delete multiple notifications
   */
  const deleteMultiple = useCallback(
    async (ids: number[]) => {
      setError(null);

      try {
        const response = await notificationService.deleteMultiple(ids);

        if (response.success) {
          ids.forEach((id) => removeNotification(id));
          setSuccessMessage(`${ids.length} notifications deleted`);
          // Refetch stats
          await fetchStats();
        } else {
          setError(response.message || "Failed to delete notifications");
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        console.error("Error deleting notifications:", err);
      }
    },
    [removeNotification, setError, setSuccessMessage, fetchStats]
  );

  /**
   * Delete all notifications
   */
  const deleteAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationService.deleteAll();

      if (response.success) {
        clearNotifications();
        setSuccessMessage("All notifications deleted");
        // Refetch stats
        await fetchStats();
      } else {
        setError(response.message || "Failed to delete all notifications");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An error occurred";
      setError(errorMsg);
      console.error("Error deleting all notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [clearNotifications, setIsLoading, setError, setSuccessMessage, fetchStats]);

  /**
   * Update notification preferences
   */
  const updatePreferences = useCallback(
    async (prefs: Partial<NotificationPreferences>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await notificationService.updatePreferences(prefs);

        if (response.success && response.data) {
          setPreferences(response.data);
          setSuccessMessage("Preferences updated successfully");
        } else {
          setError(response.message || "Failed to update preferences");
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        console.error("Error updating preferences:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [setPreferences, setIsLoading, setError, setSuccessMessage]
  );

  /**
   * Send notification to user (admin only)
   */
  const sendToUser = useCallback(
    async (userId: number, title: string, body: string, type: string, priority = "normal") => {
      setError(null);

      try {
        const response = await adminNotificationService.sendToUser({
          user_id: userId,
          title,
          body,
          type: type as any,
          priority: priority as any,
        });

        if (response.success) {
          setSuccessMessage("Notification sent successfully");
          return response.data;
        } else {
          setError(response.message || "Failed to send notification");
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        console.error("Error sending notification:", err);
        return null;
      }
    },
    [setError, setSuccessMessage]
  );

  /**
   * Send notification to multiple users (admin only)
   */
  const sendToUsers = useCallback(
    async (
      userIds: number[],
      title: string,
      body: string,
      type: string,
      priority = "normal"
    ) => {
      setError(null);

      try {
        const response = await adminNotificationService.sendToUsers({
          user_ids: userIds,
          title,
          body,
          type: type as any,
          priority: priority as any,
        });

        if (response.success) {
          setSuccessMessage(
            `Notification sent to ${response.data?.sent_count || userIds.length} users`
          );
          return response.data;
        } else {
          setError(response.message || "Failed to send notifications");
          return null;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "An error occurred";
        setError(errorMsg);
        console.error("Error sending notifications:", err);
        return null;
      }
    },
    [setError, setSuccessMessage]
  );

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  /**
   * Clear success message
   */
  const clearSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, [setSuccessMessage]);

  /**
   * Auto-fetch notifications on mount and set up polling
   */
  useEffect(() => {
    if (!autoFetch) return;

    // Initial fetch
    fetchNotifications(1);
    fetchStats();
    fetchPreferences();

    // Set up polling interval
    const interval = setInterval(() => {
      fetchStats();
    }, fetchInterval);

    return () => clearInterval(interval);
  }, [autoFetch, fetchInterval, fetchNotifications, fetchStats, fetchPreferences]);

  return {
    // State
    notifications,
    stats,
    preferences,
    isLoading,
    error,
    successMessage,
    currentPage,
    totalPages,
    currentFilters,
    unreadCount: stats?.unread || 0,

    // Actions
    fetchNotifications,
    fetchStats,
    fetchPreferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteMultiple,
    deleteAll,
    updatePreferences,
    sendToUser,
    sendToUsers,
    clearError,
    clearSuccess,
  };
};
