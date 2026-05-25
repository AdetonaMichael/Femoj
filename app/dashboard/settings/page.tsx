"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import {
  User,
  Lock,
  Bell,
  Shield,
  Key,
  Copy,
  Eye,
  EyeOff,
  Check,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, changePasswordSchema } from "@/schemas";
import { toast } from "sonner";
import { useState } from "react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [copied, setCopied] = useState("");

  const profileForm = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "Demo",
      lastName: "User",
      email: "demo@femoj.com",
      phone: "+1234567890",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileUpdate = async (data: any) => {
    toast.success("Profile updated successfully");
  };

  const onPasswordChange = async (data: any) => {
    toast.success("Password changed successfully");
    passwordForm.reset();
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
  ];

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={staggerItem}>
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and security
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          variants={staggerItem}
          className="grid grid-cols-2 md:grid-cols-4 gap-2"
        >
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className="justify-start gap-2"
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </Button>
          ))}
        </motion.div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(onProfileUpdate)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          First Name
                        </label>
                        <Input
                          {...profileForm.register("firstName")}
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Last Name
                        </label>
                        <Input
                          {...profileForm.register("lastName")}
                          placeholder="Last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        {...profileForm.register("email")}
                        placeholder="Email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        {...profileForm.register("phone")}
                        placeholder="Phone"
                      />
                    </div>

                    <Button type="submit" className="gap-2">
                      <Check className="w-4 h-4" />
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle>Theme Preferences</CardTitle>
                  <CardDescription>
                    Choose your preferred color scheme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "light", label: "Light", icon: Sun },
                      { value: "dark", label: "Dark", icon: Moon },
                      { value: "system", label: "System", icon: "?" },
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === option.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() =>
                          setTheme(option.value as "light" | "dark" | "system")
                        }
                        whileHover={{ y: -2 }}
                      >
                        <div className="text-2xl mb-2">
                          {typeof option.icon === "string"
                            ? option.icon
                            : <option.icon className="w-6 h-6 mx-auto" />}
                        </div>
                        <p className="text-sm font-medium">{option.label}</p>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password regularly for security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordChange)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        {...passwordForm.register("currentPassword")}
                        placeholder="Current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        New Password
                      </label>
                      <Input
                        type="password"
                        {...passwordForm.register("newPassword")}
                        placeholder="New password"
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-xs text-danger mt-1">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <Input
                        type="password"
                        {...passwordForm.register("confirmPassword")}
                        placeholder="Confirm password"
                      />
                    </div>

                    <Button type="submit" className="gap-2">
                      <Check className="w-4 h-4" />
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg mb-4">
                    <div>
                      <p className="font-medium text-sm">Status</p>
                      <p className="text-sm text-muted-foreground">
                        Two-factor authentication is currently disabled
                      </p>
                    </div>
                    <Badge variant="warning">Disabled</Badge>
                  </div>
                  <Button className="gap-2">
                    <Shield className="w-4 h-4" />
                    Enable 2FA
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Manage your active login sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        device: "Chrome on Windows",
                        ip: "192.168.1.1",
                        location: "New York, USA",
                        current: true,
                      },
                      {
                        device: "Safari on iPhone",
                        ip: "203.0.113.42",
                        location: "San Francisco, USA",
                        current: false,
                      },
                    ].map((session, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                        whileHover={{ x: 4 }}
                      >
                        <div>
                          <p className="font-medium text-sm">{session.device}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.ip} • {session.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.current && (
                            <Badge variant="success">Current</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-danger"
                          >
                            Logout
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <motion.div
            variants={staggerItem}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how you receive updates and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "SMS Alerts",
                    description: "Receive alerts via SMS",
                    enabled: true,
                  },
                  {
                    title: "Email Notifications",
                    description: "Receive updates via email",
                    enabled: true,
                  },
                  {
                    title: "Marketing Emails",
                    description: "Receive promotional content",
                    enabled: false,
                  },
                  {
                    title: "Transaction Notifications",
                    description: "Get notified of all transactions",
                    enabled: true,
                  },
                  {
                    title: "Login Alerts",
                    description: "Be notified of new login attempts",
                    enabled: true,
                  },
                ].map((notification, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                    whileHover={{ x: 4 }}
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.description}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={notification.enabled}
                      className="w-5 h-5 cursor-pointer rounded"
                    />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* API Keys Tab */}
        {activeTab === "api" && (
          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>API Keys</CardTitle>
                      <CardDescription>
                        Manage your API keys for integrations
                      </CardDescription>
                    </div>
                    <Button className="gap-2">
                      <Key className="w-4 h-4" />
                      Generate New Key
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      name: "Production Key",
                      key: "sk_live_1234567890abcdef",
                      created: "Jan 15, 2024",
                    },
                    {
                      name: "Development Key",
                      key: "sk_test_1234567890abcdef",
                      created: "Jan 15, 2024",
                    },
                  ].map((apiKey, idx) => (
                    <motion.div
                      key={idx}
                      className="p-4 rounded-lg border border-border"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-sm">{apiKey.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Created {apiKey.created}
                          </p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={apiKey.key}
                          readOnly
                          type="password"
                          className="font-mono text-xs"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyKey(apiKey.key)}
                        >
                          {copied === apiKey.key ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card>
                <CardHeader>
                  <CardTitle>Webhooks</CardTitle>
                  <CardDescription>
                    Configure webhooks for real-time events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="gap-2" fullWidth>
                    <Key className="w-4 h-4" />
                    Configure Webhooks
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
