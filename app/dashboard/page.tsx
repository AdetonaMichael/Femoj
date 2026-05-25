"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Container } from "@/components/ui";
import { MOCK_DASHBOARD_STATS, MOCK_NUMBERS, MOCK_SMS_CONVERSATIONS, MOCK_TRANSACTIONS } from "@/mock/data";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import {
  CreditCard,
  Smartphone,
  Send,
  TrendingUp,
  Plus,
  Eye,
  MessageSquare,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/utils";

export default function DashboardPage() {
  const stats = MOCK_DASHBOARD_STATS;

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
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your account overview.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Wallet Balance */}
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Wallet Balance
                  </CardTitle>
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {formatCurrency(stats.totalBalance)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +${(Math.random() * 100).toFixed(2)} this month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Numbers */}
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Active Numbers
                  </CardTitle>
                  <Smartphone className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {stats.activeNumbers}
                </div>
                <Link
                  href="/dashboard/numbers"
                  className="text-xs text-primary hover:underline"
                >
                  View all numbers
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly SMS */}
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Monthly SMS
                  </CardTitle>
                  <Send className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {stats.monthlySMS}
                </div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Spending */}
          <motion.div variants={staggerItem}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Monthly Spending
                  </CardTitle>
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {formatCurrency(stats.monthlySpending)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Budget: {formatCurrency(500)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button className="gap-2" asChild>
                  <Link href="/dashboard/numbers">
                    <Plus className="w-4 h-4" />
                    Buy Number
                  </Link>
                </Button>
                <Button variant="outline" className="gap-2" asChild>
                  <Link href="/dashboard/sms">
                    <MessageSquare className="w-4 h-4" />
                    Send SMS
                  </Link>
                </Button>
                <Button variant="outline" className="gap-2" asChild>
                  <Link href="/dashboard/wallet">
                    <CreditCard className="w-4 h-4" />
                    Fund Wallet
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Numbers Overview */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={staggerContainer} initial="hidden" animate="show">
          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader>
                <CardTitle>Active Numbers</CardTitle>
                <CardDescription>
                  Your active virtual numbers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_NUMBERS.map((number) => (
                  <div
                    key={number.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {number.number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {number.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">
                        {number.type}
                      </Badge>
                      <Link href="/dashboard/numbers">
                        <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent SMS */}
          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader>
                <CardTitle>Recent SMS</CardTitle>
                <CardDescription>
                  Your latest conversations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_SMS_CONVERSATIONS.slice(0, 3).map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">
                        {conv.phoneNumber}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {conv.messageCount} messages
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <Badge variant="danger">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest wallet activities
                  </CardDescription>
                </div>
                <Link href="/dashboard/wallet" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_TRANSACTIONS.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
