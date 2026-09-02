"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AlertCircle, ArrowLeft } from "lucide-react";

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference");
  const reason = searchParams.get("reason");

  return (
    <DashboardLayout>
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
      >
        <div className="w-full max-w-md rounded-lg border border-[#fce8e6] bg-white p-8">
          <div className="text-center mb-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#fce8e6] mb-4">
              <AlertCircle className="w-8 h-8 text-[#c5221f]" />
            </div>
            <h2 className="text-xl font-medium text-[#c5221f]">
              Payment Failed
            </h2>
            <p className="text-sm text-[#5f6368] mt-1">
              Unfortunately, your payment could not be processed.
            </p>
          </div>

          {/* Error Details */}
          <div className="space-y-3 bg-[#fce8e6]/50 p-4 rounded-lg border border-[#fce8e6] mb-6">
            {reference && (
              <div>
                <p className="text-xs text-[#c5221f] mb-1">Reference</p>
                <p className="font-mono text-sm text-[#202124] break-all">
                  {reference}
                </p>
              </div>
            )}
            {reason && (
              <div>
                <p className="text-xs text-[#c5221f] mb-1">Reason</p>
                <p className="text-sm text-[#202124]">
                  {decodeURIComponent(reason)}
                </p>
              </div>
            )}
            {!reference && !reason && (
              <p className="text-sm text-[#202124]">
                No payment details available. The payment may have been cancelled or an error occurred.
              </p>
            )}
          </div>

          {/* Important Info */}
          <div className="p-4 bg-[#fef7e0] border border-[#fef7e0] rounded-lg mb-6">
            <p className="text-sm text-[#b06000]">
              Your account has NOT been charged. No funds were deducted from your card.
            </p>
          </div>

          {/* Suggested Actions */}
          <div className="space-y-2 mb-6">
            <p className="text-sm font-medium text-[#202124]">
              What you can do:
            </p>
            <ul className="text-sm text-[#5f6368] space-y-1">
              <li>Verify your card details and try again</li>
              <li>Check with your bank if the card has any restrictions</li>
              <li>Try a different payment method</li>
              <li>Contact our support team for assistance</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.back()}
              className="w-full h-10 px-4 text-sm font-medium text-[#1a73e8] border border-[#dadce0] rounded-md hover:bg-[#f8f9fa] transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => router.push("/dashboard/wallet")}
              className="w-full h-10 px-4 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1765cc] rounded-md transition-colors"
            >
              Go to Wallet
            </button>
          </div>

          <div className="text-center text-xs text-[#9aa0a6] pt-4 border-t border-[#e8eaed] mt-4">
            <p>
              If you continue to experience issues, please reach out to{" "}
              <a href="mailto:support@femoj.com" className="text-[#1a73e8] hover:underline">
                support@femoj.com
              </a>
            </p>
          </div>
        </div>
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
