"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  Key,
  Copy,
  Check,
  Shield,
  Sun,
  Moon,
  Monitor,
  LogOut,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, changePasswordSchema } from "@/schemas";
import { toast } from "sonner";
import { useTheme } from "next-themes";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type TabId = "profile" | "security" | "notifications" | "api";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

interface Session {
  device: string;
  ip: string;
  location: string;
  current: boolean;
}

interface ApiKey {
  name: string;
  key: string;
  created: string;
  env: "live" | "test";
}

interface NotificationPref {
  title: string;
  description: string;
  enabled: boolean;
}

/* ─── Static data ─────────────────────────────────────────────────────────── */
const TABS: Tab[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api", label: "API Keys", icon: Key },
];

const SESSIONS: Session[] = [
  {
    device: "Chrome on Windows",
    ip: "192.168.1.1",
    location: "New York, USA",
    current: true,
  },
  {
    device: "Safari on iPhone",
    ip: "203.0.113.42",
    location: "San Francisco, USA",
    current: false,
  },
];

const API_KEYS: ApiKey[] = [
  {
    name: "Production Key",
    key: "sk_live_1234567890abcdef",
    created: "Jan 15, 2024",
    env: "live",
  },
  {
    name: "Development Key",
    key: "sk_test_1234567890abcdef",
    created: "Jan 15, 2024",
    env: "test",
  },
];

const NOTIFICATION_PREFS: NotificationPref[] = [
  { title: "SMS Alerts", description: "Receive alerts via SMS", enabled: true },
  {
    title: "Email Notifications",
    description: "Receive updates via email",
    enabled: true,
  },
  {
    title: "Marketing Emails",
    description: "Receive promotional content",
    enabled: false,
  },
  {
    title: "Transaction Notifications",
    description: "Get notified of all transactions",
    enabled: true,
  },
  {
    title: "Login Alerts",
    description: "Be notified of new login attempts",
    enabled: true,
  },
];

/* ─── Shared styles ───────────────────────────────────────────────────────── */
const fieldLabel =
  "block text-xs font-medium text-[#5f6368] uppercase tracking-wide mb-1.5";

const inputBase =
  "w-full h-9 px-3 text-sm rounded-md border border-[#dadce0] bg-white text-[#202124] placeholder:text-[#9aa0a6] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors";

const sectionPanel = "rounded-lg border border-[#e8eaed] bg-white overflow-hidden";

const sectionHeader =
  "flex items-center justify-between px-5 py-4 border-b border-[#e8eaed]";

const submitBtn =
  "h-9 px-5 text-sm font-medium rounded-md bg-[#1a73e8] hover:bg-[#1765cc] text-white transition-colors disabled:opacity-50 inline-flex items-center gap-2";

