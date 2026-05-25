"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input } from "@/components/ui";
import { MOCK_WALLET, MOCK_TRANSACTIONS } from "@/mock/data";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import {
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  TrendingUp,
  Eye,
  EyeOff,
  Download,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fundWalletSchema, withdrawalSchema } from "@/schemas";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/utils";
import { useState } from "react";

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState<"fund" | "withdraw">("fund");

  const fundForm = useForm({
    resolver: zodResolver(fundWalletSchema),
    defaultValues: { amount: 50, paymentMethod: "card" },
  });

  const withdrawForm = useForm({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { amount: 10, bankAccount: "" },
  });

  const onFund = async (data: any) => {
    toast.success(`Successfully funded wallet with ${formatCurrency(data.amount)}`);
    fundForm.reset();
  };

  const onWithdraw = async (data: any) => {
    toast.success(`Withdrawal request submitted for ${formatCurrency(data.amount)}`);
    withdrawForm.reset();
  };

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={staggerItem}>
          <h1 className="text-4xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your account balance and transactions
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div variants={staggerItem}>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-muted-foreground">
                    Available Balance
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2 mb-6">
                {showBalance ? (
                  <p className="text-5xl font-bold">
                    {formatCurrency(MOCK_WALLET.balance)}
                  </p>
                ) : (
                  <p className="text-5xl font-bold">••••••</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Available Credit
                  </p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(MOCK_WALLET.availableCredit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Pending Balance
                  </p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(MOCK_WALLET.pendingBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Last Updated
                  </p>
                  <p className="text-2xl font-semibold">
                    {formatDate(MOCK_WALLET.lastUpdated)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={staggerItem}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              size="lg"
              className="gap-2 h-auto py-4 justify-start"
              onClick={() => setActiveTab("fund")}
            >
              <Plus className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Fund Wallet</p>
                <p className="text-sm opacity-90">Add money to your account</p>
              </div>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 h-auto py-4 justify-start"
              onClick={() => setActiveTab("withdraw")}
            >
              <Minus className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Withdraw Funds</p>
                <p className="text-sm opacity-90">Cash out your balance</p>
              </div>
            </Button>
          </div>
        </motion.div>

        {/* Fund & Withdraw Forms */}
        {activeTab === "fund" && (
          <motion.div
            variants={staggerItem}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Fund Your Wallet</CardTitle>
                <CardDescription>
                  Add funds using your preferred payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={fundForm.handleSubmit(onFund)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="50.00"
                        className="pl-8"
                        {...fundForm.register("amount", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    {fundForm.formState.errors.amount && (
                      <p className="text-xs text-danger mt-1">
                        {fundForm.formState.errors.amount.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Payment Method
                    </label>
                    <select
                      className="input-base w-full"
                      {...fundForm.register("paymentMethod")}
                    >
                      <option value="card">Debit/Credit Card</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="paypal">PayPal</option>
                      <option value="crypto">Cryptocurrency</option>
                    </select>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Fee: </span>
                      <span className="text-muted-foreground">
                        2.5% + ${(0.3).toFixed(2)}
                      </span>
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Total to Pay: </span>
                      <span className="font-semibold">
                        {formatCurrency(
                          (fundForm.watch("amount") || 0) * 1.025 + 0.3
                        )}
                      </span>
                    </p>
                  </div>

                  <Button type="submit" fullWidth>
                    Proceed to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "withdraw" && (
          <motion.div
            variants={staggerItem}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>
                  Request to withdraw your balance to your bank account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={withdrawForm.handleSubmit(onWithdraw)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        $
                      </span>
                      <Input
                        type="number"
                        placeholder="10.00"
                        className="pl-8"
                        {...withdrawForm.register("amount", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    {withdrawForm.formState.errors.amount && (
                      <p className="text-xs text-danger mt-1">
                        {withdrawForm.formState.errors.amount.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bank Account
                    </label>
                    <select
                      className="input-base w-full"
                      {...withdrawForm.register("bankAccount")}
                    >
                      <option value="">Select account</option>
                      <option value="acc1">
                        •••••••••7890 - Main Account
                      </option>
                      <option value="acc2">
                        •••••••••5432 - Savings Account
                      </option>
                    </select>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium">Processing: </span>
                      <span className="text-muted-foreground">
                        1-3 business days
                      </span>
                    </p>
                    <p className="text-sm mt-2">
                      <span className="font-medium">You'll Receive: </span>
                      <span className="font-semibold">
                        {formatCurrency(
                          (withdrawForm.watch("amount") || 0) * 0.975
                        )}
                      </span>
                    </p>
                  </div>

                  <Button type="submit" fullWidth>
                    Request Withdrawal
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Transaction History */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    All your wallet transactions
                  </CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_TRANSACTIONS.map((txn) => (
                  <motion.div
                    key={txn.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`p-2 rounded-lg ${
                          txn.type === "credit"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {txn.type === "credit" ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">
                          {txn.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(txn.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          txn.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {txn.type === "credit" ? "+" : "-"}
                        {formatCurrency(txn.amount)}
                      </p>
                      <Badge
                        variant={
                          txn.status === "completed"
                            ? "success"
                            : "warning"
                        }
                        className="text-xs mt-1"
                      >
                        {txn.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
