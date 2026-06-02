/**
 * Notifications Service
 * Handles all notification API communication
 */

import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api-client";
import type {
  ApiResponse,
  Notification,
  NotificationStats,
  NotificationPreferences,
  NotificationsListResponse,
  NotificationFilterParams,
  SendNotificationRequest,
  SendMultipleNotificationsRequest,
  DeleteMultipleNotificationsRequest,
  PushTokenRequest,
  NotificationBellResponse,
} from "@/types";

const NOTIFICATIONS_ENDPOINT = "/notifications";
const ADMIN_NOTIFICATIONS_ENDPOINT = "/admin/notifications";

/**
 * Notifications Service - User Endpoints
 */
export const notificationService = {
  /**
   * List notifications with pagination and filters
   * GET /api/v1/notifications
   */
  async getNotifications(
    filters?: NotificationFilterParams
  ): Promise<ApiResponse<NotificationsListResponse>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.per_page) params.append("per_page", filters.per_page.toString());
    if (filters?.type) params.append("type", filters.type);
    if (filters?.unread_only) params.append("unread_only", "1");
    if (filters?.priority) params.append("priority", filters.priority);

    const queryString = params.toString();
    const endpoint = queryString ? `${NOTIFICATIONS_ENDPOINT}?${queryString}` : NOTIFICATIONS_ENDPOINT;

    return apiGet<NotificationsListResponse>(endpoint, { requiresAuth: true });
  },

  /**
   * Get a single notification by ID
   * GET /api/v1/notifications/{id}
   */
  async getNotification(id: number): Promise<ApiResponse<Notification>> {
    return apiGet<Notification>(`${NOTIFICATIONS_ENDPOINT}/${id}`, {
      requiresAuth: true,
    });
  },

  /**
   * Mark a notification as read
   * PUT /api/v1/notifications/{id}/read
   */
  async markAsRead(id: number): Promise<ApiResponse<Notification>> {
    return apiPut<Notification>(`${NOTIFICATIONS_ENDPOINT}/${id}/read`, {}, {
      requiresAuth: true,
    });
  },

  /**
   * Mark all notifications as read
   * PUT /api/v1/notifications/mark-all-read
   */
  async markAllAsRead(): Promise<ApiResponse<{ affected: number }>> {
    return apiPut<{ affected: number }>(`${NOTIFICATIONS_ENDPOINT}/mark-all-read`, {}, {
      requiresAuth: true,
    });
  },

  /**
   * Delete a single notification
   * DELETE /api/v1/notifications/{id}
   */
  async deleteNotification(id: number): Promise<ApiResponse<null>> {
    return apiDelete<null>(`${NOTIFICATIONS_ENDPOINT}/${id}`, {
      requiresAuth: true,
    });
  },

  /**
   * Delete multiple notifications
   * POST /api/v1/notifications/delete-multiple
   */
  async deleteMultiple(
    ids: number[]
  ): Promise<ApiResponse<{ affected: number }>> {
    const payload: DeleteMultipleNotificationsRequest = { ids };
    return apiPost<{ affected: number }, DeleteMultipleNotificationsRequest>(
      `${NOTIFICATIONS_ENDPOINT}/delete-multiple`,
      payload,
      { requiresAuth: true }
    );
  },

  /**
   * Delete all notifications
   * DELETE /api/v1/notifications/delete-all
   */
  async deleteAll(): Promise<ApiResponse<{ affected: number }>> {
    return apiDelete<{ affected: number }>(`${NOTIFICATIONS_ENDPOINT}/delete-all`, {
      requiresAuth: true,
    });
  },

  /**
   * Get notification statistics
   * GET /api/v1/notifications/stats
   */
  async getStats(): Promise<ApiResponse<NotificationStats>> {
    return apiGet<NotificationStats>(`${NOTIFICATIONS_ENDPOINT}/stats`, {
      requiresAuth: true,
    });
  },

  /**
   * Get notification preferences
   * GET /api/v1/notifications/preferences
   */
  async getPreferences(): Promise<ApiResponse<NotificationPreferences>> {
    return apiGet<NotificationPreferences>(`${NOTIFICATIONS_ENDPOINT}/preferences`, {
      requiresAuth: true,
    });
  },

  /**
   * Update notification preferences
   * PUT /api/v1/notifications/preferences
   */
  async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<ApiResponse<NotificationPreferences>> {
    return apiPut<NotificationPreferences, Partial<NotificationPreferences>>(
      `${NOTIFICATIONS_ENDPOINT}/preferences`,
      preferences,
      { requiresAuth: true }
    );
  },

  /**
   * Register push notification token
   * POST /api/v1/notifications/register-token
   */
  async registerToken(
    payload: PushTokenRequest
  ): Promise<ApiResponse<null>> {
    return apiPost<null, PushTokenRequest>(
      `${NOTIFICATIONS_ENDPOINT}/register-token`,
      payload,
      { requiresAuth: true }
    );
  },

  /**
   * Unregister push notification token
   * POST /api/v1/notifications/unregister-token
   */
  async unregisterToken(expoToken: string): Promise<ApiResponse<null>> {
    return apiPost<null, { expo_push_token: string }>(
      `${NOTIFICATIONS_ENDPOINT}/unregister-token`,
      { expo_push_token: expoToken },
      { requiresAuth: true }
    );
  },
};