/* ─── Animation ───────────────────────────────────────────────────────────── */
const panelAnim = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOut } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [copied, setCopied] = useState("");
  const [notifState, setNotifState] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_PREFS.map((n) => [n.title, n.enabled]))
  );

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "Demo",
      lastName: "User",
      email: "demo@femoj.com",
      phone: "+1234567890",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileUpdate = async (_data: ProfileFormValues) => {
    toast.success("Profile updated");
  };

  const onPasswordChange = async (_data: PasswordFormValues) => {
    toast.success("Password changed");
    passwordForm.reset();
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key).catch(() => null);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const toggleNotif = (title: string) => {
    setNotifState((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
      >
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-6"
        >
          <h1 className="text-[22px] font-medium text-[#202124] tracking-tight">
            Settings
          </h1>
          <p className="mt-1 text-sm text-[#5f6368]">
            Manage your account preferences and security.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* ── Sidebar nav ───────────────────────────────────────────────── */}
          <nav className="md:w-48 shrink-0">
            <ul className="space-y-0.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-[#e8f0fe] text-[#1a73e8] font-medium"
                          : "text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#202124]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {tab.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── Content pane ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {/* ── Profile ─────────────────────────────────────────────── */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  variants={panelAnim}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* Profile info */}
                  <div className={sectionPanel}>
                    <div className={sectionHeader}>
                      <div>
                        <p className="text-sm font-medium text-[#202124]">
                          Profile Information
                        </p>
                        <p className="text-xs text-[#5f6368] mt-0.5">
                          Update your personal details
                        </p>
                      </div>
                    </div>
                    <div className="px-5 py-5">
                      {/* Avatar row */}
                      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[#f1f3f4]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1a73e8] text-white text-lg font-semibold shrink-0">
                          DU
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#202124]">
                            Demo User
                          </p>
                          <p className="text-xs text-[#5f6368]">
                            demo@femoj.com
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={profileForm.handleSubmit(onProfileUpdate)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <label className={fieldLabel}>First Name</label>
                          <input
                            className={inputBase}
                            placeholder="First name"
                            {...profileForm.register("firstName")}
                          />
                        </div>
                        <div>
                          <label className={fieldLabel}>Last Name</label>
                          <input
                            className={inputBase}
                            placeholder="Last name"
                            {...profileForm.register("lastName")}
                          />
                        </div>
                        <div>
                          <label className={fieldLabel}>Email Address</label>
                          <input
                            type="email"
                            className={inputBase}
                            placeholder="Email"
                            {...profileForm.register("email")}
                          />
                        </div>
                        <div>
                          <label className={fieldLabel}>Phone Number</label>
                          <input
                            type="tel"
                            className={inputBase}
                            placeholder="Phone"
                            {...profileForm.register("phone")}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <button
                            type="submit"
                            className={submitBtn}
                            disabled={profileForm.formState.isSubmitting}
                          >
                            <Check className="w-3.5 h-3.5" />
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Theme preferences */}
                  <div className={sectionPanel}>
                    <div className={sectionHeader}>
                      <div>
                        <p className="text-sm font-medium text-[#202124]">
                          Appearance
                        </p>
                        <p className="text-xs text-[#5f6368] mt-0.5">
                          Choose your preferred colour scheme
                        </p>
                      </div>
                    </div>
                    <div className="px-5 py-5">
                      <div className="grid grid-cols-3 gap-3 max-w-sm">
                        {(
                          [
                            { value: "light", label: "Light", Icon: Sun },
                            { value: "dark", label: "Dark", Icon: Moon },
                            { value: "system", label: "System", Icon: Monitor },
                          ] as { value: string; label: string; Icon: React.ElementType }[]
                        ).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() =>
                              setTheme(opt.value as "light" | "dark" | "system")
                            }
                            className={`flex flex-col items-center gap-2 py-4 rounded-lg border text-sm transition-colors ${
                              theme === opt.value
                                ? "border-[#1a73e8] bg-[#e8f0fe] text-[#1a73e8] font-medium"
                                : "border-[#e8eaed] text-[#5f6368] hover:bg-[#f8f9fa]"
                            }`}
                          >
                            <opt.Icon className="w-5 h-5" />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Security ────────────────────────────────────────────── */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  variants={panelAnim}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* Change password */}
                  <div className={sectionPanel}>
                    <div className={sectionHeader}>
                      <div>
                        <p className="text-sm font-medium text-[#202124]">
                          Change Password
                        </p>
                        <p className="text-xs text-[#5f6368] mt-0.5">
                          Update your password regularly for security
                        </p>
                      </div>
                    </div>
                    <div className="px-5 py-5">
                      <form
                        onSubmit={passwordForm.handleSubmit(onPasswordChange)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg"
                      >
                        <div className="md:col-span-2">
                          <label className={fieldLabel}>Current Password</label>
                          <input
                            type="password"
                            className={inputBase}
                            placeholder="Current password"
                            {...passwordForm.register("currentPassword")}
                          />
                        </div>
                        <div>
                          <label className={fieldLabel}>New Password</label>
                          <input
                            type="password"
                            className={inputBase}
                            placeholder="New password"
                            {...passwordForm.register("newPassword")}
                          />
                          {passwordForm.formState.errors.newPassword && (
                            <p className="text-xs text-[#c5221f] mt-1">
                              {
                                passwordForm.formState.errors.newPassword
                                  .message as string
                              }
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={fieldLabel}>Confirm Password</label>
                          <input
                            type="password"
                            className={inputBase}
                            placeholder="Confirm password"
                            {...passwordForm.register("confirmPassword")}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <button
                            type="submit"
                            className={submitBtn}
                            disabled={passwordForm.formState.isSubmitting}
                          >
                            <Check className="w-3.5 h-3.5" />
                            Update Password
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* 2FA */}
                  <div className={sectionPanel}>
                    <div className={sectionHeader}>
                      <div>
                        <p className="text-sm font-medium text-[#202124]">
                          Two-Factor Authentication
                        </p>
                        <p className="text-xs text-[#5f6368] mt-0.5">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#fef7e0] text-[#b06000]">
                        Disabled
                      </span>
                    </div>
                    <div className="px-5 py-5">
                      <p className="text-sm text-[#5f6368] mb-4">
                        Two-factor authentication is not enabled. Enable it to
                        protect your account with an additional verification step.
                      </p>
                      <button className={submitBtn}>
                        <Shield className="w-3.5 h-3.5" />
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  {/* Active sessions */}
                  <div className={sectionPanel}>
                    <div className={sectionHeader}>
                      <div>
                        <p className="text-sm font-medium text-[#202124]">
                          Active Sessions
                        </p>
                        <p className="text-xs text-[#5f6368] mt-0.5">
                          Manage your active login sessions
                        </p>
                      </div>
                    </div>
                    <div className="divide-y divide-[#f1f3f4]">
                      {SESSIONS.map((session, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-5 py-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-[#202124]">
                                {session.device}
                              </p>
                              {session.current && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e6f4ea] text-[#137333]">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#5f6368] mt-0.5">
                              {session.ip} · {session.location}
                            </p>
                          </div>
                          {!session.current && (
                            <button className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded border border-[#dadce0] text-[#c5221f] hover:bg-[#fce8e6] transition-colors">
                              <LogOut className="w-3.5 h-3.5" />
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Notifications ────────────────────────────────────────── */}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  variants={panelAnim}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                >
                  <div className={sectionPanel}>
                    <div className={sectionHeader}>
                      <div>
                        <p className="text-sm font-medium text-[#202124]">
                          Notification Preferences
                        </p>
                        <p className="text-xs text-[#5f6368] mt-0.5">
                          Control how you receive updates and alerts
                        </p>
                      </div>
                    </div>
                    <div className="divide-y divide-[#f1f3f4]">
                      {NOTIFICATION_PREFS.map((notif) => (
                        <div
                          key={notif.title}
                          className="flex items-center justify-between px-5 py-4 hover:bg-[#f8f9fa] transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-[#202124]">
                              {notif.title}
                            </p>
                            <p className="text-xs text-[#5f6368] mt-0.5">
                              {notif.description}
                            </p>
                          </div>
                          {/* Google-style toggle */}
                          <button
                            role="switch"
                            aria-checked={notifState[notif.title]}
                            onClick={() => toggleNotif(notif.title)}
                            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] ${
                              notifState[notif.title]
                                ? "bg-[#1a73e8]"
                                : "bg-[#dadce0]"
                            }`}
                          >
                            <span
                              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transform transition-transform ${
                                notifState[notif.title]
                                  ? "translate-x-[18px]"
                                  : "translate-x-[3px]"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── API Keys ─────────────────────────────────────────────── */}
              {activeTab === "api" && (
                <motion.div
                  key="api"
                  variants={panelAnim}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="space-y-4"
                >
                  {/* Keys list */}
                  <div className={sectionPanel}>
                    <div className={sectionHeader}>
                      <div>
                        <p className="text-sm font-medium text-[#202124]">
                          API Keys
                        </p>
                        <p className="text-xs text-[#5f6368] mt-0.5">
                          Manage API keys for integrations
                        </p>
                      </div>
                      <button className={submitBtn}>
                        <Key className="w-3.5 h-3.5" />
                        Generate Key
                      </button>
                    </div>
                    <div className="divide-y divide-[#f1f3f4]">
                      {API_KEYS.map((apiKey) => (
                        <div key={apiKey.key} className="px-5 py-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-[#202124]">
                                  {apiKey.name}
                                </p>
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                                    apiKey.env === "live"
                                      ? "bg-[#e6f4ea] text-[#137333]"
                                      : "bg-[#f1f3f4] text-[#5f6368]"
                                  }`}
                                >
                                  {apiKey.env === "live" ? "Live" : "Test"}
                                </span>
                              </div>
                              <p className="text-xs text-[#5f6368] mt-0.5">
                                Created {apiKey.created}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center h-9 px-3 rounded-md border border-[#dadce0] bg-[#f8f9fa] font-mono text-xs text-[#5f6368] overflow-hidden">
                              <span className="truncate">
                                {"•".repeat(16)} {apiKey.key.slice(-8)}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyKey(apiKey.key)}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#dadce0] text-[#5f6368] hover:bg-[#f1f3f4] transition-colors"
                              aria-label="Copy key"
                            >
                              {copied === apiKey.key ? (
                                <Check className="w-4 h-4 text-[#137333]" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Webhooks */}
                  <div className={sectionPanel}>
                    <div className={sectionHeader}>
                      <div>
                        <p className="text-sm font-medium text-[#202124]">
                          Webhooks
                        </p>
                        <p className="text-xs text-[#5f6368] mt-0.5">
                          Configure endpoints for real-time events
                        </p>
                      </div>
                    </div>
                    <div className="px-5 py-5">
                      <p className="text-sm text-[#5f6368] mb-4">
                        No webhooks configured. Add an endpoint to receive
                        real-time event notifications.
                      </p>
                      <button className={submitBtn}>
                        <Key className="w-3.5 h-3.5" />
                        Add Endpoint
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}