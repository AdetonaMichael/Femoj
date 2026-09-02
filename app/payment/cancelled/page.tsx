"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { XCircle, ArrowLeft } from "lucide-react";

function PaymentCancelledContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  return (
    <DashboardLayout>
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
      >
        <div className="w-full max-w-md rounded-lg border border-[#e8eaed] bg-white p-8">
          <div className="text-center mb-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#fef7e0] mb-4">
              <XCircle className="w-8 h-8 text-[#b06000]" />
            </div>
            <h2 className="text-xl font-medium text-[#202124]">
              Payment Cancelled
            </h2>
            <p className="text-sm text-[#5f6368] mt-1">
              You have cancelled the payment. No funds were charged.
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3 bg-[#fef7e0]/50 p-4 rounded-lg border border-[#fef7e0] mb-6">
            <div>
              <p className="text-xs text-[#b06000] mb-1">Status</p>
              <p className="text-sm font-medium text-[#202124]">Cancelled</p>
            </div>
            {reference && (
              <div>
                <p className="text-xs text-[#b06000] mb-1">Reference</p>
                <p className="font-mono text-xs text-[#202124] break-all">
                  {reference}
                </p>
              </div>
            )}
            <p className="text-xs text-[#b06000] mt-2">
              Your card was not charged. You can try again anytime.
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-2 mb-6">
            <p className="text-sm font-medium text-[#202124]">Next steps:</p>
            <ul className="text-sm text-[#5f6368] space-y-1">
              <li>Go back to your dashboard</li>
              <li>Try the payment again whenever you&apos;re ready</li>
              <li>You can fund your wallet anytime</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.back()}
              className="w-full h-10 px-4 text-sm font-medium text-[#5f6368] border border-[#dadce0] rounded-md hover:bg-[#f8f9fa] transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={() => router.push("/dashboard/wallet")}
              className="w-full h-10 px-4 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1765cc] rounded-md transition-colors"
            >
              Go to Wallet
            </button>
          </div>
        </div>
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
