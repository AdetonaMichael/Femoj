"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WalletFundingModal } from "@/components/payment/WalletFundingModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";

interface WalletTransaction {
  id: number;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export default function WalletPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  // Mock data - replace with actual API call
  const walletBalance = 45250;
  const currency = "NGN";

  const transactions: WalletTransaction[] = [
    {
      id: 1,
      type: "credit",
      amount: 10000,
      description: "Wallet Funding",
      date: "2026-06-02 10:30 AM",
      status: "completed",
    },
    {
      id: 2,
      type: "debit",
      amount: 5000,
      description: "Phone Number Purchase - UK",
      date: "2026-06-02 09:15 AM",
      status: "completed",
    },
    {
      id: 3,
      type: "credit",
      amount: 40250,
      description: "Wallet Funding",
      date: "2026-06-01 3:45 PM",
      status: "completed",
    },
    {
      id: 4,
      type: "debit",
      amount: 1000,
      description: "Temporary Phone Number - US",
      date: "2026-06-01 2:20 PM",
      status: "completed",
    },
  ];

  const getTransactionIcon = (type: "credit" | "debit") => {
    return type === "credit" ? (
      <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
        <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
      </div>
    ) : (
      <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
        <ArrowUpRight className="w-5 h-5 text-red-600 dark:text-red-400" />
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "pending":
        return "text-yellow-600 dark:text-yellow-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 space-y-8 p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your wallet balance and transactions</p>
            </div>
          </div>
        </motion.div>

        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-2 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-blue-700 dark:text-blue-300">
                    Available Balance
                  </CardDescription>
                  <div className="flex items-end gap-3 mt-2">
                    <h2 className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                      {hideBalance ? "••••••" : `₦${walletBalance.toLocaleString()}`}
                    </h2>
                    <span className="text-lg text-blue-600 dark:text-blue-400 mb-1">
                      {currency}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setHideBalance(!hideBalance)}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {hideBalance ? (
                      <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Fund Wallet</span>
                  </motion.button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₦{(50000).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-950 rounded-lg">
                  <ArrowDownLeft className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Debits</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ₦{(6000).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-950 rounded-lg">
                  <ArrowUpRight className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {transactions.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest wallet activity</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {getTransactionIcon(transaction.type)}

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {transaction.date}
                        </p>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p
                        className={`font-bold ${
                          transaction.type === "credit"
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {transaction.type === "credit" ? "+" : "-"}₦
                        {transaction.amount.toLocaleString()}
                      </p>
                      <p className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 <strong>Tip:</strong> Keep your wallet funded for seamless purchases. Wallet funds never expire and can
            be used for all purchases on our platform.
          </p>
        </motion.div>
      </div>

      {/* Wallet Funding Modal */}
      <WalletFundingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
}
