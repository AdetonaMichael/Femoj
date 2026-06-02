"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NotificationItem } from "./notification-item";
import { cn } from "@/utils";

interface NotificationBellProps {
  className?: string;
  maxDisplayed?: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className,
  maxDisplayed = 3,
}) => {
  const {
    notifications,
    stats,
    isLoading,
    markAsRead,
    deleteNotification,
    fetchNotifications,
  } = useNotifications({
    autoFetch: true,
    fetchInterval: 30000,
  });

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = stats?.unread || 0;
  const displayedNotifications = notifications.slice(0, maxDisplayed);

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
  };

  const handleDelete = async (id: number) => {
    await deleteNotification(id);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
          title={`${unreadCount} unread notifications`}
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 max-h-96 overflow-y-auto">
        <div className="px-4 py-3 border-b">
          <h2 className="font-semibold text-base">Notifications</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "No unread notifications"}
          </p>
        </div>

        {isLoading && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            <p>Loading notifications...</p>
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground">
            <p>No notifications yet</p>
          </div>
        )}

        {!isLoading && displayedNotifications.length > 0 && (
          <div className="space-y-2 px-2 py-2">
            {displayedNotifications.map((notification) => (
              <div key={notification.id} className="px-2">
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                  className="p-3"
                />
              </div>
            ))}
          </div>
        )}

        {notifications.length > maxDisplayed && (
          <>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuSeparator />

        <div className="px-4 py-3 flex gap-2">
          <Link href="/dashboard/notifications" className="flex-1" onClick={() => setIsOpen(false)}>
            <Button variant="outline" className="w-full" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
