"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth";
import { NotificationPreferences } from "@/components/notifications";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Key,
  Camera,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Palette,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

type Tab = "profile" | "security" | "notifications" | "appearance";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);

  // Profile form
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone_number || "");

  // Security form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Appearance
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  const handleSaveProfile = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success("Profile updated successfully");
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password changed successfully");
  };

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
            Settings
          </h1>
          <p className="text-sm text-[#5f6368]">
            Manage your account preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-lg border border-[#e8eaed] bg-white p-2 lg:sticky lg:top-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-[#e8f0fe] text-[#1a73e8]"
                        : "text-[#5f6368] hover:bg-[#f8f9fa]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* ── Profile Tab ──────────────────────────────────────────────── */}
            {activeTab === "profile" && (
              <motion.div
                variants={fadeUp}
                custom={2}
                initial="hidden"
                animate="show"
              >
                <div className="rounded-lg border border-[#e8eaed] bg-white">
                  {/* Avatar */}
                  <div className="p-6 border-b border-[#e8eaed]">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f0fe] text-[#1a73e8] text-2xl font-semibold">
                          {user?.first_name?.[0]}
                          {user?.last_name?.[0]}
                        </div>
                        <button className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#1a73e8] text-white hover:bg-[#1765cc] transition-colors">
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div>
                        <p className="text-base font-medium text-[#202124]">
                          {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-sm text-[#5f6368]">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-[#202124] mb-1.5">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full h-11 px-4 text-sm bg-white border border-[#e8eaed] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#202124] mb-1.5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full h-11 px-4 text-sm bg-white border border-[#e8eaed] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#202124] mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-[#e8eaed] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#202124] mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-[#e8eaed] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="h-10 px-6 flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1765cc] disabled:bg-[#9aa0a6] text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Security Tab ──────────────────────────────────────────────── */}
            {activeTab === "security" && (
              <motion.div
                variants={fadeUp}
                custom={2}
                initial="hidden"
                animate="show"
              >
                <div className="rounded-lg border border-[#e8eaed] bg-white p-6">
                  <h2 className="text-base font-medium text-[#202124] mb-1">
                    Change Password
                  </h2>
                  <p className="text-sm text-[#5f6368] mb-6">
                    Update your password to keep your account secure
                  </p>

                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-[#202124] mb-1.5">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full h-11 pl-10 pr-11 text-sm bg-white border border-[#e8eaed] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4 text-[#9aa0a6]" />
                          ) : (
                            <Eye className="w-4 h-4 text-[#9aa0a6]" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#202124] mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full h-11 pl-10 pr-11 text-sm bg-white border border-[#e8eaed] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4 text-[#9aa0a6]" />
                          ) : (
                            <Eye className="w-4 h-4 text-[#9aa0a6]" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#202124] mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-[#e8eaed] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                      className="h-10 px-6 flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1765cc] disabled:bg-[#9aa0a6] disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                      Change Password
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Notifications Tab ──────────────────────────────────────────── */}
            {activeTab === "notifications" && (
              <motion.div
                variants={fadeUp}
                custom={2}
                initial="hidden"
                animate="show"
              >
                <NotificationPreferences />
              </motion.div>
            )}

            {/* ── Appearance Tab ──────────────────────────────────────────── */}
            {activeTab === "appearance" && (
              <motion.div
                variants={fadeUp}
                custom={2}
                initial="hidden"
                animate="show"
              >
                <div className="rounded-lg border border-[#e8eaed] bg-white p-6">
                  <h2 className="text-base font-medium text-[#202124] mb-1">
                    Appearance
                  </h2>
                  <p className="text-sm text-[#5f6368] mb-6">
                    Customize the look and feel of the app
                  </p>

                  <div>
                    <p className="text-sm font-medium text-[#202124] mb-3">
                      Theme
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "light" as const, label: "Light", icon: Sun },
                        { id: "dark" as const, label: "Dark", icon: Moon },
                        { id: "system" as const, label: "System", icon: Monitor },
                      ].map((t) => {
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                              theme === t.id
                                ? "border-[#1a73e8] bg-[#f6fafe]"
                                : "border-[#e8eaed] hover:border-[#dadce0]"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                theme === t.id ? "text-[#1a73e8]" : "text-[#5f6368]"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium ${
                                theme === t.id ? "text-[#1a73e8]" : "text-[#5f6368]"
                              }`}
                            >
                              {t.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