/**
 * Admin Notifications Service - Admin Only Endpoints
 */
export const adminNotificationService = {
  /**
   * Send notification to a specific user
   * POST /api/v1/admin/notifications/send-to-user
   */
  async sendToUser(
    payload: SendNotificationRequest
  ): Promise<ApiResponse<Notification>> {
    return apiPost<Notification, SendNotificationRequest>(
      `${ADMIN_NOTIFICATIONS_ENDPOINT}/send-to-user`,
      payload,
      { requiresAuth: true }
    );
  },

  /**
   * Send notification to multiple users
   * POST /api/v1/admin/notifications/send-to-users
   */
  async sendToUsers(
    payload: SendMultipleNotificationsRequest
  ): Promise<ApiResponse<{ sent_count: number; failed_count: number; user_ids: number[] }>> {
    return apiPost<
      { sent_count: number; failed_count: number; user_ids: number[] },
      SendMultipleNotificationsRequest
    >(`${ADMIN_NOTIFICATIONS_ENDPOINT}/send-to-users`, payload, {
      requiresAuth: true,
    });
  },

  /**
   * Get all notifications (admin view)
   * GET /api/v1/admin/notifications
   */
  async getAllNotifications(
    filters?: NotificationFilterParams & { user_id?: number }
  ): Promise<ApiResponse<NotificationsListResponse>> {
    const params = new URLSearchParams();

    if (filters?.user_id) params.append("user_id", filters.user_id.toString());
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.per_page) params.append("per_page", filters.per_page.toString());
    if (filters?.type) params.append("type", filters.type);
    if (filters?.priority) params.append("priority", filters.priority);

    const queryString = params.toString();
    const endpoint = queryString
      ? `${ADMIN_NOTIFICATIONS_ENDPOINT}?${queryString}`
      : ADMIN_NOTIFICATIONS_ENDPOINT;

    return apiGet<NotificationsListResponse>(endpoint, { requiresAuth: true });
  },

  /**
   * Get notification statistics (admin view)
   * GET /api/v1/admin/notifications/stats
   */
  async getStats(userId?: number): Promise<ApiResponse<NotificationStats>> {
    const endpoint = userId
      ? `${ADMIN_NOTIFICATIONS_ENDPOINT}/stats?user_id=${userId}`
      : `${ADMIN_NOTIFICATIONS_ENDPOINT}/stats`;

    return apiGet<NotificationStats>(endpoint, { requiresAuth: true });
  },

  /**
   * Delete notification (admin view)
   * DELETE /api/v1/admin/notifications/{id}
   */
  async deleteNotification(id: number): Promise<ApiResponse<null>> {
    return apiDelete<null>(`${ADMIN_NOTIFICATIONS_ENDPOINT}/${id}`, {
      requiresAuth: true,
    });
  },
};
