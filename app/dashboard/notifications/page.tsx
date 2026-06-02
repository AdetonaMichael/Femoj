import React from "react";
import { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NotificationCenter, NotificationPreferences } from "@/components/notifications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Notifications | Dashboard",
  description: "Manage your notifications and notification preferences",
};

export default function NotificationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your notifications and customize your notification preferences
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <NotificationPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
