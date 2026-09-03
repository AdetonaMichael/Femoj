"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useWallet } from "@/hooks/useWallet";
import { useVirtualNumbers } from "@/hooks/useVirtualNumbers";
import { useCredits } from "@/hooks/useCredits";
import { motion } from "framer-motion";
import {
  Smartphone,
  MessageSquare,
  CreditCard,
  Clock,
  Shield,
  Zap,
  ChevronRight,
  Globe,
  ArrowRight,
  Plus,
  TrendingUp,
  Inbox,
} from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

const SERVICE_ICONS: Record<string, string> = {
  whatsapp: "/whatsapp.png",
  telegram: "/telegram.png",
  instagram: "/google.png",
  twitter: "/google.png",
  facebook: "/meta.png",
  tiktok: "/tiktok.png",
  snapchat: "/snapchat.png",
  tinder: "/google.png",
  bumble: "/google.png",
  discord: "/discord.png",
  signal: "/google.png",
  viber: "/google.png",
  microsoft: "/google.png",
  google: "/google.png",
  apple: "/google.png",
  amazon: "/google.png",
  uber: "/uber.png",
  netflix: "/google.png",
  spotify: "/google.png",
  paypal: "/paypal.png",
  cashapp: "/google.png",
};

export default function DashboardPage() {
  const { balance } = useWallet();
  const { numbers, stats, numbersLoading, services } = useVirtualNumbers();
  const { creditBalance } = useCredits();

  const activeNumbers = numbers?.filter((n) => n.status === "active") || [];
  const recentNumbers = activeNumbers.slice(0, 5);
  const balanceMajor = balance?.balance ?? 0;

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-[#f8f9fa]"
        style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
      >
        {/* ── Hero Section ──────────────────────────────────────────────────── */}
        <motion.div
          className="mb-6"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <div className="bg-gradient-to-r from-[#1a73e8] to-[#4285f4] rounded-xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">Available Balance</p>
                  <p className="text-3xl md:text-4xl font-semibold mb-2">
                    ₦{Number(balanceMajor).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm text-white/90">
                      {creditBalance.toLocaleString()} Credits Available
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/numbers?action=buy"
                    className="inline-flex items-center gap-2 h-10 px-5 text-sm bg-white text-[#1a73e8] hover:bg-white/90 rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Buy Number
                  </Link>
                  <Link
                    href="/dashboard/wallet"
                    className="inline-flex items-center gap-2 h-10 px-5 text-sm bg-white/20 text-white hover:bg-white/30 rounded-lg font-medium transition-colors backdrop-blur-sm"
                  >
                    <CreditCard className="w-4 h-4" />
                    Fund Wallet
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            {
              label: "Active Numbers",
              value: stats?.active_numbers ?? activeNumbers.length,
              icon: Smartphone,
              color: "bg-[#e8f0fe] text-[#1a73e8]",
              href: "/dashboard/numbers",
            },
            {
              label: "SMS Received",
              value: stats?.total_sms ?? 0,
              icon: MessageSquare,
              color: "bg-[#e6f4ea] text-[#137333]",
              href: "/dashboard/sms",
            },
            {
              label: "Total Spent",
              value: `₦${Number(stats?.total_spent ?? 0).toLocaleString()}`,
              icon: TrendingUp,
              color: "bg-[#fef7e0] text-[#b06000]",
              href: "/dashboard/wallet",
            },
            {
              label: "Credits",
              value: creditBalance.toLocaleString(),
              icon: Zap,
              color: "bg-[#f3e8fd] text-[#7627bb]",
              href: "/dashboard/wallet",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i + 1}
                initial="hidden"
                animate="show"
              >
                <Link
                  href={stat.href}
                  className="block rounded-lg border border-[#e8eaed] bg-white p-4 hover:shadow-[0_1px_6px_rgba(32,33,36,.18)] transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9aa0a6]" />
                  </div>
                  <p className="text-[22px] font-semibold text-[#202124] leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#5f6368]">{stat.label}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* ── Services Preview ──────────────────────────────────────────────── */}
        <motion.div
          className="mb-6"
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-[#202124]">
                  Popular Services
                </p>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Select a service to get started
                </p>
              </div>
              <Link
                href="/dashboard/numbers"
                className="text-xs text-[#1a73e8] hover:underline flex items-center gap-0.5"
              >
                View all
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {(services || []).slice(0, 16).map((service) => (
                <Link
                  key={service.id}
                  href={`/dashboard/numbers?service=${service.slug}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border border-transparent hover:border-[#e8eaed] hover:bg-[#f8f9fa] transition-all group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8f9fa] group-hover:bg-[#e8f0fe] transition-colors overflow-hidden">
                    {SERVICE_ICONS[service.slug] ? (
                      <img
                        src={SERVICE_ICONS[service.slug]}
                        alt={service.name}
                        className="h-8 w-8 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <span className={`text-2xl ${SERVICE_ICONS[service.slug] ? "hidden" : ""}`}>📱</span>
                  </div>
                  <span className="text-[11px] text-[#5f6368] text-center leading-tight truncate w-full">
                    {service.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Active Numbers + How It Works ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Active Numbers */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeUp}
            custom={6}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-lg border border-[#e8eaed] bg-white p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-[#202124]">
                    Active Numbers
                  </p>
                  <p className="text-xs text-[#5f6368] mt-0.5">
                    Your virtual phone numbers
                  </p>
                </div>
                <Link
                  href="/dashboard/numbers"
                  className="text-xs text-[#1a73e8] hover:underline flex items-center gap-0.5"
                >
                  Manage
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {numbersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg border border-[#e8eaed]">
                      <div className="h-10 w-10 bg-[#f1f3f4] rounded-lg" />
                      <div className="flex-1">
                        <div className="h-4 bg-[#f1f3f4] rounded w-1/3 mb-2" />
                        <div className="h-3 bg-[#f1f3f4] rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentNumbers.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f9fa] mb-3">
                    <Smartphone className="w-6 h-6 text-[#9aa0a6]" />
                  </div>
                  <p className="text-sm text-[#5f6368] mb-1">
                    No active numbers yet
                  </p>
                  <p className="text-xs text-[#9aa0a6] mb-4">
                    Purchase a virtual number to start receiving SMS
                  </p>
                  <Link
                    href="/dashboard/numbers"
                    className="inline-flex items-center gap-2 h-9 px-4 text-sm bg-[#1a73e8] hover:bg-[#1765cc] text-white rounded-md font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Buy Your First Number
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentNumbers.map((number) => (
                    <Link
                      key={number.id}
                      href={`/dashboard/numbers/${number.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#e8eaed] hover:bg-[#f8f9fa] transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8f0fe] shrink-0 text-lg">
                        {number.country.flag_emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#202124] truncate">
                            {number.number}
                          </p>
                          {number.unread_sms > 0 && (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1a73e8] px-1.5 text-[10px] font-semibold text-white">
                              {number.unread_sms}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5f6368]">
                          {number.service.name} · {number.country.name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                            number.type === "rent"
                              ? "bg-[#e8f0fe] text-[#1a73e8]"
                              : "bg-[#e6f4ea] text-[#137333]"
                          }`}
                        >
                          {number.type === "rent" ? "Rented" : "Activation"}
                        </span>
                        {number.time_remaining && (
                          <p className="text-[10px] text-[#9aa0a6] mt-1">
                            {number.time_remaining}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#9aa0a6] group-hover:text-[#1a73e8] transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            variants={fadeUp}
            custom={7}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-lg border border-[#e8eaed] bg-white p-5 h-full">
              <p className="text-sm font-medium text-[#202124] mb-4">
                How It Works
              </p>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    icon: Globe,
                    title: "Select Service",
                    desc: "Choose the platform you need a number for",
                  },
                  {
                    step: "2",
                    icon: Smartphone,
                    title: "Get Number",
                    desc: "Purchase an activation or rent a number",
                  },
                  {
                    step: "3",
                    icon: Inbox,
                    title: "Receive SMS",
                    desc: "Verification codes appear in your inbox instantly",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a73e8] text-white text-xs font-semibold shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#202124]">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#5f6368]">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-[#e8eaed]">
                <div className="space-y-2">
                  {[
                    {
                      icon: Shield,
                      text: "Numbers are single-use per service",
                    },
                    { icon: Zap, text: "SMS delivery in under 30 seconds" },
                    { icon: Clock, text: "Activations valid for 20 minutes" },
                  ].map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-[#137333]" />
                        <span className="text-xs text-[#5f6368]">
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Quick Tips ─────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={8}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
            <p className="text-sm font-medium text-[#202124] mb-3">
              Pro Tips
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-[#f8f9fa]">
                <p className="text-xs font-medium text-[#202124] mb-1">
                  Use a VPN
                </p>
                <p className="text-xs text-[#5f6368]">
                  Match your VPN country to the number country for better SMS
                  delivery rates.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#f8f9fa]">
                <p className="text-xs font-medium text-[#202124] mb-1">
                  Cancel & Retry
                </p>
                <p className="text-xs text-[#5f6368]">
                  If SMS doesn&apos;t arrive within 3 minutes, cancel and buy
                  another number. Credits are returned.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#f8f9fa]">
                <p className="text-xs font-medium text-[#202124] mb-1">
                  Rent for Bulk
                </p>
                <p className="text-xs text-[#5f6368]">
                  Need multiple verifications? Rent a number for 30 days of
                  unlimited SMS.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
