"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@/components/ui";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_NUMBERS,
  MOCK_SMS_CONVERSATIONS,
  MOCK_TRANSACTIONS,
} from "@/mock/data";
import { motion } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Send,
  BarChart2,
  Plus,
  Eye,
  MessageSquare,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/utils";

/* ─── Animation variants ──────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

/* ─── Stat card data type ─────────────────────────────────────────────────── */
interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  href?: string;
  hrefLabel?: string;
}

/* ─── Transaction / Number / Conversation type guards ─────────────────────── */
type TxnType = "credit" | "debit";
type TxnStatus = "completed" | "pending" | "failed";

interface Transaction {
  id: string;
  type: TxnType;
  description: string;
  amount: number;
  status: TxnStatus;
  createdAt: string | Date;
}

interface VirtualNumber {
  id: string;
  number: string;
  country: string;
  type: string;
}

interface SMSConversation {
  id: string;
  phoneNumber: string;
  messageCount: number;
  unreadCount: number;
}

interface DashboardStats {
  totalBalance: number;
  activeNumbers: number;
  monthlySMS: number;
  monthlySpending: number;
}

/* ─── Shared styles ───────────────────────────────────────────────────────── */
const rowBase =
  "flex items-center gap-4 px-4 py-3 rounded-md border border-[#e8eaed] hover:bg-[#f8f9fa] transition-colors cursor-default";

