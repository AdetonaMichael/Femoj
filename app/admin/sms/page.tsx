"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Search, Filter, MoreVertical, Send, Clock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAVIGATION } from "@/constants";
import { useAuthStore } from "@/store/auth";
import { LogOut, Menu, X, Bell, Settings } from "lucide-react";
import { formatDate } from "@/utils";

const ADMIN_ICONS: Record<string, React.ComponentType<any>> = {
  Activity: () => null,
  Users: () => null,
  Smartphone: () => null,
  CreditCard: () => null,
  BarChart3: () => null,
  Settings,
};

export default function SMSPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };

  const smsLogs = [
    {
      id: "SMS-001",
      from: "+1 (555) 123-4567",
      to: "+1 (555) 987-6543",
      user: "John Doe",
      message: "Hello, this is a test message",
      status: "delivered",
      timestamp: "2024-01-20 14:30",
      cost: 0.01,
    },
    {
      id: "SMS-002",
      from: "+44 (20) 7946-0958",
      to: "+44 (20) 1234-5678",
      user: "Jane Smith",
      message: "Verification code: 123456",
      status: "sent",
      timestamp: "2024-01-20 14:25",
      cost: 0.01,
    },
    {
      id: "SMS-003",
      from: "+81 (3) 1234-5678",
      to: "+81 (3) 9876-5432",
      user: "Michael Brown",
      message: "Order confirmed. Thank you!",
      status: "delivered",
      timestamp: "2024-01-20 14:20",
      cost: 0.02,
    },
    {
      id: "SMS-004",
      from: "+91 (22) 1234-5678",
      to: "+91 (22) 5555-6666",
      user: "Sarah Wilson",
      message: "Your account has been verified",
      status: "failed",
      timestamp: "2024-01-20 14:10",
      cost: 0.0,
    },
    {
      id: "SMS-005",
      from: "+1 (555) 456-7890",
      to: "+1 (555) 111-2222",
      user: "David Lee",
      message: "Payment received successfully",
      status: "delivered",
      timestamp: "2024-01-20 14:05",
      cost: 0.01,
    },
  ];

  const filteredLogs = smsLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.from.includes(searchTerm) ||
      log.to.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalSent: 5,
    delivered: 3,
    failed: 1,
    totalCost: 0.06,
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
            <div className="hidden md:flex items-center gap-2 bg-muted px-3 py-2 rounded-lg flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
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
          <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            <motion.div
              className="space-y-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {/* Header */}
              <motion.div variants={staggerItem}>
                <h1 className="text-4xl font-bold mb-2">SMS Platform</h1>
                <p className="text-muted-foreground">
                  Monitor SMS traffic and platform logs
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {[
                  {
                    title: "Total Sent",
                    value: stats.totalSent,
                    icon: Send,
                  },
                  {
                    title: "Delivered",
                    value: stats.delivered,
                    icon: CheckCircle,
                  },
                  {
                    title: "Failed",
                    value: stats.failed,
                    icon: AlertCircle,
                  },
                  {
                    title: "Total Cost",
                    value: `$${stats.totalCost.toFixed(3)}`,
                    icon: Clock,
                  },
                ].map((stat, idx) => (
                  <motion.div key={idx} variants={staggerItem}>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          {stat.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Filters */}
              <motion.div
                className="flex flex-col md:flex-row gap-4"
                variants={staggerItem}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search SMS logs..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="input-base px-4 py-2 rounded-lg border"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </motion.div>

              {/* SMS Logs Table */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle>SMS Logs ({filteredLogs.length})</CardTitle>
                    <CardDescription>
                      Platform SMS messaging history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold">
                              ID
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              From
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              To
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              User
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Message
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Time
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Cost
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLogs.map((log) => (
                            <motion.tr
                              key={log.id}
                              className="border-b border-border hover:bg-muted transition-colors"
                              whileHover={{ x: 4 }}
                            >
                              <td className="py-3 px-4 font-medium">
                                {log.id}
                              </td>
                              <td className="py-3 px-4 text-sm font-mono">
                                {log.from}
                              </td>
                              <td className="py-3 px-4 text-sm font-mono">
                                {log.to}
                              </td>
                              <td className="py-3 px-4">{log.user}</td>
                              <td className="py-3 px-4 text-muted-foreground truncate max-w-xs">
                                {log.message}
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant={
                                    log.status === "delivered"
                                      ? "success"
                                      : log.status === "sent"
                                        ? "warning"
                                        : "danger"
                                  }
                                >
                                  {log.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground text-xs">
                                {log.timestamp}
                              </td>
                              <td className="py-3 px-4 font-medium">
                                ${log.cost.toFixed(3)}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
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
