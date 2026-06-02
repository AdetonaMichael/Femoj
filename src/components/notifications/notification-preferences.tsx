"use client";

import React, { useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { NotificationPreferences as INotificationPreferences } from "@/types";

interface NotificationPreferencesProps {
  onSave?: () => void;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  onSave,
}) => {
  const { preferences, isLoading, error, successMessage, updatePreferences, clearError, clearSuccess } =
    useNotifications({
      autoFetch: true,
    });

  // Default preferences fallback
  const defaultPrefs: INotificationPreferences = {
    enabled: true,
    transaction_notifications: true,
    system_notifications: true,
    promotion_notifications: true,
    update_notifications: true,
    alert_notifications: true,
    email_notifications: true,
    push_notifications: true,
  };

  const [localPrefs, setLocalPrefs] = React.useState<INotificationPreferences>(
    preferences || defaultPrefs
  );

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(clearSuccess, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccess]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleToggle = (key: keyof INotificationPreferences) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    const changes: Partial<INotificationPreferences> = {};
    const keys = Object.keys(localPrefs) as (keyof INotificationPreferences)[];

    keys.forEach((key) => {
      if (preferences && localPrefs[key] !== preferences[key]) {
        changes[key] = localPrefs[key];
      }
    });

    if (Object.keys(changes).length === 0) {
      return;
    }

    await updatePreferences(changes);
    onSave?.();
  };

  const hasChanges = preferences && 
    Object.keys(localPrefs).some(key => 
      localPrefs[key as keyof INotificationPreferences] !== preferences[key as keyof INotificationPreferences]
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how you receive notifications across the platform
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Master toggle */}
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">All Notifications</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Turn off to disable all notifications
              </p>
            </div>
            <Switch
              checked={localPrefs.enabled}
              onCheckedChange={() => handleToggle("enabled")}
            />
          </div>
        </div>

        {/* Notification type preferences */}
        {!localPrefs.enabled && (
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                All notifications are currently disabled. Enable notifications to customize preferences below.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-semibold">Notification Types</h3>

          <div className="space-y-3">
            {[
              {
                key: "transaction_notifications",
                label: "Transaction Notifications",
                description: "Payment and wallet related notifications",
              },
              {
                key: "system_notifications",
                label: "System Notifications",
                description: "General system and account notifications",
              },
              {
                key: "promotion_notifications",
                label: "Promotional Notifications",
                description: "Marketing and special offers",
              },
              {
                key: "update_notifications",
                label: "Update Notifications",
                description: "App and feature updates",
              },
              {
                key: "alert_notifications",
                label: "Alert Notifications",
                description: "Important alerts and warnings",
              },
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="font-medium">{label}</Label>
                  <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                </div>
                <Switch
                  checked={
                    localPrefs[key as keyof INotificationPreferences] === true
                  }
                  onCheckedChange={() =>
                    handleToggle(key as keyof INotificationPreferences)
                  }
                  disabled={!localPrefs.enabled}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Delivery method preferences */}
        <div className="space-y-4">
          <h3 className="font-semibold">Delivery Methods</h3>

          <div className="space-y-3">
            {[
              {
                key: "email_notifications",
                label: "Email Notifications",
                description: "Receive notifications via email",
              },
              {
                key: "push_notifications",
                label: "Push Notifications",
                description: "Receive push notifications on your device",
              },
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="font-medium">{label}</Label>
                  <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
                </div>
                <Switch
                  checked={
                    localPrefs[key as keyof INotificationPreferences] === true
                  }
                  onCheckedChange={() =>
                    handleToggle(key as keyof INotificationPreferences)
                  }
                  disabled={!localPrefs.enabled}
                />
              </div>
            ))}
          </div>
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

        {/* Save button */}
        <div className="pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
