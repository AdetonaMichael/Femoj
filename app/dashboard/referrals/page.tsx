"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useReferrals } from "@/hooks/useReferrals";
import { useAuthStore } from "@/store/auth";
import { motion } from "framer-motion";
import { formatCurrency, formatDate } from "@/utils";
import {
  Users,
  TrendingUp,
  DollarSign,
  Copy,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Link as LinkIcon,
  Check,
  ChevronRight,
  Gift,
  Target,
  Award,
  Loader2,
  AlertCircle,
  ExternalLink,
  ArrowUpRight,
  UserPlus,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ─── Animation variants ──────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

/* ─── Shared styles ───────────────────────────────────────────────────────── */
const rowBase =
  "flex items-center gap-4 px-4 py-3 rounded-md border border-[#e8eaed] hover:bg-[#f8f9fa] transition-colors cursor-default";

const iconWrap =
  "flex h-9 w-9 items-center justify-center rounded-md bg-[#e8f0fe] shrink-0";

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const { user } = useAuthStore();
  const {
    links,
    referrals,
    stats,
    milestones,
    isLoading,
    error,
  } = useReferrals();

  const referralLink = links?.[0]?.link || "";
  const referralCode = links?.[0]?.code || "";

  const handleCopyLink = () => {
    if (!referralLink) {
      toast.error("No referral link available yet");
      return;
    }
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const message = `Join me on Femoj - the global virtual number marketplace! Use my referral link and get started: ${referralLink}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      email: `mailto:?subject=Join Femoj&body=${encodeURIComponent(message)}`,
    };
    window.open(urls[platform as keyof typeof urls], "_blank");
  };

  const statCards = [
    {
      label: "Total Referrals",
      value: String(stats?.total_referrals ?? 0),
      sub: "All time",
      icon: Users,
    },
    {
      label: "Qualified Referrals",
      value: String(stats?.fully_qualified_referrals ?? 0),
      sub: "Completed all milestones",
      icon: Target,
    },
    {
      label: "Total Earnings",
      value: formatCurrency(stats?.total_earnings ?? 0),
      sub: "Commission earned",
      icon: DollarSign,
    },
    {
      label: "Available Balance",
      value: formatCurrency(stats?.available_balance ?? 0),
      sub: "Withdrawable",
      icon: TrendingUp,
    },
  ];

  const milestonesList = [
    { key: "email_verified", label: "Email Verified", icon: Mail },
    { key: "phone_verified", label: "Phone Verified", icon: AlertCircle },
    { key: "wallet_funded_100", label: "Wallet Funded (₦100+)", icon: DollarSign },
    { key: "first_transaction", label: "First Transaction", icon: ArrowUpRight },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div
          className="min-h-screen bg-white flex items-center justify-center"
          style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 text-[#1a73e8] animate-spin" />
            <p className="text-sm text-[#5f6368]">Loading referral data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
          <h1 className="text-[22px] font-medium text-[#202124] tracking-tight">
            Referral Program
          </h1>
          <p className="mt-1 text-sm text-[#5f6368]">
            Earn ₦200 for every friend who completes all milestones.
          </p>
        </motion.div>

        {/* ── Stat cards ──────────────────────────────────────────────────── */}
        <div className="flex md:grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 overflow-x-auto pb-2 md:pb-0 -mx-4 md:mx-0 px-4 md:px-0 md:overflow-x-visible snap-x snap-mandatory md:snap-none">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={fadeUp}
                custom={i + 1}
                initial="hidden"
                animate="show"
                className="flex-shrink-0 w-full sm:w-auto md:flex-shrink md:w-auto snap-start"
              >
                <div className="rounded-lg border border-[#e8eaed] bg-white p-5 hover:shadow-[0_1px_6px_rgba(32,33,36,.18)] transition-shadow h-full flex flex-col justify-between min-w-0">
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
                    <p className="text-xs text-[#5f6368] mt-1">{card.sub}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Error state ─────────────────────────────────────────────────── */}
        {error && (
          <motion.div
            variants={fadeUp}
            custom={5}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <div className="rounded-lg border border-[#fce8e6] bg-[#fce8e6]/50 p-5">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#c5221f] shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#c5221f]">
                    Unable to load referral data
                  </p>
                  <p className="text-xs text-[#5f6368] mt-0.5">
                    {error.message || "Please try refreshing the page."}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Referral link section ───────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={iconWrap}>
                <LinkIcon className="w-4 h-4 text-[#1a73e8]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#202124]">
                  Your Referral Link
                </p>
                <p className="text-xs text-[#5f6368]">
                  Share this link with friends to earn rewards
                </p>
              </div>
            </div>

            {referralLink ? (
              <>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center h-10 px-3 rounded-md border border-[#dadce0] bg-[#f8f9fa] text-sm text-[#202124] font-mono truncate">
                      {referralLink}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-[#dadce0] bg-white hover:bg-[#f8f9fa] transition-colors shrink-0"
                    title="Copy link"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-[#137333]" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#5f6368]" />
                    )}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="inline-flex items-center gap-2 h-9 px-4 text-sm border border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa] rounded-md font-medium transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="inline-flex items-center gap-2 h-9 px-4 text-sm border border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa] rounded-md font-medium transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="inline-flex items-center gap-2 h-9 px-4 text-sm border border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa] rounded-md font-medium transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare("email")}
                    className="inline-flex items-center gap-2 h-9 px-4 text-sm border border-[#dadce0] text-[#5f6368] hover:bg-[#f8f9fa] rounded-md font-medium transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 border border-dashed border-[#dadce0] rounded-lg">
                <Gift className="w-8 h-8 text-[#dadce0] mx-auto mb-2" />
                <p className="text-sm text-[#5f6368]">
                  No referral link yet. Create one to get started.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── How it works ────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
            <p className="text-sm font-medium text-[#202124] mb-4">
              How It Works
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: "1",
                  title: "Share your link",
                  desc: "Send your unique referral link to friends",
                  icon: Share2,
                },
                {
                  step: "2",
                  title: "Friend signs up",
                  desc: "They register using your referral link",
                  icon: UserPlus,
                },
                {
                  step: "3",
                  title: "Earn ₦200",
                  desc: "When they complete 4 milestones, you earn ₦200",
                  icon: Award,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-lg border border-[#e8eaed] hover:bg-[#f8f9fa] transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f0fe] shrink-0">
                      <Icon className="w-4 h-4 text-[#1a73e8]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#202124]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#5f6368] mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Milestones progress ─────────────────────────────────────────── */}
        {milestones && milestones.length > 0 && (
          <motion.div
            variants={fadeUp}
            custom={8}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-[#202124]">
                    Referral Milestones
                  </p>
                  <p className="text-xs text-[#5f6368] mt-0.5">
                    Track your referrals&apos; progress
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {milestones.slice(0, 5).map((m) => (
                  <div
                    key={m.milestone_id}
                    className="rounded-lg border border-[#e8eaed] p-4 hover:bg-[#f8f9fa] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={iconWrap}>
                          <Users className="w-4 h-4 text-[#1a73e8]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#202124]">
                            {m.referred_user.name}
                          </p>
                          <p className="text-xs text-[#5f6368]">
                            {m.referred_user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {m.is_fully_qualified ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e6f4ea] text-[#137333]">
                            Qualified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#fef7e0] text-[#b06000]">
                            In Progress
                          </span>
                        )}
                        <span className="text-sm font-medium text-[#202124] tabular-nums">
                          {m.progress_percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-[#e8eaed] rounded-full mb-3">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${m.progress_percentage}%`,
                          backgroundColor: m.is_fully_qualified ? "#137333" : "#1a73e8",
                        }}
                      />
                    </div>

                    {/* Milestone steps */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {milestonesList.map((ms) => {
                        const detail = m.milestones[ms.key as keyof typeof m.milestones];
                        const isCompleted = detail?.completed ?? false;
                        const StepIcon = ms.icon;
                        return (
                          <div
                            key={ms.key}
                            className={`flex items-center gap-1.5 text-xs ${
                              isCompleted ? "text-[#137333]" : "text-[#9aa0a6]"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 shrink-0" />
                            )}
                            <span className="truncate">{ms.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {m.is_fully_qualified && m.payout_earned > 0 && (
                      <div className="mt-3 pt-3 border-t border-[#e8eaed]">
                        <p className="text-xs text-[#5f6368]">
                          Payout:{" "}
                          <span className="font-medium text-[#137333]">
                            {formatCurrency(m.payout_earned)}
                          </span>
                          {m.payout_paid_at && (
                            <span className="ml-2 text-[#9aa0a6]">
                              Paid {formatDate(m.payout_paid_at)}
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Referral history ────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={9}
          initial="hidden"
          animate="show"
          className="mb-8"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-[#202124]">
                  Referral History
                </p>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Users you&apos;ve referred
                </p>
              </div>
              {referrals && referrals.length > 0 && (
                <span className="text-xs text-[#5f6368]">
                  {referrals.length} referral{referrals.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {referrals && referrals.length > 0 ? (
              <div className="space-y-2">
                {referrals.map((ref) => (
                  <div key={ref.referral_id} className={rowBase}>
                    <div className={iconWrap}>
                      <Users className="w-4 h-4 text-[#1a73e8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#202124]">
                        {ref.user.name}
                      </p>
                      <p className="text-xs text-[#5f6368]">
                        {ref.user.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e8f0fe] text-[#1a73e8]">
                        {ref.program}
                      </span>
                      <span className="text-xs text-[#5f6368] tabular-nums">
                        {formatDate(ref.referred_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-[#dadce0] rounded-lg">
                <Users className="w-8 h-8 text-[#dadce0] mx-auto mb-2" />
                <p className="text-sm text-[#5f6368]">
                  No referrals yet. Share your link to get started!
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={10}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
            <p className="text-sm font-medium text-[#202124] mb-4">
              Frequently Asked Questions
            </p>
            <div className="space-y-4">
              {[
                {
                  q: "How much do I earn per referral?",
                  a: "You earn ₦200 for each friend who completes all 4 milestones: email verification, phone verification, wallet funding (₦100+), and their first transaction.",
                },
                {
                  q: "How long does it take to earn the reward?",
                  a: "Rewards are credited once your referred friend completes all 4 milestones. The referral link is valid for 7 days after they sign up.",
                },
                {
                  q: "Can I withdraw my earnings?",
                  a: "Yes! Your available balance can be withdrawn. Minimum withdrawal amount is ₦100.",
                },
                {
                  q: "Is there a limit to how many people I can refer?",
                  a: "No, there's no limit. The more friends you refer, the more you earn!",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="border-b border-[#e8eaed] last:border-b-0 pb-4 last:pb-0"
                >
                  <p className="font-medium text-sm text-[#202124] mb-1">
                    {item.q}
                  </p>
                  <p className="text-sm text-[#5f6368]">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
