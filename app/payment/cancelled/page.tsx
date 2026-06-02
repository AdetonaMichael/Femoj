"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft } from "lucide-react";

function PaymentCancelledContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference");

  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="inline-block p-4 bg-orange-100 dark:bg-orange-950 rounded-full mb-4 mx-auto">
              <XCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
            <CardDescription>
              You have cancelled the payment. No funds were charged.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Cancel Details */}
            <div className="space-y-3 bg-orange-50 dark:bg-orange-950/30 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Status</p>
                <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">Cancelled</p>
              </div>

              {reference && (
                <div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Reference</p>
                  <p className="font-mono text-xs text-orange-900 dark:text-orange-100 break-all">
                    {reference}
                  </p>
                </div>
              )}

              <p className="text-xs text-orange-700 dark:text-orange-200 mt-3">
                ✓ Your card was not charged. You can try again anytime.
              </p>
            </div>

            {/* Next Steps */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Next steps:</p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Go back to your dashboard</li>
                <li>• Try the payment again whenever you're ready</li>
                <li>• You can fund your wallet anytime</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>

              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentCancelledContent />
    </Suspense>
  );
}
