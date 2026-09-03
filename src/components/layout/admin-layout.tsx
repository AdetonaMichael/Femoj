"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Smartphone,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Shield,
  Package,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { NotificationBell } from "@/components/notifications";
import { Button } from "@/components/ui";

const ADMIN_NAVIGATION = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Services", href: "/admin/services", icon: Package },
  { label: "Numbers", href: "/admin/numbers", icon: Smartphone },
  { label: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { label: "Credits", href: "/admin/credits", icon: BarChart3 },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
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
            const Icon = item.icon;

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
              {user?.first_name?.charAt(0)}
              {user?.last_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              className="justify-start gap-2"
            >
              <Shield className="w-4 h-4" />
              Switch to User
            </Button>
          </Link>
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

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 w-64 bg-card-background z-50 md:hidden flex flex-col"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    F
                  </div>
                  <span className="font-bold text-lg">Femoj Admin</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {ADMIN_NAVIGATION.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
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
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Switch to User
                  </Button>
                </Link>
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
          </>
        )}
      </AnimatePresence>

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
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <Link
              href="/admin"
              className="p-2 hover:bg-muted rounded-lg"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
