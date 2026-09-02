"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NotificationCenter, NotificationPreferences } from "@/components/notifications";
import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

type Tab = "notifications" | "preferences";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("notifications");

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-[#f8f9fa]"
        style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
      >
        {/* Header */}
        <motion.div
          className="mb-6"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <h1 className="text-[22px] font-medium text-[#202124] mb-1">
            Notifications
          </h1>
          <p className="text-sm text-[#5f6368]">
            View updates and manage your notification preferences
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="mb-6"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
        >
          <div className="flex gap-1 p-1 bg-white rounded-lg border border-[#e8eaed] inline-flex">
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "notifications"
                  ? "bg-[#e8f0fe] text-[#1a73e8]"
                  : "text-[#5f6368] hover:bg-[#f8f9fa]"
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === "preferences"
                  ? "bg-[#e8f0fe] text-[#1a73e8]"
                  : "text-[#5f6368] hover:bg-[#f8f9fa]"
              }`}
            >
              <Settings className="w-4 h-4" />
              Preferences
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
        >
          {activeTab === "notifications" && <NotificationCenter />}
          {activeTab === "preferences" && <NotificationPreferences />}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
