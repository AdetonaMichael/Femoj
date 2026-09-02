"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useVirtualNumbers } from "@/hooks/useVirtualNumbers";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  ChevronRight,
  Copy,
  Check,
  Clock,
  Inbox,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

export default function SmsPage() {
  const { numbers, numbersLoading } = useVirtualNumbers();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Flatten numbers with their latest SMS for inbox view
  const numbersWithSms = (numbers || [])
    .filter((n) => {
      const matchesSearch =
        n.number.includes(searchQuery) ||
        n.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.country.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (a.last_sms_at && b.last_sms_at) {
        return new Date(b.last_sms_at).getTime() - new Date(a.last_sms_at).getTime();
      }
      if (a.last_sms_at) return -1;
      if (b.last_sms_at) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Number copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const SERVICE_ICONS: Record<string, string> = {
    whatsapp: "/whatsapp.png", telegram: "/telegram.png", instagram: "/google.png", twitter: "/google.png",
    facebook: "/meta.png", tiktok: "/tiktok.png", snapchat: "/snapchat.png", tinder: "/google.png",
    discord: "/discord.png", signal: "/google.png", other: "",
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
            SMS Inbox
          </h1>
          <p className="text-sm text-[#5f6368]">
            View verification codes for all your virtual numbers
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-6"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input
              type="text"
              placeholder="Search by number, service, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-[#e8eaed] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
            />
          </div>
        </motion.div>

        {/* SMS List */}
        {numbersLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-[#e8eaed] bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-[#f1f3f4] rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-[#f1f3f4] rounded w-1/3 mb-2" />
                    <div className="h-3 bg-[#f1f3f4] rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : numbersWithSms.length === 0 ? (
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
          >
            <div className="text-center py-16 rounded-lg border border-[#e8eaed] bg-white">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f8f9fa] mb-4">
                <Inbox className="w-7 h-7 text-[#9aa0a6]" />
              </div>
              <p className="text-base font-medium text-[#202124] mb-1">
                {searchQuery ? "No matching results" : "No SMS messages yet"}
              </p>
              <p className="text-sm text-[#5f6368] mb-6">
                {searchQuery
                  ? "Try a different search term"
                  : "Purchase a virtual number to start receiving SMS"}
              </p>
              {!searchQuery && (
                <Link
                  href="/dashboard/numbers"
                  className="inline-flex items-center gap-2 h-10 px-5 text-sm bg-[#1a73e8] hover:bg-[#1765cc] text-white rounded-lg font-medium transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  Buy a Number
                </Link>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {numbersWithSms.map((number, i) => (
              <motion.div
                key={number.id}
                variants={fadeUp}
                custom={i + 2}
                initial="hidden"
                animate="show"
              >
                <Link
                  href={`/dashboard/numbers/${number.id}`}
                  className="block rounded-lg border border-[#e8eaed] bg-white hover:shadow-[0_1px_6px_rgba(32,33,36,.18)] transition-all"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8f9fa] shrink-0 text-2xl">
                        {number.country.flag_emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {SERVICE_ICONS[number.service?.slug] ? (
                            <img
                              src={SERVICE_ICONS[number.service?.slug]}
                              alt={number.service?.name}
                              className="h-5 w-5 object-contain mr-1"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                              }}
                            />
                          ) : null}
                          <span className={`text-lg mr-1 ${SERVICE_ICONS[number.service?.slug] ? "hidden" : ""}`}>📱</span>
                          <p className="text-sm font-medium text-[#202124] truncate">
                            {number.service.name}
                          </p>
                          {number.unread_sms > 0 && (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1a73e8] px-1.5 text-[10px] font-semibold text-white">
                              {number.unread_sms}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              copyToClipboard(number.number, number.id);
                            }}
                            className="text-xs font-mono text-[#5f6368] hover:text-[#1a73e8] transition-colors"
                          >
                            {number.number}
                            {copiedId === number.id ? (
                              <Check className="inline w-3 h-3 ml-1 text-[#137333]" />
                            ) : (
                              <Copy className="inline w-3 h-3 ml-1 opacity-50" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-[#9aa0a6]">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="text-xs">{number.sms_count || 0}</span>
                        </div>
                        {number.last_sms_at ? (
                          <p className="text-[10px] text-[#9aa0a6] mt-1">
                            {formatDistanceToNow(new Date(number.last_sms_at), { addSuffix: true })}
                          </p>
                        ) : (
                          <p className="text-[10px] text-[#9aa0a6] mt-1">No SMS</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#9aa0a6] shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
