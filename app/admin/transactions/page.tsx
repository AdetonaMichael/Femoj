"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Search, Filter, MoreVertical, ArrowUpRight, ArrowDownLeft, Download } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAVIGATION } from "@/constants";
import { useAuthStore } from "@/store/auth";
import { LogOut, Menu, X, Bell, Settings } from "lucide-react";
import { formatDate, formatCurrency } from "@/utils";

const ADMIN_ICONS: Record<string, React.ComponentType<any>> = {
  Activity: () => null,
  Users: () => null,
  Smartphone: () => null,
  CreditCard: () => null,
  BarChart3: () => null,
  Settings,
};

export default function TransactionsPage() {
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

  const transactions = [
    {
      id: "TXN-001",
      user: "John Doe",
      amount: 150.0,
      type: "credit",
      status: "completed",
      method: "Card",
      date: "2024-01-20",
      reference: "NUM-US-001",
    },
    {
      id: "TXN-002",
      user: "Jane Smith",
      amount: 500.0,
      type: "credit",
      status: "completed",
      method: "Bank Transfer",
      date: "2024-01-19",
      reference: "NUM-UK-002",
    },
    {
      id: "TXN-003",
      user: "Michael Brown",
      amount: 75.5,
      type: "debit",
      status: "pending",
      method: "Bank Account",
      date: "2024-01-19",
      reference: "WTH-001",
    },
    {
      id: "TXN-004",
      user: "Sarah Wilson",
      amount: 200.0,
      type: "credit",
      status: "completed",
      method: "Card",
      date: "2024-01-18",
      reference: "NUM-CA-003",
    },
    {
      id: "TXN-005",
      user: "David Lee",
      amount: 300.0,
      type: "credit",
      status: "failed",
      method: "PayPal",
      date: "2024-01-18",
      reference: "NUM-AU-004",
    },
  ];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalVolume: 1225.5,
    completedCount: 3,
    pendingCount: 1,
    failedCount: 1,
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
                <h1 className="text-4xl font-bold mb-2">Transactions</h1>
                <p className="text-muted-foreground">
                  Monitor and manage platform transactions
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
                    title: "Total Volume",
                    value: formatCurrency(stats.totalVolume),
                    icon: ArrowUpRight,
                  },
                  {
                    title: "Completed",
                    value: stats.completedCount,
                    icon: ArrowDownLeft,
                  },
                  {
                    title: "Pending",
                    value: stats.pendingCount,
                    icon: Search,
                  },
                  {
                    title: "Failed",
                    value: stats.failedCount,
                    icon: X,
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
                    placeholder="Search transactions..."
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
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </motion.div>

              {/* Transactions Table */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
                    <CardDescription>
                      Recent platform transactions
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
                              User
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Amount
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Type
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Method
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Date
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Reference
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTransactions.map((txn) => (
                            <motion.tr
                              key={txn.id}
                              className="border-b border-border hover:bg-muted transition-colors"
                              whileHover={{ x: 4 }}
                            >
                              <td className="py-3 px-4 font-medium">
                                {txn.id}
                              </td>
                              <td className="py-3 px-4">{txn.user}</td>
                              <td className="py-3 px-4 font-medium">
                                {formatCurrency(txn.amount)}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  {txn.type === "credit" ? (
                                    <ArrowDownLeft className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <ArrowUpRight className="w-4 h-4 text-red-600" />
                                  )}
                                  <span className="capitalize">
                                    {txn.type}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant={
                                    txn.status === "completed"
                                      ? "success"
                                      : txn.status === "pending"
                                        ? "warning"
                                        : "danger"
                                  }
                                >
                                  {txn.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {txn.method}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {formatDate(txn.date)}
                              </td>
                              <td className="py-3 px-4 font-mono text-xs">
                                {txn.reference}
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
