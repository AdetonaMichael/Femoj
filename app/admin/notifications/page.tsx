import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdminNotificationSender } from "@/components/notifications";
import { Send, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Notifications | Admin Dashboard",
  description: "Send and manage user notifications",
};

export default function AdminNotificationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Send className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Send Notifications</h1>
          </div>
          <p className="text-muted-foreground">
            Send notifications to users directly from the admin panel
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main sender form */}
          <div className="lg:col-span-2">
            <AdminNotificationSender />
          </div>

          {/* Info card */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Notification Types
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>
                    <strong>Transaction:</strong> Payment and wallet updates
                  </li>
                  <li>
                    <strong>System:</strong> System-wide announcements
                  </li>
                  <li>
                    <strong>Promotion:</strong> Marketing and special offers
                  </li>
                  <li>
                    <strong>Update:</strong> App and feature updates
                  </li>
                  <li>
                    <strong>Alert:</strong> Important alerts and warnings
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Usage guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
              ✓ Best Practices
            </h3>
            <ul className="text-sm text-green-800 dark:text-green-200 space-y-2">
              <li>• Keep titles concise and descriptive</li>
              <li>• Use clear, action-oriented language</li>
              <li>• Set appropriate priority levels</li>
              <li>• Test with individual users first</li>
              <li>• Verify user IDs before sending</li>
            </ul>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">
              ⚠️ Important Notes
            </h3>
            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
              <li>• User must exist and be active</li>
              <li>• Notifications respect user preferences</li>
              <li>• High priority notifications display prominently</li>
              <li>• Messages are stored permanently</li>
              <li>• Review before sending in bulk</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
