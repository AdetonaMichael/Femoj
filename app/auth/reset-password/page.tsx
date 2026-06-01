import { Suspense } from "react";
import { ResetPasswordForm } from "./ResetPasswordForm";

function ResetPasswordLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f2f8] to-[#e8ebf5] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[#dde0ea] px-10 py-11 shadow-lg">
        <div className="flex justify-center mb-8">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="text-center mb-8">
          <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}