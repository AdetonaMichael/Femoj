"use client";

import React, { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationItem } from "./notification-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Trash2, CheckCircle, Loader2 } from "lucide-react";
import type { NotificationFilterParams, NotificationType } from "@/types";

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    stats,
    isLoading,
    error,
    successMessage,
    currentPage,
    totalPages,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteMultiple,
    clearError,
    clearSuccess,
  } = useNotifications({
    autoFetch: true,
  });

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<NotificationFilterParams>({});

  // Clear messages after display
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(clearSuccess, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccess]);

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleFilterChange = async (newFilters: NotificationFilterParams) => {
    setFilters(newFilters);
    setSelectedIds(new Set());
    await fetchNotifications(1, newFilters);
  };

  const handleTypeChange = (value: string) => {
    const newFilters = { ...filters };
    if (value && value !== "all") {
      newFilters.type = value as NotificationType;
    } else {
      delete newFilters.type;
    }
    handleFilterChange(newFilters);
  };

  const handlePriorityChange = (value: string) => {
    const newFilters = { ...filters };
    if (value && value !== "all") {
      newFilters.priority = value as any;
    } else {
      delete newFilters.priority;
    }
    handleFilterChange(newFilters);
  };

  const handleUnreadToggle = (checked: boolean | "indeterminate") => {
    const newFilters = { ...filters };
    if (checked === true) {
      newFilters.unread_only = true;
    } else {
      delete newFilters.unread_only;
    }
    handleFilterChange(newFilters);
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedIds(new Set(notifications.map((n) => n.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: number, checked: boolean | "indeterminate" = true) => {
    const newSelected = new Set(selectedIds);
    if (checked === true) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    if (confirm(`Delete ${ids.length} notification(s)?`)) {
      await deleteMultiple(ids);
      setSelectedIds(new Set());
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notification Center</CardTitle>
        <CardDescription>
          {stats?.total || 0} total notification{stats?.total !== 1 ? "s" : ""} (
          {stats?.unread || 0} unread)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={filters.type || "all"}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="transaction">Transaction</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={filters.priority || "all"}
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.unread_only || false}
                  onCheckedChange={handleUnreadToggle}
                />
                <span className="text-sm font-medium">Unread only</span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          {(stats?.unread || 0) > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={isLoading}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark All as Read
              </Button>
            </div>
          )}
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 flex gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Notifications list */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {Object.keys(filters).length > 0
                ? "No notifications matching your filters"
                : "No notifications yet"}
            </p>
          </div>
        )}

        {!isLoading && notifications.length > 0 && (
          <div className="space-y-4">
            {/* Bulk actions */}
            {selectedIds.size > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedIds.size} notification{selectedIds.size !== 1 ? "s" : ""} selected
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            )}

            {/* Notifications */}
            <div className="space-y-3">
              {/* Select all checkbox */}
              {notifications.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 border-b">
                  <Checkbox
                    checked={selectedIds.size === notifications.length}
                    indeterminate={
                      selectedIds.size > 0 && selectedIds.size < notifications.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-xs text-muted-foreground">
                    {selectedIds.size === notifications.length
                      ? "Deselect all"
                      : "Select all"}
                  </span>
                </div>
              )}

              {/* Items */}
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedIds.has(notification.id)}
                    onCheckedChange={(checked) => handleSelectOne(notification.id, checked)}
                    className="mt-4"
                  />
                  <div className="flex-grow">
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                fetchNotifications(Math.max(1, currentPage - 1), filters)
              }
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => fetchNotifications(page, filters)}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                fetchNotifications(Math.min(totalPages, currentPage + 1), filters)
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