const iconWrap =
  "flex h-9 w-9 items-center justify-center rounded-md bg-[#e8f0fe] shrink-0";

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const stats = MOCK_DASHBOARD_STATS as DashboardStats;
  const numbers = MOCK_NUMBERS as VirtualNumber[];
  const conversations = MOCK_SMS_CONVERSATIONS as SMSConversation[];
  const transactions = MOCK_TRANSACTIONS as Transaction[];

  const statCards: StatCard[] = [
    {
      label: "Wallet Balance",
      value: formatCurrency(stats.totalBalance),
      sub: "Available funds",
      icon: CreditCard,
      href: "/dashboard/wallet",
      hrefLabel: "Fund wallet",
    },
    {
      label: "Active Numbers",
      value: String(stats.activeNumbers),
      sub: "Virtual numbers",
      icon: Smartphone,
      href: "/dashboard/numbers",
      hrefLabel: "View numbers",
    },
    {
      label: "SMS This Month",
      value: String(stats.monthlySMS),
      sub: "+15% vs last month",
      icon: Send,
    },
    {
      label: "Monthly Spending",
      value: formatCurrency(stats.monthlySpending),
      sub: `Budget: ${formatCurrency(500)}`,
      icon: BarChart2,
    },
  ];

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
      >
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <motion.div
          className="mb-8"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <h1
            className="text-[22px] font-medium text-[#202124] tracking-tight"
          >
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[#5f6368]">
            Welcome back — here's your account at a glance.
          </p>
        </motion.div>

        {/* ── Stat cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={fadeUp}
                custom={i + 1}
                initial="hidden"
                animate="show"
              >
                <div className="rounded-lg border border-[#e8eaed] bg-white p-5 hover:shadow-[0_1px_6px_rgba(32,33,36,.18)] transition-shadow h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                      {card.label}
                    </span>
                    <div className={iconWrap}>
                      <Icon className="w-4 h-4 text-[#1a73e8]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[28px] font-semibold text-[#202124] leading-none mb-1">
                      {card.value}
                    </p>
                    {card.href ? (
                      <Link
                        href={card.href}
                        className="text-xs text-[#1a73e8] hover:underline inline-flex items-center gap-0.5 mt-1"
                      >
                        {card.hrefLabel}
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <p className="text-xs text-[#5f6368] mt-1">{card.sub}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Quick actions ───────────────────────────────────────────────── */}
        <motion.div
          className="mb-8"
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
            <p className="text-sm font-medium text-[#202124] mb-4">
              Quick Actions
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="h-9 px-4 text-sm bg-[#1a73e8] hover:bg-[#1765cc] text-white rounded-md gap-2 font-medium shadow-none"
              >
                <Link href="/dashboard/numbers">
                  <Plus className="w-4 h-4" />
                  Buy Number
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-9 px-4 text-sm border-[#dadce0] text-[#1a73e8] hover:bg-[#f6fafe] rounded-md gap-2 font-medium shadow-none"
              >
                <Link href="/dashboard/sms">
                  <MessageSquare className="w-4 h-4" />
                  Send SMS
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-9 px-4 text-sm border-[#dadce0] text-[#1a73e8] hover:bg-[#f6fafe] rounded-md gap-2 font-medium shadow-none"
              >
                <Link href="/dashboard/wallet">
                  <CreditCard className="w-4 h-4" />
                  Fund Wallet
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ── Numbers + SMS grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Active numbers */}
          <motion.div
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
                    Your virtual numbers
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

              <div className="space-y-2">
                {numbers.map((number) => (
                  <div key={number.id} className={rowBase}>
                    <div className={iconWrap}>
                      <Smartphone className="w-4 h-4 text-[#1a73e8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#202124]">
                        {number.number}
                      </p>
                      <p className="text-xs text-[#5f6368]">
                        {number.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e6f4ea] text-[#137333]">
                        {number.type}
                      </span>
                      <Link href="/dashboard/numbers" aria-label="View number">
                        <Eye className="w-4 h-4 text-[#5f6368] hover:text-[#1a73e8] transition-colors" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent SMS */}
          <motion.div
            variants={fadeUp}
            custom={7}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-lg border border-[#e8eaed] bg-white p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-[#202124]">
                    Recent SMS
                  </p>
                  <p className="text-xs text-[#5f6368] mt-0.5">
                    Latest conversations
                  </p>
                </div>
                <Link
                  href="/dashboard/sms"
                  className="text-xs text-[#1a73e8] hover:underline flex items-center gap-0.5"
                >
                  View all
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2">
                {conversations.slice(0, 3).map((conv) => (
                  <div key={conv.id} className={rowBase}>
                    <div className={iconWrap}>
                      <MessageSquare className="w-4 h-4 text-[#1a73e8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#202124]">
                        {conv.phoneNumber}
                      </p>
                      <p className="text-xs text-[#5f6368]">
                        {conv.messageCount} messages
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1a73e8] px-1.5 text-[11px] font-semibold text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Recent transactions ─────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={8}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-[#202124]">
                  Recent Transactions
                </p>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Latest wallet activity
                </p>
              </div>
              <Link
                href="/dashboard/wallet"
                className="text-xs text-[#1a73e8] hover:underline flex items-center gap-0.5"
              >
                View all
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_140px_100px_80px] gap-4 px-4 pb-2 border-b border-[#e8eaed]">
              {["Description", "Date", "Amount", "Status"].map((h) => (
                <span
                  key={h}
                  className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wide"
                >
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-[#f1f3f4]">
              {transactions.map((txn) => {
                const isCredit = txn.type === "credit";
                return (
                  <div
                    key={txn.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_140px_100px_80px] gap-2 md:gap-4 items-center px-4 py-3 hover:bg-[#f8f9fa] transition-colors"
                  >
                    {/* Description */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isCredit ? "bg-[#e6f4ea]" : "bg-[#fce8e6]"
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-[#137333]" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#c5221f]" />
                        )}
                      </div>
                      <span className="text-sm text-[#202124]">
                        {txn.description}
                      </span>
                    </div>

                    {/* Date */}
                    <span className="text-sm text-[#5f6368]">
                      {formatDate(txn.createdAt)}
                    </span>

                    {/* Amount */}
                    <span
                      className={`text-sm font-medium tabular-nums ${
                        isCredit ? "text-[#137333]" : "text-[#c5221f]"
                      }`}
                    >
                      {isCredit ? "+" : "−"}
                      {formatCurrency(txn.amount)}
                    </span>

                    {/* Status */}
                    <span
                      className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        txn.status === "completed"
                          ? "bg-[#e6f4ea] text-[#137333]"
                          : txn.status === "pending"
                          ? "bg-[#fef7e0] text-[#b06000]"
                          : "bg-[#fce8e6] text-[#c5221f]"
                      }`}
                    >
                      {txn.status.charAt(0).toUpperCase() +
                        txn.status.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}