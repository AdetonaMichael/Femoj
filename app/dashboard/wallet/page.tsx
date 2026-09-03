"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useWallet } from "@/hooks/useWallet";
import { useCredits } from "@/hooks/useCredits";
import { usePayment } from "@/hooks/usePayment";
import PaymentService from "@/services/paymentService";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, formatDate } from "@/utils";
import { useState } from "react";
import { toast } from "sonner";
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Check,
  ChevronRight,
  Loader2,
  AlertCircle,
  Package,
  Shield,
  Clock,
  Zap,
  Building2,
  X,
  Plus,
  Minus,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

export default function WalletPage() {
  const [showFundWallet, setShowFundWallet] = useState(false);
  const [fundAmount, setFundAmount] = useState<string>("");
  const [selectedBundle, setSelectedBundle] = useState<number | null>(null);

  const {
    balance,
    transactions,
    bundles,
    isLoading,
    transactionsLoading,
    initializePurchase,
    isInitializing,
    error: walletError,
  } = useWallet();

  const {
    creditBalance,
    balanceLoading: creditBalanceLoading,
  } = useCredits();

  const { isLoading: paymentLoading, initializePayment } = usePayment();

  const handleFundWallet = async () => {
    const amount = parseInt(fundAmount) || 0;
    if (amount < 100) {
      toast.error("Minimum amount is ₦100");
      return;
    }

    const result = await initializePayment(amount, {
      source: "wallet_funding",
      timestamp: new Date().toISOString(),
    });

    if (result.success && result.data?.authorization_url) {
      PaymentService.storePaymentReference(result.data.reference);
      window.location.href = result.data.authorization_url;
    } else {
      toast.error(result.message || "Failed to initialize payment. Please try again.");
    }
  };

  const handleBuyCredits = (bundleId: number) => {
    const bundle = bundles?.find((b) => b.id === bundleId);
    if (!bundle) return;

    if ((balance?.balance ?? 0) < bundle.price) {
      toast.error("Insufficient wallet balance. Fund your wallet first.");
      return;
    }

    setSelectedBundle(bundleId);
    initializePurchase(bundleId);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 text-[#1a73e8] animate-spin" />
            <p className="text-sm text-[#5f6368]">Loading wallet...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f8f9fa]">
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <motion.div
          className="mb-6"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <h1 className="text-[22px] font-medium text-[#202124] tracking-tight">
            Wallet & Credits
          </h1>
          <p className="mt-1 text-sm text-[#5f6368]">
            Manage your wallet balance and purchase credits for services
          </p>
        </motion.div>

        {/* ── Error state ─────────────────────────────────────────────────── */}
        {walletError && (
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="mb-6"
          >
            <div className="rounded-lg border border-[#fce8e6] bg-[#fce8e6]/50 p-5">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#c5221f] shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[#c5221f]">
                    Unable to load wallet data
                  </p>
                  <p className="text-xs text-[#5f6368] mt-0.5">
                    Please try refreshing the page.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            BALANCE CARDS
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
        >
          {/* Wallet Balance Card */}
          <div className="rounded-lg border border-[#e8eaed] bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                  Wallet Balance
                </p>
                <p className="text-[32px] font-semibold text-[#202124] leading-tight mt-1">
                  {formatCurrency(balance?.balance ?? 0)}
                </p>
                <p className="text-xs text-[#5f6368] mt-1">
                  Naira — Fund via Paystack or bank transfer
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f0fe]">
                <Wallet className="w-6 h-6 text-[#1a73e8]" />
              </div>
            </div>
            <button
              onClick={() => setShowFundWallet(!showFundWallet)}
              className="w-full h-10 px-4 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1765cc] rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Fund Wallet
            </button>
          </div>

          {/* Credit Balance Card */}
          <div className="rounded-lg border border-[#e8eaed] bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                  Credit Balance
                </p>
                <p className="text-[32px] font-semibold text-[#137333] leading-tight mt-1">
                  {creditBalanceLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    creditBalance.toLocaleString()
                  )}
                </p>
                <p className="text-xs text-[#5f6368] mt-1">
                  Credits — Use for virtual numbers & services
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e6f4ea]">
                <Zap className="w-6 h-6 text-[#137333]" />
              </div>
            </div>
            <div className="h-10 px-4 text-sm font-medium text-[#137333] bg-[#e6f4ea] rounded-lg inline-flex items-center justify-center gap-2 w-full">
              <Zap className="w-4 h-4" />
              Buy from wallet below
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            FUND WALLET SECTION
            ═══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showFundWallet && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="rounded-lg border border-[#e8eaed] bg-white p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0fe]">
                      <CreditCard className="w-5 h-5 text-[#1a73e8]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#202124]">
                        Fund Wallet
                      </p>
                      <p className="text-xs text-[#5f6368]">
                        Add Naira to your wallet via Paystack
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowFundWallet(false);
                      setFundAmount("");
                    }}
                    className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-[#5f6368]" />
                  </button>
                </div>

                {/* Preset amounts */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[500, 1000, 2000, 5000, 10000, 20000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setFundAmount(String(amt))}
                      className={`h-10 px-4 text-sm font-medium rounded-lg border transition-colors ${
                        fundAmount === String(amt)
                          ? "border-[#1a73e8] bg-[#f6fafe] text-[#1a73e8]"
                          : "border-[#e8eaed] hover:border-[#dadce0] text-[#202124]"
                      }`}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-[#5f6368] mb-2">
                    Or enter custom amount
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5f6368]">
                      ₦
                    </span>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      min={100}
                      className="w-full h-10 pl-7 pr-4 text-sm border border-[#e8eaed] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                    />
                  </div>
                  <p className="text-xs text-[#9aa0a6] mt-1">Minimum ₦100</p>
                </div>

                {/* Submit */}
                <button
                  onClick={handleFundWallet}
                  disabled={paymentLoading || !fundAmount || parseInt(fundAmount) < 100}
                  className="w-full h-11 px-4 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1765cc] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      Fund with Paystack
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 mt-3 text-xs text-[#9aa0a6]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secure payment powered by Paystack</span>
                </div>

                {/* DVA Bank Transfer */}
                {balance?.dva_details && (
                  <div className="mt-5 pt-5 border-t border-[#e8eaed]">
                    <p className="text-xs font-medium text-[#5f6368] uppercase tracking-wide mb-3">
                      Or Fund via Bank Transfer
                    </p>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-[#f8f9fa]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white border border-[#e8eaed]">
                        <Building2 className="w-5 h-5 text-[#5f6368]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#202124]">
                          {balance.dva_details.account_number}
                        </p>
                        <p className="text-xs text-[#5f6368]">
                          {balance.dva_details.bank_name} — {balance.dva_details.account_name}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(balance.dva_details!.account_number);
                          toast.success("Account number copied!");
                        }}
                        className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-[#1a73e8] hover:bg-white rounded-md border border-[#e8eaed] transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════════
            BUY CREDITS SECTION
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          className="mb-8"
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e8eaed] bg-[#f8f9fa]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f4ea]">
                  <Zap className="w-5 h-5 text-[#137333]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#202124]">
                    Buy Credits
                  </p>
                  <p className="text-xs text-[#5f6368]">
                    Purchase credits from your wallet balance
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {bundles && bundles.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {bundles.map((bundle) => {
                    const canAfford = (balance?.balance ?? 0) >= bundle.price;
                    const isPurchasing = selectedBundle === bundle.id && isInitializing;
                    return (
                      <button
                        key={bundle.id}
                        onClick={() => handleBuyCredits(bundle.id)}
                        disabled={!canAfford || isInitializing}
                        className={`flex flex-col items-center p-5 rounded-lg border transition-all ${
                          canAfford
                            ? "border-[#e8eaed] hover:border-[#137333] hover:bg-[#f0faf4] cursor-pointer"
                            : "border-[#e8eaed] bg-[#f8f9fa] opacity-60 cursor-not-allowed"
                        }`}
                      >
                        {isPurchasing ? (
                          <Loader2 className="w-8 h-8 text-[#137333] animate-spin mb-3" />
                        ) : (
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full mb-3 ${
                            canAfford ? "bg-[#e6f4ea]" : "bg-[#e8eaed]"
                          }`}>
                            <Zap className={`w-6 h-6 ${canAfford ? "text-[#137333]" : "text-[#9aa0a6]"}`} />
                          </div>
                        )}
                        <p className="text-[28px] font-semibold text-[#202124] leading-none">
                          {bundle.credits.toLocaleString()}
                        </p>
                        <p className="text-xs text-[#5f6368] mt-1">credits</p>
                        <p className={`text-sm font-medium mt-2 ${
                          canAfford ? "text-[#137333]" : "text-[#9aa0a6]"
                        }`}>
                          {formatCurrency(bundle.price)}
                        </p>
                        {bundle.description && (
                          <p className="text-[11px] text-[#9aa0a6] mt-1 text-center">
                            {bundle.description}
                          </p>
                        )}
                        {!canAfford && (
                          <p className="text-[10px] text-[#c5221f] mt-1">
                            Insufficient balance
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-[#dadce0] rounded-lg">
                  <Package className="w-10 h-10 text-[#dadce0] mx-auto mb-3" />
                  <p className="text-sm text-[#5f6368]">
                    No credit bundles available at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            HOW IT WORKS
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          custom={4}
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
                  title: "Fund Wallet",
                  desc: "Add Naira to your wallet via Paystack (card, bank transfer, USSD)",
                  icon: Wallet,
                  color: "bg-[#e8f0fe] text-[#1a73e8]",
                },
                {
                  step: "2",
                  title: "Buy Credits",
                  desc: "Purchase credit bundles from your wallet balance",
                  icon: Zap,
                  color: "bg-[#e6f4ea] text-[#137333]",
                },
                {
                  step: "3",
                  title: "Use Services",
                  desc: "Spend credits on virtual numbers, SMS, and other services",
                  icon: Shield,
                  color: "bg-[#fef7e0] text-[#b06000]",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-lg border border-[#e8eaed]"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
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

        {/* ═══════════════════════════════════════════════════════════════════
            TRANSACTION HISTORY
            ═══════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#e8f0fe]">
                <Clock className="w-4 h-4 text-[#1a73e8]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#202124]">
                  Recent Transactions
                </p>
                <p className="text-xs text-[#5f6368]">
                  Your wallet and credit activity
                </p>
              </div>
            </div>

            {transactionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-[#1a73e8] animate-spin" />
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.slice(0, 8).map((txn) => {
                  const isCredit = txn.type === "credit";
                  const isWalletFunding = txn.description?.includes("funding") || txn.description?.includes("DVA");
                  const isCreditPurchase = txn.description?.includes("Credit Bundle") || txn.description?.includes("credit");

                  let badge = "Debit";
                  let badgeColor = "bg-[#fce8e6] text-[#c5221f]";
                  let iconBg = "bg-[#fce8e6]";
                  let iconColor = "text-[#c5221f]";
                  let IconComponent = ArrowUpRight;

                  if (isCredit) {
                    if (isWalletFunding) {
                      badge = "Funded";
                      badgeColor = "bg-[#e8f0fe] text-[#1a73e8]";
                      iconBg = "bg-[#e8f0fe]";
                      iconColor = "text-[#1a73e8]";
                      IconComponent = ArrowDownLeft;
                    } else {
                      badge = "Credit";
                      badgeColor = "bg-[#e6f4ea] text-[#137333]";
                      iconBg = "bg-[#e6f4ea]";
                      iconColor = "text-[#137333]";
                      IconComponent = ArrowDownLeft;
                    }
                  } else if (isCreditPurchase) {
                    badge = "Purchased";
                    badgeColor = "bg-[#fef7e0] text-[#b06000]";
                    iconBg = "bg-[#fef7e0]";
                    iconColor = "text-[#b06000]";
                  }

                  return (
                    <div
                      key={txn.id}
                      className="flex items-center gap-4 px-4 py-3 rounded-md border border-[#e8eaed] hover:bg-[#f8f9fa] transition-colors"
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${iconBg}`}>
                        <IconComponent className={`w-4 h-4 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#202124] truncate">
                          {txn.description || "Transaction"}
                        </p>
                        <p className="text-xs text-[#5f6368]">
                          {formatDate(txn.created_at)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-medium tabular-nums ${
                          isCredit ? "text-[#137333]" : "text-[#c5221f]"
                        }`}>
                          {isCredit ? "+" : "−"}
                          {formatCurrency(txn.amount)}
                        </p>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${badgeColor}`}>
                          {badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-[#dadce0] rounded-lg">
                <Clock className="w-8 h-8 text-[#dadce0] mx-auto mb-2" />
                <p className="text-sm text-[#5f6368]">
                  No transactions yet. Fund your wallet to get started!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
