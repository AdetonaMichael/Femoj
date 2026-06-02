"use client";

import React, { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle, Loader2, Send } from "lucide-react";
import type { NotificationType } from "@/types";

export const AdminNotificationSender: React.FC = () => {
  const { isLoading, error, successMessage, sendToUser, clearError, clearSuccess } =
    useNotifications({
      autoFetch: false,
      adminMode: true,
    });

  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<NotificationType>("system");
  const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");

  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        clearSuccess();
        resetForm();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccess]);

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const resetForm = () => {
    setUserId("");
    setTitle("");
    setBody("");
    setType("system");
    setPriority("normal");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !title || !body) {
      return;
    }

    await sendToUser(parseInt(userId, 10), title, body, type, priority);
  };

  const isFormValid = userId && title && body;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Notification</CardTitle>
        <CardDescription>Send a notification to a specific user</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User ID */}
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-base font-semibold">
              User ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="userId"
              type="number"
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">The numeric ID of the user</p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Notification Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., Special Offer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={255}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/255 characters
            </p>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body" className="text-base font-semibold">
              Notification Message <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="body"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter the notification message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              {body.length} character{body.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-base font-semibold">
              Notification Type
            </Label>
            <Select value={type} onValueChange={(value) => setType(value as NotificationType)}>
              <SelectTrigger id="type" disabled={isLoading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="promotion">Promotion</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the notification category
            </p>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-base font-semibold">
              Priority Level
            </Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as "low" | "normal" | "high")}
            >
              <SelectTrigger id="priority" disabled={isLoading}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Set the urgency level of the notification
            </p>
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

          {/* Submit button */}
          <div className="pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Notification
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
