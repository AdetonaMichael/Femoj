"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import {
  Users,
  TrendingUp,
  CreditCard,
  Activity,
  Smartphone,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/useAdmin";
import { formatCurrency, formatDate } from "@/utils";

export default function AdminPage() {
  const { stats, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview and management
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {[
          {
            title: "Total Users",
            value: stats?.users?.total?.toLocaleString() ?? "0",
            change: `${stats?.users?.active ?? 0} active`,
            positive: true,
            icon: Users,
          },
          {
            title: "Total Revenue",
            value: formatCurrency(stats?.orders?.total_revenue ?? 0),
            change: `${stats?.orders?.total ?? 0} orders`,
            positive: true,
            icon: CreditCard,
          },
          {
            title: "Active Numbers",
            value: stats?.numbers?.active?.toLocaleString() ?? "0",
            change: `${stats?.numbers?.total ?? 0} total`,
            positive: true,
            icon: Smartphone,
          },
          {
            title: "Credit Balance",
            value: (stats?.credits?.total_credit_balance ?? 0).toLocaleString(),
            change: `${stats?.credits?.total_purchased ?? 0} purchased`,
            positive: true,
            icon: BarChart3,
          },
        ].map((card, idx) => (
          <motion.div key={idx} variants={staggerItem}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest platform transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recent_transactions?.slice(0, 5).map((tx: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {tx.transaction_type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.user?.first_name} {tx.user?.last_name} • {tx.reference}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(tx.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(tx.transaction_date)}
                    </p>
                  </div>
                </div>
              ))}
              {(!stats?.recent_transactions || stats.recent_transactions.length === 0) && (
                <p className="text-center text-muted-foreground py-8">
                  No recent transactions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
