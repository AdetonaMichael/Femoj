"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Container } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import {
  Users,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAVIGATION } from "@/constants";

const ADMIN_ICONS: Record<string, React.ComponentType<any>> = {
  Activity,
  Users,
  Smartphone: () => null,
  CreditCard,
  BarChart3,
  Settings,
};

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
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
        {/* Logo */}
        <div className="p-6 border-b border-border flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            F
          </div>
          <span className="font-bold text-lg">Femoj Admin</span>
        </div>

        {/* Navigation */}
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

        {/* User Profile */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
              {user?.firstName.charAt(0)}
              {user?.lastName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Admin
              </p>
            </div>
          </div>
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
        {/* Top Bar */}
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

            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-muted px-3 py-2 rounded-lg flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-lg relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
            </button>

            <Link href="/admin/settings" className="p-2 hover:bg-muted rounded-lg">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
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
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Platform overview and management
                </p>
              </motion.div>

              {/* KPI Cards */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {[
                  {
                    title: "Total Users",
                    value: "12,543",
                    change: "+12.5%",
                    positive: true,
                    icon: Users,
                  },
                  {
                    title: "Total Revenue",
                    value: "$245,890",
                    change: "+24.3%",
                    positive: true,
                    icon: CreditCard,
                  },
                  {
                    title: "Active Numbers",
                    value: "45,230",
                    change: "+8.2%",
                    positive: true,
                    icon: Activity,
                  },
                  {
                    title: "Pending Verification",
                    value: "234",
                    change: "-15%",
                    positive: true,
                    icon: AlertCircle,
                  },
                ].map((card, idx) => (
                  <motion.div key={idx} variants={staggerItem}>
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">
                            {card.title}
                          </CardTitle>
                          <card.icon className="w-4 h-4 text-primary" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold mb-1">
                          {card.value}
                        </div>
                        <p
                          className={`text-xs ${
                            card.positive
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {card.change}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Charts & Analytics */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={staggerItem} className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend</CardTitle>
                      <CardDescription>
                        Last 30 days revenue
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                      [Chart Placeholder - Recharts Integration Ready]
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Numbers</CardTitle>
                      <CardDescription>
                        Most used numbers
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { num: "+1 (555) 123-4567", orders: 1203 },
                        { num: "+44 (20) 7946-0958", orders: 892 },
                        { num: "+81 (3) 1234-5678", orders: 756 },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <p className="text-sm font-medium">{item.num}</p>
                          <Badge variant="secondary">{item.orders}</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest platform activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          action: "New user registration",
                          user: "john@example.com",
                          time: "2 minutes ago",
                          type: "success",
                        },
                        {
                          action: "Large transaction",
                          user: "Company ABC",
                          amount: "$5,000",
                          time: "15 minutes ago",
                          type: "warning",
                        },
                        {
                          action: "KYC verification",
                          user: "jane@example.com",
                          time: "1 hour ago",
                          type: "success",
                        },
                      ].map((activity, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {activity.action}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.user}
                              {activity.amount && ` • ${activity.amount}`}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      ))}
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
