"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Settings as SettingsIcon, LogOut, Menu, X, Bell, Settings, Globe, ToggleLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAVIGATION } from "@/constants";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";

const ADMIN_ICONS: Record<string, React.ComponentType<any>> = {
  Activity: () => null,
  Users: () => null,
  Smartphone: () => null,
  CreditCard: () => null,
  BarChart3: () => null,
  Settings,
};

export default function AdminSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };

  const handleSave = (setting: string) => {
    toast.success(`${setting} saved successfully`);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        className="hidden md:flex flex-col w-64 border-r border-border bg-card-background"
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 border-b border-border flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-bold text-lg">Femoj Admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {ADMIN_NAVIGATION.map((item) => {
            const isActive = pathname === item.href;
            const Icon = ADMIN_ICONS[item.icon] || Settings;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={handleLogout}
            className="justify-start gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-background h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-lg relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            <motion.div
              className="space-y-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {/* Header */}
              <motion.div variants={staggerItem}>
                <h1 className="text-4xl font-bold mb-2">Admin Settings</h1>
                <p className="text-muted-foreground">
                  Configure platform settings and preferences
                </p>
              </motion.div>

              {/* General Settings */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Basic platform configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Femoj"
                          className="input-base w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Support Email
                        </label>
                        <input
                          type="email"
                          defaultValue="support@femoj.com"
                          className="input-base w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Support Phone
                        </label>
                        <input
                          type="tel"
                          defaultValue="+1-800-FEMOJ"
                          className="input-base w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Main Website
                        </label>
                        <input
                          type="url"
                          defaultValue="https://femoj.com"
                          className="input-base w-full"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSave("General settings")}
                    >
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Feature Flags */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Flags</CardTitle>
                    <CardDescription>
                      Enable or disable platform features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        name: "SMS Messaging",
                        description: "Allow users to send and receive SMS",
                        enabled: true,
                      },
                      {
                        name: "Voice Calls",
                        description: "Allow voice calling functionality",
                        enabled: false,
                      },
                      {
                        name: "International Numbers",
                        description: "Allow purchasing numbers globally",
                        enabled: true,
                      },
                      {
                        name: "API Access",
                        description: "Allow API integration access",
                        enabled: true,
                      },
                      {
                        name: "Referral Program",
                        description: "Enable user referral rewards",
                        enabled: true,
                      },
                    ].map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div>
                          <p className="font-medium text-sm">{feature.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                        <button className="p-2 hover:bg-muted rounded-lg">
                          <ToggleLeft
                            className={`w-5 h-5 ${
                              feature.enabled
                                ? "text-green-600"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Rate Limiting */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle>Rate Limiting</CardTitle>
                    <CardDescription>
                      Configure API and platform rate limits
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          SMS Rate Limit (per hour)
                        </label>
                        <input
                          type="number"
                          defaultValue="1000"
                          className="input-base w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          API Rate Limit (req/min)
                        </label>
                        <input
                          type="number"
                          defaultValue="60"
                          className="input-base w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Account Creation Limit (per day)
                        </label>
                        <input
                          type="number"
                          defaultValue="500"
                          className="input-base w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Password Reset Limit (per hour)
                        </label>
                        <input
                          type="number"
                          defaultValue="5"
                          className="input-base w-full"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSave("Rate limits")}
                    >
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security Settings */}
              <motion.div variants={staggerItem}>
                <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-yellow-600" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Critical security configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background">
                      <div>
                        <p className="font-medium text-sm">Two-Factor Authentication Required</p>
                        <p className="text-xs text-muted-foreground">
                          Require 2FA for all admin accounts
                        </p>
                      </div>
                      <button className="p-2 hover:bg-muted rounded-lg">
                        <ToggleLeft className="w-5 h-5 text-green-600" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background">
                      <div>
                        <p className="font-medium text-sm">IP Whitelist</p>
                        <p className="text-xs text-muted-foreground">
                          Restrict admin access to specific IPs
                        </p>
                      </div>
                      <button className="p-2 hover:bg-muted rounded-lg">
                        <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-background">
                      <div>
                        <p className="font-medium text-sm">Suspicious Activity Alerts</p>
                        <p className="text-xs text-muted-foreground">
                          Alert on suspicious platform activity
                        </p>
                      </div>
                      <button className="p-2 hover:bg-muted rounded-lg">
                        <ToggleLeft className="w-5 h-5 text-green-600" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
