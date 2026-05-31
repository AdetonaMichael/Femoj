"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { TrendingUp, TrendingDown, Calendar, Download, Filter, BarChart3, LineChart, PieChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAVIGATION } from "@/constants";
import { useAuthStore } from "@/store/auth";
import { LogOut, Menu, X, Bell, Settings } from "lucide-react";

const ADMIN_ICONS: Record<string, React.ComponentType<any>> = {
  Activity: () => null,
  Users: () => null,
  Smartphone: () => null,
  CreditCard: () => null,
  BarChart3: () => null,
  Settings,
};

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dateRange, setDateRange] = useState("30d");
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };

  const metrics = [
    {
      title: "Monthly Recurring Revenue",
      value: "$125,400",
      change: "+23.5%",
      positive: true,
      icon: TrendingUp,
    },
    {
      title: "Average Order Value",
      value: "$245.50",
      change: "+5.2%",
      positive: true,
      icon: BarChart3,
    },
    {
      title: "Customer Lifetime Value",
      value: "$1,240",
      change: "-2.1%",
      positive: false,
      icon: LineChart,
    },
    {
      title: "Churn Rate",
      value: "2.1%",
      change: "-0.5%",
      positive: true,
      icon: PieChart,
    },
  ];

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
            <Link href="/admin/settings" className="p-2 hover:bg-muted rounded-lg">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6  mx-auto w-full">
            <motion.div
              className="space-y-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {/* Header */}
              <motion.div
                className="flex items-center justify-between"
                variants={staggerItem}
              >
                <div>
                  <h1 className="text-4xl font-bold mb-2">Analytics</h1>
                  <p className="text-muted-foreground">
                    Platform metrics and insights
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    className="input-base px-4 py-2 rounded-lg border"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </motion.div>

              {/* Metrics */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {metrics.map((metric, idx) => (
                  <motion.div key={idx} variants={staggerItem}>
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">
                            {metric.title}
                          </CardTitle>
                          <metric.icon
                            className={`w-4 h-4 ${
                              metric.positive
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-2">
                          {metric.value}
                        </div>
                        <p
                          className={`text-sm ${
                            metric.positive
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {metric.change}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Charts */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={staggerItem}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue by Country</CardTitle>
                      <CardDescription>
                        Distribution across regions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                      [Pie Chart Placeholder - Recharts Integration Ready]
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card>
                    <CardHeader>
                      <CardTitle>User Growth</CardTitle>
                      <CardDescription>
                        New users over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
                      [Line Chart Placeholder - Recharts Integration Ready]
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Top Performing Numbers */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={staggerItem}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Numbers</CardTitle>
                      <CardDescription>
                        Most revenue generating
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { num: "+1 (555) 123-4567", revenue: "$12,450" },
                        { num: "+44 (20) 7946-0958", revenue: "$9,230" },
                        { num: "+81 (3) 1234-5678", revenue: "$7,890" },
                        { num: "+91 (22) 1234-5678", revenue: "$6,540" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg border border-border"
                        >
                          <p className="font-medium text-sm">{item.num}</p>
                          <p className="font-semibold">{item.revenue}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Segments</CardTitle>
                      <CardDescription>
                        By lifetime value
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { name: "Enterprise", count: 45, percent: 35 },
                        { name: "Mid-Market", count: 120, percent: 40 },
                        { name: "SMB", count: 890, percent: 25 },
                      ].map((seg, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{seg.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {seg.count} users
                            </p>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${seg.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
