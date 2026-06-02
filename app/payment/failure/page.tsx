"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference");
  const reason = searchParams.get("reason");

  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="inline-block p-4 bg-red-100 dark:bg-red-950 rounded-full mb-4 mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl text-red-600 dark:text-red-400">
              Payment Failed
            </CardTitle>
            <CardDescription>
              Unfortunately, your payment could not be processed.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="space-y-3 bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
              {reference && (
                <div>
                  <p className="text-xs text-red-600 dark:text-red-400 mb-1">Reference</p>
                  <p className="font-mono text-sm text-red-900 dark:text-red-100 break-all">
                    {reference}
                  </p>
                </div>
              )}

              {reason && (
                <div>
                  <p className="text-xs text-red-600 dark:text-red-400 mb-1">Reason</p>
                  <p className="text-sm text-red-900 dark:text-red-100">{decodeURIComponent(reason)}</p>
                </div>
              )}

              {!reference && !reason && (
                <p className="text-sm text-red-900 dark:text-red-100">
                  No payment details available. The payment may have been cancelled or an error
                  occurred.
                </p>
              )}
            </div>

            {/* Important Info */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Important:</strong> Your account has NOT been charged. No funds were
                deducted from your card.
              </p>
            </div>

            {/* Suggested Actions */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                What you can do:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✓ Verify your card details and try again</li>
                <li>✓ Check with your bank if the card has any restrictions</li>
                <li>✓ Try a different payment method</li>
                <li>✓ Contact our support team for assistance</li>
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
                Try Again
              </Button>

              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-gray-600 hover:bg-gray-700"
              >
                Return to Dashboard
              </Button>

              <Button
                onClick={() => router.push("/support")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Contact Support
              </Button>
            </div>

            {/* Help Info */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p>
                If you continue to experience issues, please reach out to our support team at{" "}
                <a href="mailto:support@femoj.com" className="text-blue-600 hover:underline">
                  support@femoj.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentFailureContent />
    </Suspense>
  );
}
