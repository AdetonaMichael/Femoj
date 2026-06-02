"use client";

import React from "react";
import { format } from "date-fns";
import { Trash2, CheckCircle, Circle } from "lucide-react";
import type { Notification } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: number) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

const notificationTypeIcons: Record<string, string> = {
  transaction: "💳",
  system: "⚙️",
  promotion: "🎉",
  update: "🔄",
  alert: "⚠️",
};

const notificationTypeColors: Record<string, string> = {
  transaction: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950",
  system: "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950",
  promotion: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950",
  update: "border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950",
  alert: "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
};

const priorityBadgeColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  normal: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
  high: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  className,
}) => {
  const isRead = !!notification.read_at;
  const icon = notificationTypeIcons[notification.type] || "📢";
  const bgColor = notificationTypeColors[notification.type];
  const priorityColor = priorityBadgeColors[notification.priority];

  return (
    <div
      className={cn(
        "relative border rounded-lg p-4 transition-all duration-200",
        !isRead && "border-blue-400 shadow-sm",
        isRead && "opacity-75 hover:opacity-100",
        bgColor,
        className
      )}
    >
      {/* Unread indicator */}
      {!isRead && (
        <div className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-blue-500" />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 text-2xl">{icon}</div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm md:text-base text-foreground truncate">
              {notification.title}
            </h3>
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", priorityColor)}>
              {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {notification.body}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {format(new Date(notification.created_at), "MMM dd, yyyy p")}
            </span>

            {/* Type badge */}
            <span className="text-xs font-medium text-muted-foreground capitalize">
              {notification.type}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {!isRead && onMarkAsRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              title="Mark as read"
              className="h-8 w-8 p-0"
            >
              <Circle className="h-4 w-4" />
            </Button>
          )}

          {isRead && (
            <div title="Read" className="h-8 w-8 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(notification.id)}
              title="Delete notification"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Additional data display */}
      {notification.data && Object.keys(notification.data).length > 0 && (
        <div className="mt-3 pt-3 border-t border-current/10">
          <details className="cursor-pointer">
            <summary className="text-xs text-muted-foreground font-medium hover:text-foreground">
              Details
            </summary>
            <pre className="mt-2 text-xs bg-white/50 dark:bg-black/20 rounded p-2 overflow-auto max-h-32">
              {JSON.stringify(notification.data, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};
