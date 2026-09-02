"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useWallet } from "@/hooks/useWallet";
import { motion } from "framer-motion";
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
  Gift,
  History,
  Zap,
  Building2,
  Globe,
} from "lucide-react";

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
const iconWrap =
  "flex h-9 w-9 items-center justify-center rounded-md bg-[#e8f0fe] shrink-0";

type PaymentProvider = "paystack" | "international";

export default function WalletPage() {
  const [selectedBundle, setSelectedBundle] = useState<number | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>("paystack");
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false);

  const {
    balance,
    transactions,
    bundles,
    isLoading,
    balanceLoading,
    transactionsLoading,
    initializePurchase,
    isInitializing,
    error: walletError,
  } = useWallet();

  const handleSelectBundle = (bundleId: number) => {
    setSelectedBundle(bundleId);
    setShowPurchaseFlow(true);
  };

  const handleProceedToPayment = () => {
    if (!selectedBundle) {
      toast.error("Please select a credit bundle");
      return;
    }
    initializePurchase(selectedBundle, paymentProvider);
  };

  const handleGoBack = () => {
    setShowPurchaseFlow(false);
    setSelectedBundle(null);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div
          className="min-h-screen bg-white flex items-center justify-center"
          style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
        >
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
            Wallet
          </h1>
          <p className="mt-1 text-sm text-[#5f6368]">
            Purchase credits to use across the platform
          </p>
        </motion.div>

        {/* ── Balance card ────────────────────────────────────────────────── */}
        <motion.div
          className="mb-8"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                  Credit Balance
                </p>
                <p className="text-[36px] font-semibold text-[#202124] leading-tight mt-1">
                  {balance?.balance?.toLocaleString() ?? "0"}
                </p>
                <p className="text-sm text-[#5f6368] mt-1">
                  {formatCurrency(balance?.balance ?? 0)} available
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f0fe]">
                <Wallet className="w-6 h-6 text-[#1a73e8]" />
              </div>
            </div>

            {/* DVA Details */}
            {balance?.dva_details && (
              <div className="mt-4 pt-4 border-t border-[#e8eaed]">
                <p className="text-xs font-medium text-[#5f6368] uppercase tracking-wide mb-2">
                  Fund via Bank Transfer
                </p>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f9fa]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-[#e8eaed]">
                    <Building2 className="w-4 h-4 text-[#5f6368]" />
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

        {/* ── Error state ─────────────────────────────────────────────────── */}
        {walletError && (
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="mb-8"
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

        {/* ── Purchase flow ────────────────────────────────────────────────── */}
        {!showPurchaseFlow ? (
          /* Credit Bundles Selection */
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={iconWrap}>
                  <Package className="w-4 h-4 text-[#1a73e8]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#202124]">
                    Purchase Credits
                  </p>
                  <p className="text-xs text-[#5f6368]">
                    Select a credit bundle to get started
                  </p>
                </div>
              </div>

              {bundles && bundles.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {bundles.map((bundle) => (
                    <button
                      key={bundle.id}
                      onClick={() => handleSelectBundle(bundle.id)}
                      className="flex flex-col items-center p-4 rounded-lg border border-[#e8eaed] hover:border-[#1a73e8] hover:bg-[#f6fafe] transition-all text-left group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0fe] group-hover:bg-[#d2e3fc] transition-colors mb-3">
                        <Zap className="w-5 h-5 text-[#1a73e8]" />
                      </div>
                      <p className="text-[22px] font-semibold text-[#202124] leading-none">
                        {bundle.credits.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#5f6368] mt-1">credits</p>
                      <p className="text-sm font-medium text-[#1a73e8] mt-2">
                        {formatCurrency(bundle.price)}
                      </p>
                      {bundle.description && (
                        <p className="text-[11px] text-[#9aa0a6] mt-1 text-center">
                          {bundle.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-[#dadce0] rounded-lg">
                  <Package className="w-8 h-8 text-[#dadce0] mx-auto mb-2" />
                  <p className="text-sm text-[#5f6368]">
                    No credit bundles available at the moment.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Payment Provider Selection & Review */
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className={iconWrap}>
                  <CreditCard className="w-4 h-4 text-[#1a73e8]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#202124]">
                    Checkout
                  </p>
                  <p className="text-xs text-[#5f6368]">
                    Select payment method and review your order
                  </p>
                </div>
              </div>

              {/* Selected bundle summary */}
              {selectedBundle && bundles && (
                <div className="p-4 rounded-lg bg-[#f8f9fa] border border-[#e8eaed] mb-5">
                  {(() => {
                    const bundle = bundles.find((b) => b.id === selectedBundle);
                    if (!bundle) return null;
                    return (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0fe]">
                            <Zap className="w-5 h-5 text-[#1a73e8]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#202124]">
                              {bundle.name} Bundle
                            </p>
                            <p className="text-xs text-[#5f6368]">
                              {bundle.credits.toLocaleString()} credits
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-semibold text-[#202124]">
                          {formatCurrency(bundle.price)}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Payment provider selection */}
              <p className="text-xs font-medium text-[#5f6368] uppercase tracking-wide mb-3">
                Payment Method
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                <button
                  onClick={() => setPaymentProvider("paystack")}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                    paymentProvider === "paystack"
                      ? "border-[#1a73e8] bg-[#f6fafe]"
                      : "border-[#e8eaed] hover:border-[#dadce0] hover:bg-[#f8f9fa]"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#00b4d8]/10">
                    <Building2 className="w-5 h-5 text-[#00b4d8]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#202124]">
                      Local Payment
                    </p>
                    <p className="text-xs text-[#5f6368]">
                      Paystack — Card, Bank Transfer, USSD
                    </p>
                  </div>
                  {paymentProvider === "paystack" && (
                    <Check className="w-5 h-5 text-[#1a73e8] ml-auto shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => setPaymentProvider("international")}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                    paymentProvider === "international"
                      ? "border-[#1a73e8] bg-[#f6fafe]"
                      : "border-[#e8eaed] hover:border-[#dadce0] hover:bg-[#f8f9fa]"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#7c3aed]/10">
                    <Globe className="w-5 h-5 text-[#7c3aed]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#202124]">
                      International Payment
                    </p>
                    <p className="text-xs text-[#5f6368]">
                      Card payments worldwide
                    </p>
                  </div>
                  {paymentProvider === "international" && (
                    <Check className="w-5 h-5 text-[#1a73e8] ml-auto shrink-0" />
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="h-10 px-4 text-sm font-medium text-[#5f6368] border border-[#dadce0] rounded-md hover:bg-[#f8f9fa] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={isInitializing || !selectedBundle}
                  className="flex-1 h-10 px-4 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1765cc] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                >
                  {isInitializing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-[#9aa0a6]">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure payment powered by Paystack</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── How it works ────────────────────────────────────────────────── */}
        {!showPurchaseFlow && (
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
                    title: "Choose a bundle",
                    desc: "Select the credit package that suits your needs",
                    icon: Package,
                  },
                  {
                    step: "2",
                    title: "Pay securely",
                    desc: "Complete payment via Paystack (card, bank, USSD)",
                    icon: Shield,
                  },
                  {
                    step: "3",
                    title: "Start using credits",
                    desc: "Your credits are available instantly for all services",
                    icon: Zap,
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-lg border border-[#e8eaed]"
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
        )}

        {/* ── Transaction history ─────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={iconWrap}>
                  <History className="w-4 h-4 text-[#1a73e8]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#202124]">
                    Transaction History
                  </p>
                  <p className="text-xs text-[#5f6368]">
                    Recent wallet activity
                  </p>
                </div>
              </div>
            </div>

            {transactionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-[#1a73e8] animate-spin" />
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.map((txn) => {
                  const isCredit = txn.type === "credit";
                  return (
                    <div
                      key={txn.id}
                      className="flex items-center gap-4 px-4 py-3 rounded-md border border-[#e8eaed] hover:bg-[#f8f9fa] transition-colors"
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${
                          isCredit ? "bg-[#e6f4ea]" : "bg-[#fce8e6]"
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="w-4 h-4 text-[#137333]" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-[#c5221f]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#202124] truncate">
                          {txn.description}
                        </p>
                        <p className="text-xs text-[#5f6368]">
                          {formatDate(txn.created_at)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`text-sm font-medium tabular-nums ${
                            isCredit ? "text-[#137333]" : "text-[#c5221f]"
                          }`}
                        >
                          {isCredit ? "+" : "−"}
                          {txn.amount.toLocaleString()}
                        </p>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            txn.type === "credit"
                              ? "bg-[#e6f4ea] text-[#137333]"
                              : "bg-[#fce8e6] text-[#c5221f]"
                          }`}
                        >
                          {txn.type === "credit" ? "Credit" : "Debit"}
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
                  No transactions yet. Purchase credits to get started!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
