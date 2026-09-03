"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from "@/components/ui";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/animations";
import { Search, Loader2 } from "lucide-react";
import { useAdminNumbers } from "@/hooks/useAdmin";
import { formatDate } from "@/utils";

export default function NumbersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { numbers, isLoading } = useAdminNumbers({
    search: searchTerm || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    page,
  });

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={staggerItem}>
        <h1 className="text-4xl font-bold mb-2">Number Inventory</h1>
        <p className="text-muted-foreground">
          Manage virtual numbers and availability
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-col md:flex-row gap-4"
        variants={staggerItem}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search numbers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-border bg-background text-sm"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="released">Released</option>
        </select>
      </motion.div>

      {/* Numbers Table */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle>Numbers ({numbers?.total ?? 0})</CardTitle>
            <CardDescription>
              Virtual number inventory
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
                      <th className="text-left py-3 px-4 font-semibold">Number</th>
                      <th className="text-left py-3 px-4 font-semibold">User</th>
                      <th className="text-left py-3 px-4 font-semibold">Service</th>
                      <th className="text-left py-3 px-4 font-semibold">Country</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {numbers?.data?.map((number: any) => (
                      <tr
                        key={number.id}
                        className="border-b border-border hover:bg-muted transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-medium">
                          {number.number}
                        </td>
                        <td className="py-3 px-4">
                          {number.user?.first_name} {number.user?.last_name}
                        </td>
                        <td className="py-3 px-4">{number.service?.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span>{number.country?.flag_emoji}</span>
                            <span>{number.country?.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize">{number.type}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              number.status === "active"
                                ? "bg-green-100 text-green-800"
                                : number.status === "expired"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {number.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {number.expires_at ? formatDate(number.expires_at) : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {numbers?.last_page > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {numbers.current_page} of {numbers.last_page}
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
                    disabled={page >= numbers.last_page}
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
    </motion.div>
  );
}
