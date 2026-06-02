"use client";

import React, { useState, useEffect } from "react";
import { usePayment } from "@/hooks/usePayment";
import PaymentService from "@/services/paymentService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Loader2, X, Wallet } from "lucide-react";
import type { WalletFundingModalProps } from "@/types/payment";

export const WalletFundingModal: React.FC<WalletFundingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isLoading, error, successMessage, initializePayment, clearError, clearSuccess } =
    usePayment();
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [useCustom, setUseCustom] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clear messages on modal close
  useEffect(() => {
    if (!isOpen) {
      setAmount(1000);
      setCustomAmount("");
      setUseCustom(false);
      setValidationError(null);
      clearError();
      clearSuccess();
    }
  }, [isOpen, clearError, clearSuccess]);

  const currentAmount = useCustom ? parseInt(customAmount) || 0 : amount;

  const validateAmount = (): boolean => {
    if (currentAmount < 100) {
      setValidationError("Minimum amount is ₦100");
      return false;
    }
    if (currentAmount > 10000000) {
      setValidationError("Maximum amount is ₦10,000,000");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handlePayment = async () => {
    if (!validateAmount()) return;

    const result = await initializePayment(currentAmount, {
      source: "wallet_funding",
      timestamp: new Date().toISOString(),
    });

    if (result.success && result.data?.authorization_url) {
      // Store reference and redirect
      PaymentService.storePaymentReference(result.data.reference);
      window.location.href = result.data.authorization_url;
    }
  };

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-xl">
        <CardHeader className="relative pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              <CardTitle>Fund Your Wallet</CardTitle>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <CardDescription>Add funds to your wallet using Paystack</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {validationError && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{validationError}</p>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
            </div>
          )}

          {/* Preset Amounts */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick amounts</label>
            <div className="grid grid-cols-3 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAmount(preset);
                    setUseCustom(false);
                    setValidationError(null);
                  }}
                  disabled={isLoading}
                  className={`p-3 rounded-lg border-2 transition-colors font-medium text-sm ${
                    !useCustom && amount === preset
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  ₦{preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <label htmlFor="customAmount" className="text-sm font-medium">
              Custom amount (NGN)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
              <Input
                id="customAmount"
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setUseCustom(true);
                  setValidationError(null);
                }}
                onFocus={() => setUseCustom(true)}
                placeholder="Enter custom amount"
                min="100"
                max="10000000"
                disabled={isLoading}
                className="pl-7 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500">
              Minimum: ₦100 • Maximum: ₦10,000,000
            </p>
          </div>

          {/* Current Amount Display */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total to fund</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {PaymentService.formatCurrency(currentAmount)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isLoading || currentAmount === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Fund Wallet
                </>
              )}
            </Button>
          </div>

          {/* Security Info */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>🔒 Secure payment powered by Paystack</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
