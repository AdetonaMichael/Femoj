"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePayment } from "@/hooks/usePayment";
import PaymentService from "@/services/paymentService";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Loader2, AlertCircle, Copy } from "lucide-react";
import type { PaymentStatus } from "@/types/payment";
import { toast } from "sonner";

interface PaymentInfo {
  reference: string;
  amount: number;
  status: string;
  paid_at: string;
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyPayment } = usePayment();

  const [status, setStatus] = useState<PaymentStatus>("verifying");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("failed");
        return;
      }

      try {
        const result = await verifyPayment(reference);

        if (result.success && result.data) {
          setPaymentInfo({
            reference: result.data.reference,
            amount: result.data.amount,
            status: result.data.status,
            paid_at: result.data.paid_at,
          });
          setStatus("success");
          PaymentService.clearStoredReference();

          // Auto-redirect after 5 seconds
          let countdown = 5;
          const timer = setInterval(() => {
            countdown -= 1;
            setRedirectCountdown(countdown);
            if (countdown <= 0) {
              clearInterval(timer);
              router.push("/dashboard");
            }
          }, 1000);

          return () => clearInterval(timer);
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("failed");
      }
    };

    verifyPaymentStatus();
  }, [searchParams, verifyPayment, router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Verifying State */}
        {status === "verifying" && (
          <Card className="w-full max-w-md">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="inline-block p-4 bg-blue-100 dark:bg-blue-950 rounded-full mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we verify your payment...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {status === "success" && paymentInfo && (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="inline-block p-4 bg-green-100 dark:bg-green-950 rounded-full mb-4 mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription>Your wallet has been credited</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Payment Details */}
              <div className="space-y-3 bg-gray-50 dark:bg-gray-950 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Transaction Reference
                  </span>
                  <button
                    onClick={() => copyToClipboard(paymentInfo.reference)}
                    className="flex items-center gap-2 text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="font-mono text-blue-600 dark:text-blue-400">
                      {paymentInfo.reference.slice(0, 15)}...
                    </span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount Paid</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    ₦{paymentInfo.amount.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300 text-xs font-semibold rounded-full">
                    {paymentInfo.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(paymentInfo.paid_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  ✨ Your wallet has been credited successfully. You can now use these funds for
                  purchases.
                </p>
              </div>

              {/* Redirect Info */}
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Redirecting to dashboard in{" "}
                  <span className="font-bold text-gray-900 dark:text-white">{redirectCountdown}s</span>
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/wallet")}
                    className="flex-1"
                  >
                    View Wallet
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <Card className="w-full max-w-md border-red-200 dark:border-red-800">
            <CardHeader className="text-center">
              <div className="inline-block p-4 bg-red-100 dark:bg-red-950 rounded-full mb-4 mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400">
                Verification Failed
              </CardTitle>
              <CardDescription>
                We couldn't verify your payment. Please contact support if the issue persists.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  If you were charged, the amount will be refunded to your card within 3-5
                  business days.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => router.push("/support")}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
