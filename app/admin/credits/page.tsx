"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Search, Loader2, Plus, Minus } from "lucide-react";
import { useAdminCreditTransactions } from "@/hooks/useAdmin";
import { formatDate } from "@/utils";
import { toast } from "sonner";
import { adminService } from "@/services/adminService";
import { useQueryClient } from "@tanstack/react-query";

export default function CreditsPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustUserId, setAdjustUserId] = useState("");
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustDescription, setAdjustDescription] = useState("");
  const [isAdjusting, setIsAdjusting] = useState(false);
  const queryClient = useQueryClient();

  const { transactions, isLoading } = useAdminCreditTransactions({
    type: typeFilter !== "all" ? typeFilter : undefined,
    page,
  });

  const handleAdjustCredits = async () => {
    if (!adjustUserId || !adjustAmount || !adjustDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsAdjusting(true);
    try {
      await adminService.adjustCredits({
        user_id: Number(adjustUserId),
        amount: Number(adjustAmount),
        description: adjustDescription,
      });
      toast.success("Credits adjusted successfully");
      setAdjustModalOpen(false);
      setAdjustUserId("");
      setAdjustAmount("");
      setAdjustDescription("");
      queryClient.invalidateQueries({ queryKey: ["admin", "credit-transactions"] });
    } catch {
      toast.error("Failed to adjust credits");
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Credit Transactions</h1>
          <p className="text-muted-foreground">
            View and manage credit transactions
          </p>
        </div>
        <Button onClick={() => setAdjustModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Adjust Credits
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-col md:flex-row gap-4"
        variants={staggerItem}
      >
        <select
          className="px-4 py-2 rounded-lg border border-border bg-background text-sm"
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Types</option>
          <option value="credit_purchase">Credit Purchase</option>
          <option value="deduction">Deduction</option>
          <option value="refund">Refund</option>
          <option value="adjustment">Adjustment</option>
        </select>
      </motion.div>

      {/* Transactions Table */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({transactions?.total ?? 0})</CardTitle>
            <CardDescription>
              Credit transaction history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">User</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold">Balance</th>
                      <th className="text-left py-3 px-4 font-semibold">Description</th>
                      <th className="text-left py-3 px-4 font-semibold">Reference</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions?.data?.map((tx: any) => (
                      <tr
                        key={tx.id}
                        className="border-b border-border hover:bg-muted transition-colors"
                      >
                        <td className="py-3 px-4">
                          {tx.user?.first_name} {tx.user?.last_name}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              tx.type === "credit_purchase"
                                ? "bg-green-100 text-green-800"
                                : tx.type === "deduction"
                                ? "bg-red-100 text-red-800"
                                : tx.type === "refund"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {tx.type.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          <span className={tx.amount >= 0 ? "text-green-600" : "text-red-600"}>
                            {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {tx.balance_after?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground max-w-[200px] truncate">
                          {tx.description}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground font-mono text-xs">
                          {tx.reference}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {formatDate(tx.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {transactions?.last_page > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {transactions.current_page} of {transactions.last_page}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= transactions.last_page}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Adjust Credits Modal */}
      {adjustModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold mb-4">Adjust User Credits</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">User ID</label>
                <Input
                  type="number"
                  placeholder="Enter user ID"
                  value={adjustUserId}
                  onChange={(e) => setAdjustUserId(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Amount (positive to add, negative to deduct)
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  placeholder="Enter description"
                  value={adjustDescription}
                  onChange={(e) => setAdjustDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setAdjustModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdjustCredits}
                  disabled={isAdjusting}
                >
                  {isAdjusting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Adjust
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
