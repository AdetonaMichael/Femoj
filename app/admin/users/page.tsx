"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Search, Filter, MoreVertical, Shield, Ban, CheckCircle, Lock } from "lucide-react";
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

export default function UsersPage() {
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

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      verified: true,
      joinDate: "2024-01-15",
      balance: 1250.5,
      orders: 45,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      status: "active",
      verified: true,
      joinDate: "2024-01-12",
      balance: 3420.75,
      orders: 128,
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      status: "suspended",
      verified: true,
      joinDate: "2023-12-10",
      balance: 0,
      orders: 3,
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      status: "active",
      verified: false,
      joinDate: "2024-01-20",
      balance: 500,
      orders: 12,
    },
    {
      id: 5,
      name: "David Lee",
      email: "david@example.com",
      status: "inactive",
      verified: true,
      joinDate: "2023-11-05",
      balance: 2100,
      orders: 67,
    },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          <div className="p-4 md:p-6  mx-auto w-full">
            <motion.div
              className="space-y-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {/* Header */}
              <motion.div variants={staggerItem}>
                <h1 className="text-4xl font-bold mb-2">User Management</h1>
                <p className="text-muted-foreground">
                  Manage platform users and permissions
                </p>
              </motion.div>

              {/* Filters */}
              <motion.div
                className="flex flex-col md:flex-row gap-4"
                variants={staggerItem}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </motion.div>

              {/* Users Table */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                    <CardDescription>
                      Platform user accounts and status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold">
                              Name
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Verified
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Joined
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Balance
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Orders
                            </th>
                            <th className="text-center py-3 px-4 font-semibold">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <motion.tr
                              key={u.id}
                              className="border-b border-border hover:bg-muted transition-colors"
                              whileHover={{ x: 4 }}
                            >
                              <td className="py-3 px-4 font-medium">
                                {u.name}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {u.email}
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant={
                                    u.status === "active"
                                      ? "success"
                                      : u.status === "suspended"
                                        ? "danger"
                                        : "warning"
                                  }
                                >
                                  {u.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                {u.verified ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Shield className="w-4 h-4 text-yellow-600" />
                                )}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {formatDate(u.joinDate)}
                              </td>
                              <td className="py-3 px-4 font-medium">
                                ${u.balance}
                              </td>
                              <td className="py-3 px-4">{u.orders}</td>
                              <td className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="text-muted-foreground hover:text-primary"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </div>
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
