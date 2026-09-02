"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePayment } from "@/hooks/usePayment";
import { useWallet } from "@/hooks/useWallet";
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
  credits_added?: number;
  new_balance?: number;
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyPayment } = usePayment();
  const { verifyPurchase } = useWallet();

  const [status, setStatus] = useState<PaymentStatus>("verifying");
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyPaymentStatus = async () => {
      const reference = searchParams.get("reference");
      const trxref = searchParams.get("trxref");

      const paymentRef = reference || trxref;

      if (!paymentRef) {
        setStatus("failed");
        return;
      }

      try {
        // Try credit bundle verification first
        let bundleResult: any = null;
        try {
          bundleResult = await verifyPurchase(paymentRef);
        } catch {
          // Credit bundle verify failed, will try standard below
        }

        if (bundleResult?.success && bundleResult?.data) {
          setPaymentInfo({
            reference: bundleResult.data.reference || paymentRef,
            amount: bundleResult.data.amount || 0,
            status: bundleResult.data.status || "success",
            paid_at: new Date().toISOString(),
            credits_added: bundleResult.data.credits_added,
            new_balance: bundleResult.data.new_balance,
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
              router.push("/dashboard/wallet");
            }
          }, 1000);

          return () => clearInterval(timer);
        }

        // Fallback to standard payment verification
        try {
          const result = await verifyPayment(paymentRef);

          if (result.success && result.data) {
            setPaymentInfo({
              reference: result.data.reference || paymentRef,
              amount: result.data.amount,
              status: result.data.status,
              paid_at: result.data.paid_at,
              credits_added: (result.data as any).credits_added,
              new_balance: (result.data as any).new_balance,
            });
            setStatus("success");
            PaymentService.clearStoredReference();

            let countdown = 5;
            const timer = setInterval(() => {
              countdown -= 1;
              setRedirectCountdown(countdown);
              if (countdown <= 0) {
                clearInterval(timer);
                router.push("/dashboard/wallet");
              }
            }, 1000);

            return () => clearInterval(timer);
          }
        } catch {
          // Standard verify also failed
        }

        setStatus("failed");
      } catch (error) {
        setStatus("failed");
      }
    };

    verifyPaymentStatus();
  }, [searchParams]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <DashboardLayout>
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
      >
        {/* Verifying State */}
        {status === "verifying" && (
          <div className="w-full max-w-md rounded-lg border border-[#e8eaed] bg-white p-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f0fe] mb-4">
              <Loader2 className="w-8 h-8 text-[#1a73e8] animate-spin" />
            </div>
            <h2 className="text-xl font-medium text-[#202124] mb-2">
              Verifying Payment
            </h2>
            <p className="text-sm text-[#5f6368]">
              Please wait while we confirm your payment...
            </p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && paymentInfo && (
          <div className="w-full max-w-md rounded-lg border border-[#e8eaed] bg-white p-8">
            <div className="text-center mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f4ea] mb-4">
                <CheckCircle className="w-8 h-8 text-[#137333]" />
              </div>
              <h2 className="text-xl font-medium text-[#202124]">
                Payment Successful!
              </h2>
              <p className="text-sm text-[#5f6368] mt-1">
                {paymentInfo.credits_added
                  ? `${paymentInfo.credits_added.toLocaleString()} credits have been added to your wallet`
                  : "Your wallet has been credited"}
              </p>
            </div>

            {/* Payment Details */}
            <div className="space-y-3 bg-[#f8f9fa] p-4 rounded-lg mb-6">
              {paymentInfo.credits_added && (
                <div className="flex justify-between items-center pb-3 border-b border-[#e8eaed]">
                  <span className="text-sm text-[#5f6368]">Credits Added</span>
                  <span className="text-lg font-semibold text-[#137333]">
                    +{paymentInfo.credits_added.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-start">
                <span className="text-sm text-[#5f6368]">Reference</span>
                <button
                  onClick={() => copyToClipboard(paymentInfo.reference || "")}
                  className="flex items-center gap-1.5 text-xs font-mono text-[#1a73e8] hover:bg-white px-2 py-1 rounded transition-colors"
                >
                  {(paymentInfo.reference || "N/A").slice(0, 20)}...
                  <Copy className="w-3 h-3" />
                </button>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-[#5f6368]">Amount</span>
                <span className="text-sm font-medium text-[#202124]">
                  {paymentInfo.amount ? `₦${paymentInfo.amount.toLocaleString()}` : "N/A"}
                </span>
              </div>

              {paymentInfo.new_balance !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-[#5f6368]">New Balance</span>
                  <span className="text-sm font-medium text-[#137333]">
                    {paymentInfo.new_balance.toLocaleString()} credits
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm text-[#5f6368]">Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#e6f4ea] text-[#137333]">
                  SUCCESSFUL
                </span>
              </div>
            </div>

            {/* Redirect Info */}
            <p className="text-xs text-[#5f6368] text-center mb-4">
              Redirecting to wallet in{" "}
              <span className="font-medium text-[#202124]">{redirectCountdown}s</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/dashboard/wallet")}
                className="flex-1 h-10 px-4 text-sm font-medium text-[#1a73e8] border border-[#dadce0] rounded-md hover:bg-[#f8f9fa] transition-colors"
              >
                View Wallet
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 h-10 px-4 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1765cc] rounded-md transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Failed State */}
        {status === "failed" && (
          <div className="w-full max-w-md rounded-lg border border-[#fce8e6] bg-white p-8">
            <div className="text-center mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#fce8e6] mb-4">
                <AlertCircle className="w-8 h-8 text-[#c5221f]" />
              </div>
              <h2 className="text-xl font-medium text-[#c5221f]">
                Verification Failed
              </h2>
              <p className="text-sm text-[#5f6368] mt-1">
                We couldn&apos;t verify your payment. Please contact support if the issue persists.
              </p>
            </div>

            <div className="p-4 bg-[#fce8e6]/50 border border-[#fce8e6] rounded-lg mb-6">
              <p className="text-sm text-[#c5221f]">
                If you were charged, the amount will be refunded to your card within 3-5 business days.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/dashboard/wallet")}
                className="flex-1 h-10 px-4 text-sm font-medium text-[#5f6368] border border-[#dadce0] rounded-md hover:bg-[#f8f9fa] transition-colors"
              >
                Go to Wallet
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 h-10 px-4 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1765cc] rounded-md transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
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
