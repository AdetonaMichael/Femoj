"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useVirtualNumbers } from "@/hooks/useVirtualNumbers";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Copy,
  Check,
  Clock,
  Trash2,
  RefreshCw,
  MessageSquare,
  ArrowRight,
  Loader2,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

export default function NumberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { useNumberDetail, releaseNumber, refreshSms, isReleasing } = useVirtualNumbers();
  const { data: numberDetail, isLoading, refetch } = useNumberDetail(id || null);

  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const copyToClipboard = (text: string, type: "number" | "message", id?: number) => {
    navigator.clipboard.writeText(text);
    if (type === "number") {
      setCopiedNumber(true);
      toast.success("Number copied!");
      setTimeout(() => setCopiedNumber(false), 2000);
    } else if (id !== undefined) {
      setCopiedMessage(id);
      toast.success("Code copied!");
      setTimeout(() => setCopiedMessage(null), 2000);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success("SMS inbox refreshed");
    } finally {
      setRefreshing(false);
    }
  };

  const handleRelease = async () => {
    if (!confirm("Are you sure you want to release this number? This cannot be undone.")) return;
    try {
      const res = await releaseNumber(id);
      if (res?.success) {
        router.push("/dashboard/numbers");
      }
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#1a73e8] animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!numberDetail) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center gap-4">
          <Smartphone className="w-12 h-12 text-[#9aa0a6]" />
          <p className="text-sm text-[#5f6368]">Number not found</p>
          <button
            onClick={() => router.push("/dashboard/numbers")}
            className="text-sm text-[#1a73e8] hover:underline"
          >
            Back to numbers
          </button>
        </div>
      </DashboardLayout>
    );
  }

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
          <button
            onClick={() => router.push("/dashboard/numbers")}
            className="flex items-center gap-1 text-sm text-[#1a73e8] hover:underline mb-3"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to numbers
          </button>
        </motion.div>

        {/* Number Card */}
        <motion.div
          className="mb-6"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f8f9fa] text-3xl">
                  {numberDetail.country.flag_emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {SERVICE_ICONS[numberDetail.service?.slug] ? (
                      <img
                        src={SERVICE_ICONS[numberDetail.service?.slug]}
                        alt={numberDetail.service?.name}
                        className="h-8 w-8 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <span className={`text-3xl ${SERVICE_ICONS[numberDetail.service?.slug] ? "hidden" : ""}`}>📱</span>
                  </div>
                  <p className="text-xs text-[#5f6368] mt-1">
                    {numberDetail.service?.name} · {numberDetail.country?.name}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  numberDetail.status === "active"
                    ? "bg-[#e6f4ea] text-[#137333]"
                    : numberDetail.status === "expired"
                    ? "bg-[#fef7e0] text-[#b06000]"
                    : "bg-[#f1f3f4] text-[#5f6368]"
                }`}
              >
                {numberDetail.status}
              </span>
            </div>

            {/* Number Display */}
            <div className="bg-[#f8f9fa] rounded-lg p-4 mb-4">
              <p className="text-xs text-[#5f6368] mb-1">Phone Number</p>
              <div className="flex items-center gap-3">
                <p className="text-xl font-mono font-semibold text-[#202124] tracking-wide">
                  {numberDetail.number}
                </p>
                <button
                  onClick={() => copyToClipboard(numberDetail.number, "number")}
                  className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-white transition-colors"
                >
                  {copiedNumber ? (
                    <Check className="w-4 h-4 text-[#137333]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#5f6368]" />
                  )}
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-[#f8f9fa]">
                <p className="text-xs text-[#5f6368] mb-1">Type</p>
                <p className="text-sm font-medium text-[#202124] capitalize">
                  {numberDetail.type}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#f8f9fa]">
                <p className="text-xs text-[#5f6368] mb-1">Expires</p>
                <p className="text-sm font-medium text-[#202124]">
                  {numberDetail.time_remaining || "N/A"}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#f8f9fa]">
                <p className="text-xs text-[#5f6368] mb-1">SMS Received</p>
                <p className="text-sm font-medium text-[#202124]">
                  {numberDetail.sms_count || numberDetail.messages?.length || 0}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#f8f9fa]">
                <p className="text-xs text-[#5f6368] mb-1">Price Paid</p>
                <p className="text-sm font-medium text-[#202124]">
                  ₦{Number(numberDetail.price).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            {numberDetail.status === "active" && (
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex-1 h-10 flex items-center justify-center gap-2 border border-[#e8eaed] hover:bg-[#f8f9fa] rounded-lg text-sm font-medium text-[#5f6368] transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh SMS
                </button>
                <button
                  onClick={handleRelease}
                  disabled={isReleasing}
                  className="flex-1 h-10 flex items-center justify-center gap-2 border border-[#fce8e6] hover:bg-[#fce8e6]/50 rounded-lg text-sm font-medium text-[#c5221f] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Release Number
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* SMS Messages */}
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white">
            <div className="flex items-center justify-between p-5 border-b border-[#e8eaed]">
              <div>
                <p className="text-sm font-medium text-[#202124]">
                  SMS Messages
                </p>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  {numberDetail.messages?.length || 0} messages received
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#f8f9fa] transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-[#5f6368] ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>

            {!numberDetail.messages || numberDetail.messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#f8f9fa] mb-3">
                  <MessageSquare className="w-6 h-6 text-[#9aa0a6]" />
                </div>
                <p className="text-sm text-[#5f6368] mb-1">No SMS yet</p>
                <p className="text-xs text-[#9aa0a6]">
                  SMS messages will appear here when received
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#f1f3f4]">
                {numberDetail.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 hover:bg-[#f8f9fa] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#5f6368]">
                          From: {msg.from || "Unknown"}
                        </span>
                        {msg.status === "received" && (
                          <span className="inline-flex h-2 w-2 rounded-full bg-[#1a73e8]" />
                        )}
                      </div>
                      <span className="text-xs text-[#9aa0a6]">
                        {formatDate(msg.received_at)}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <p className="text-sm text-[#202124] flex-1 whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <button
                        onClick={() => copyToClipboard(msg.content, "message", msg.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-white shrink-0 transition-colors"
                      >
                        {copiedMessage === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-[#137333]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#5f6368]" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
