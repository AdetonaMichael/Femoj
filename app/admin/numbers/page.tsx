"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Search, Filter, MoreVertical, CheckCircle, AlertCircle, Smartphone, TrendingUp } from "lucide-react";
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

export default function NumbersPage() {
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

  const numbers = [
    {
      id: 1,
      number: "+1 (555) 123-4567",
      country: "United States",
      type: "permanent",
      status: "active",
      owner: "John Doe",
      orders: 1203,
      revenue: 12450.0,
      active: true,
    },
    {
      id: 2,
      number: "+44 (20) 7946-0958",
      country: "United Kingdom",
      type: "permanent",
      status: "active",
      owner: "Unassigned",
      orders: 892,
      revenue: 9230.0,
      active: true,
    },
    {
      id: 3,
      number: "+81 (3) 1234-5678",
      country: "Japan",
      type: "temporary",
      status: "inactive",
      owner: "Sarah Wilson",
      orders: 156,
      revenue: 2500.0,
      active: false,
    },
    {
      id: 4,
      number: "+91 (22) 1234-5678",
      country: "India",
      type: "permanent",
      status: "active",
      owner: "Unassigned",
      orders: 645,
      revenue: 6540.0,
      active: true,
    },
    {
      id: 5,
      number: "+61 (2) 1234-5678",
      country: "Australia",
      type: "temporary",
      status: "active",
      owner: "Michael Brown",
      orders: 423,
      revenue: 3850.0,
      active: true,
    },
  ];

  const filteredNumbers = numbers.filter((n) => {
    const matchesSearch =
      n.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || n.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalNumbers: numbers.length,
    activeNumbers: numbers.filter((n) => n.active).length,
    totalOrders: numbers.reduce((sum, n) => sum + n.orders, 0),
    totalRevenue: numbers.reduce((sum, n) => sum + n.revenue, 0),
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
          <div className="p-4 md:p-6 mx-auto w-full">
            <motion.div
              className="space-y-8"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
            >
              {/* Header */}
              <motion.div variants={staggerItem}>
                <h1 className="text-4xl font-bold mb-2">Number Inventory</h1>
                <p className="text-muted-foreground">
                  Manage virtual numbers and availability
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
                    title: "Total Numbers",
                    value: stats.totalNumbers,
                    icon: Smartphone,
                  },
                  {
                    title: "Active",
                    value: stats.activeNumbers,
                    icon: CheckCircle,
                  },
                  {
                    title: "Total Orders",
                    value: stats.totalOrders,
                    icon: TrendingUp,
                  },
                  {
                    title: "Total Revenue",
                    value: `$${stats.totalRevenue.toFixed(2)}`,
                    icon: AlertCircle,
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
                    placeholder="Search numbers..."
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
                </select>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  More Filters
                </Button>
              </motion.div>

              {/* Numbers Table */}
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader>
                    <CardTitle>Numbers ({filteredNumbers.length})</CardTitle>
                    <CardDescription>
                      Virtual number inventory and performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold">
                              Number
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Country
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Type
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Owner
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Orders
                            </th>
                            <th className="text-left py-3 px-4 font-semibold">
                              Revenue
                            </th>
                            <th className="text-center py-3 px-4 font-semibold">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredNumbers.map((num) => (
                            <motion.tr
                              key={num.id}
                              className="border-b border-border hover:bg-muted transition-colors"
                              whileHover={{ x: 4 }}
                            >
                              <td className="py-3 px-4 font-medium">
                                {num.number}
                              </td>
                              <td className="py-3 px-4">{num.country}</td>
                              <td className="py-3 px-4 capitalize">
                                {num.type}
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  variant={
                                    num.status === "active"
                                      ? "success"
                                      : "warning"
                                  }
                                >
                                  {num.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {num.owner}
                              </td>
                              <td className="py-3 px-4">{num.orders}</td>
                              <td className="py-3 px-4 font-medium">
                                ${num.revenue.toFixed(2)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
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
