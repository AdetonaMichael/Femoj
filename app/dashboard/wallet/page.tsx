"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MOCK_WALLET, MOCK_TRANSACTIONS } from "@/mock/data";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Download,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fundWalletSchema, withdrawalSchema } from "@/schemas";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/utils";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface FundFormValues {
  amount: number;
  paymentMethod: string;
}

interface WithdrawFormValues {
  amount: number;
  bankAccount: string;
}

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

interface Wallet {
  balance: number;
  availableCredit: number;
  pendingBalance: number;
  lastUpdated: string | Date;
}

/* ─── Animation ───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: i * 0.06 },
  }),
};

const panelAnim = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

/* ─── Shared field styles ─────────────────────────────────────────────────── */
const fieldLabel =
  "block text-xs font-medium text-[#5f6368] uppercase tracking-wide mb-1.5";

const inputBase =
  "w-full h-9 px-3 text-sm rounded-md border border-[#dadce0] bg-white text-[#202124] placeholder:text-[#9aa0a6] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors";

const selectBase =
  "w-full h-9 px-3 text-sm rounded-md border border-[#dadce0] bg-white text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors";

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function WalletPage() {
  const wallet = MOCK_WALLET as Wallet;
  const transactions = MOCK_TRANSACTIONS as Transaction[];

  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<"fund" | "withdraw">("fund");

  const fundForm = useForm<FundFormValues>({
    resolver: zodResolver(fundWalletSchema),
    defaultValues: { amount: 50, paymentMethod: "card" },
  });

  const withdrawForm = useForm<WithdrawFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { amount: 10, bankAccount: "" },
  });

  const onFund = async (data: FundFormValues) => {
    toast.success(`Wallet funded with ${formatCurrency(data.amount)}`);
    fundForm.reset();
  };

  const onWithdraw = async (data: WithdrawFormValues) => {
    toast.success(`Withdrawal requested for ${formatCurrency(data.amount)}`);
    withdrawForm.reset();
  };

  const fundAmount = fundForm.watch("amount") || 0;
  const withdrawAmount = withdrawForm.watch("amount") || 0;

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-white space-y-6"
        style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
      >
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show">
          <h1 className="text-[22px] font-medium text-[#202124] tracking-tight">
            Wallet
          </h1>
          <p className="mt-1 text-sm text-[#5f6368]">
            Manage your balance and transactions.
          </p>
        </motion.div>

        {/* ── Balance + meta cards ─────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Main balance card */}
          <div className="lg:col-span-2 rounded-lg border border-[#e8eaed] bg-white p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wide">
                Available Balance
              </span>
              <button
                onClick={() => setShowBalance((v) => !v)}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#f1f3f4] transition-colors text-[#5f6368]"
                aria-label="Toggle balance visibility"
              >
                {showBalance ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-[40px] font-semibold text-[#202124] leading-none mt-3 mb-6 tabular-nums">
              {showBalance ? formatCurrency(wallet.balance) : "••••••"}
            </p>

            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-[11px] text-[#5f6368] uppercase tracking-wide mb-0.5">
                  Available Credit
                </p>
                <p className="text-base font-medium text-[#202124] tabular-nums">
                  {formatCurrency(wallet.availableCredit)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#5f6368] uppercase tracking-wide mb-0.5">
                  Pending
                </p>
                <p className="text-base font-medium text-[#202124] tabular-nums">
                  {formatCurrency(wallet.pendingBalance)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[#5f6368] uppercase tracking-wide mb-0.5">
                  Last Updated
                </p>
                <p className="text-base font-medium text-[#202124]">
                  {formatDate(wallet.lastUpdated)}
                </p>
              </div>
            </div>
          </div>

          {/* Quick action cards */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setActiveTab("fund")}
              className={`flex items-center gap-3 px-4 py-4 rounded-lg border transition-all text-left ${
                activeTab === "fund"
                  ? "border-[#1a73e8] bg-[#e8f0fe]"
                  : "border-[#e8eaed] bg-white hover:shadow-[0_1px_6px_rgba(32,33,36,.18)]"
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#e8f0fe]">
                <Plus className="w-4 h-4 text-[#1a73e8]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#202124]">
                  Fund Wallet
                </p>
                <p className="text-xs text-[#5f6368]">Add money to your account</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5f6368] shrink-0" />
            </button>

            <button
              onClick={() => setActiveTab("withdraw")}
              className={`flex items-center gap-3 px-4 py-4 rounded-lg border transition-all text-left ${
                activeTab === "withdraw"
                  ? "border-[#1a73e8] bg-[#e8f0fe]"
                  : "border-[#e8eaed] bg-white hover:shadow-[0_1px_6px_rgba(32,33,36,.18)]"
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#fce8e6]">
                <Minus className="w-4 h-4 text-[#c5221f]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#202124]">
                  Withdraw Funds
                </p>
                <p className="text-xs text-[#5f6368]">Cash out your balance</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5f6368] shrink-0" />
            </button>
          </div>
        </motion.div>

        {/* ── Fund / Withdraw form ─────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {activeTab === "fund" && (
            <motion.div
              key="fund"
              variants={panelAnim}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <div className="rounded-lg border border-[#e8eaed] bg-white">
                <div className="px-5 py-4 border-b border-[#e8eaed]">
                  <p className="text-sm font-medium text-[#202124]">
                    Fund Your Wallet
                  </p>
                  <p className="text-xs text-[#5f6368] mt-0.5">
                    Add funds using your preferred payment method
                  </p>
                </div>
                <div className="px-5 py-5">
                  <form
                    onSubmit={fundForm.handleSubmit(onFund)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {/* Amount */}
                    <div>
                      <label className={fieldLabel}>Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5f6368]">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="50.00"
                          className={`${inputBase} pl-7`}
                          {...fundForm.register("amount", { valueAsNumber: true })}
                        />
                      </div>
                      {fundForm.formState.errors.amount && (
                        <p className="text-xs text-[#c5221f] mt-1">
                          {fundForm.formState.errors.amount.message as string}
                        </p>
                      )}
                    </div>

                    {/* Payment method */}
                    <div>
                      <label className={fieldLabel}>Payment Method</label>
                      <select
                        className={selectBase}
                        {...fundForm.register("paymentMethod")}
                      >
                        <option value="card">Debit / Credit Card</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="paypal">PayPal</option>
                        <option value="crypto">Cryptocurrency</option>
                      </select>
                    </div>

                    {/* Fee summary */}
                    <div className="md:col-span-2 rounded-md bg-[#f8f9fa] border border-[#e8eaed] px-4 py-3 flex flex-wrap gap-6">
                      <div>
                        <p className="text-[11px] text-[#5f6368] uppercase tracking-wide mb-0.5">
                          Processing Fee
                        </p>
                        <p className="text-sm font-medium text-[#202124]">
                          2.5% + $0.30
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#5f6368] uppercase tracking-wide mb-0.5">
                          Total to Pay
                        </p>
                        <p className="text-sm font-semibold text-[#202124] tabular-nums">
                          {formatCurrency(fundAmount * 1.025 + 0.3)}
                        </p>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="h-9 px-6 text-sm font-medium rounded-md bg-[#1a73e8] hover:bg-[#1765cc] text-white transition-colors disabled:opacity-50"
                        disabled={fundForm.formState.isSubmitting}
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "withdraw" && (
            <motion.div
              key="withdraw"
              variants={panelAnim}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <div className="rounded-lg border border-[#e8eaed] bg-white">
                <div className="px-5 py-4 border-b border-[#e8eaed]">
                  <p className="text-sm font-medium text-[#202124]">
                    Withdraw Funds
                  </p>
                  <p className="text-xs text-[#5f6368] mt-0.5">
                    Transfer your balance to a bank account
                  </p>
                </div>
                <div className="px-5 py-5">
                  <form
                    onSubmit={withdrawForm.handleSubmit(onWithdraw)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  >
                    {/* Amount */}
                    <div>
                      <label className={fieldLabel}>Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#5f6368]">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="10.00"
                          className={`${inputBase} pl-7`}
                          {...withdrawForm.register("amount", { valueAsNumber: true })}
                        />
                      </div>
                      {withdrawForm.formState.errors.amount && (
                        <p className="text-xs text-[#c5221f] mt-1">
                          {withdrawForm.formState.errors.amount.message as string}
                        </p>
                      )}
                    </div>

                    {/* Bank account */}
                    <div>
                      <label className={fieldLabel}>Bank Account</label>
                      <select
                        className={selectBase}
                        {...withdrawForm.register("bankAccount")}
                      >
                        <option value="">Select account</option>
                        <option value="acc1">••••7890 — Main Account</option>
                        <option value="acc2">••••5432 — Savings Account</option>
                      </select>
                      {withdrawForm.formState.errors.bankAccount && (
                        <p className="text-xs text-[#c5221f] mt-1">
                          {withdrawForm.formState.errors.bankAccount.message as string}
                        </p>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="md:col-span-2 rounded-md bg-[#f8f9fa] border border-[#e8eaed] px-4 py-3 flex flex-wrap gap-6">
                      <div>
                        <p className="text-[11px] text-[#5f6368] uppercase tracking-wide mb-0.5">
                          Processing Time
                        </p>
                        <p className="text-sm font-medium text-[#202124]">
                          1–3 business days
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#5f6368] uppercase tracking-wide mb-0.5">
                          You'll Receive
                        </p>
                        <p className="text-sm font-semibold text-[#202124] tabular-nums">
                          {formatCurrency(withdrawAmount * 0.975)}
                        </p>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="h-9 px-6 text-sm font-medium rounded-md bg-[#1a73e8] hover:bg-[#1765cc] text-white transition-colors disabled:opacity-50"
                        disabled={withdrawForm.formState.isSubmitting}
                      >
                        Request Withdrawal
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Transaction history ──────────────────────────────────────────── */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show">
          <div className="rounded-lg border border-[#e8eaed] bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8eaed]">
              <div>
                <p className="text-sm font-medium text-[#202124]">
                  Transaction History
                </p>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  All wallet activity
                </p>
              </div>
              <button className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded border border-[#dadce0] text-[#1a73e8] hover:bg-[#f6fafe] transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
            </div>

            {/* Table column headers */}
            <div className="hidden md:grid grid-cols-[1fr_140px_110px_80px] gap-4 px-5 py-2.5 border-b border-[#e8eaed]">
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
                    className="grid grid-cols-1 md:grid-cols-[1fr_140px_110px_80px] gap-2 md:gap-4 items-center px-5 py-3.5 hover:bg-[#f8f9fa] transition-colors"
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
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
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