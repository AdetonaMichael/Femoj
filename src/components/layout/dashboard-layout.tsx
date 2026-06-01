"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/store";
import { DASHBOARD_NAVIGATION } from "@/constants";
import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  Search,
  LayoutDashboard,
  Smartphone,
  MessageSquare,
  CreditCard,
  Share2,
  LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import Image from "next/image";
import { logo1 } from "../../../public";

const DASHBOARD_ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Smartphone,
  MessageSquare,
  CreditCard,
  Share2,
  Settings,
};

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
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
          {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm"> */}
                 {/* Logo */}
                      <Image
                        src={logo1}
                        alt="Femoj Logo"
                        width={40}
                        height={40}
                        priority
                        className="h-10 w-auto"
                      />
          {/* </div> */}
          <span className="font-bold text-lg">FeMOJ World</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {DASHBOARD_NAVIGATION.map((item) => {
            const isActive = pathname === item.href;
            const Icon = DASHBOARD_ICONS[item.icon] || Settings;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors border-l-4 ${
                  isActive
                    ? "bg-blue-50 text-primary border-l-primary"
                    : "text-muted-foreground hover:bg-muted border-l-transparent"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border space-y-3 bg-blue-50">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">
              {user?.first_name?.charAt(0) || 'U'}
              {user?.last_name?.charAt(0) || ''}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
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

            <Link href="/dashboard/settings" className="p-2 hover:bg-muted rounded-lg">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      )}

      {/* Mobile Sidebar Drawer */}
      <motion.aside
        className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-white z-50 md:hidden flex flex-col shadow-lg"
        initial={{ x: -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border flex items-center gap-2 bg-white">
          <Image
            src={logo1}
            alt="Femoj Logo"
            width={32}
            height={32}
            priority
            className="h-8 w-auto"
          />
          <span className="font-bold text-lg">FeMOJ World</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {DASHBOARD_NAVIGATION.map((item) => {
            const isActive = pathname === item.href;
            const Icon = DASHBOARD_ICONS[item.icon] || Settings;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors border-l-4 ${
                  isActive
                    ? "bg-blue-50 text-primary border-l-primary"
                    : "text-muted-foreground hover:bg-muted border-l-transparent"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border space-y-3 bg-blue-50">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-md">
              {user?.first_name?.charAt(0) || 'U'}
              {user?.last_name?.charAt(0) || ''}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
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
    </div>
  );
}
