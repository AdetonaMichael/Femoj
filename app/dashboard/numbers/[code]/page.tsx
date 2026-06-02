"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CountryFlag } from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils";
import { useSupportedCountries, useAvailableNumbers } from "@/hooks/usePhoneNumbers";
import phoneNumberService from "@/lib/phoneNumberService";
import PaymentService from "@/services/paymentService";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Phone,
  MessageSquare,
  Globe,
  CreditCard,
  Wallet,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { pstack } from "../../../../public";
import Image from "next/image";


/* ─── Types ───────────────────────────────────────────────────────────────── */
type PurchaseType = "temporary" | "permanent";
type PaymentMethod = "wallet" | "checkout" | null;

interface NumberDetails {
  code: string;
  countryName: string;
  dialCode: string;
  numbersAvailable: number;
  sampleNumber: string;
  numberType: string;
  features: Array<{name: string}>;
  regions: Array<{region_name: string; region_type: string}>;
  pricing: {
    temporary: number;
    permanent: number;
  };
  currency: string;
  reservable: boolean;
}

interface PurchaseDetails {
  type: PurchaseType;
  price: number;
  duration: string;
  renewalPrice?: number;
  features: string[];
}

/* ─── Animation ───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/* ─── Design Tokens ───────────────────────────────────────────────────────── */
const BLUE = "#1a73e8";
const BLUE_BG = "#e8f0fe";
const GREEN = "#188038";
const GREEN_BG = "#e6f4ea";
const BORDER = "#e8eaed";
const TEXT_PRIMARY = "#202124";
const TEXT_SECONDARY = "#5f6368";
const HOVER_BG = "#f8f9fa";

/* ─── Features by Number Type ───────────────────────────────────────────────── */
const FEATURES: Record<PurchaseType, string[]> = {
  temporary: [
    "Valid for 30 days",
    "Incoming calls & SMS",
    "Automatic renewal available",
    "Cancel anytime before expiry",
    "Full number history access",
  ],
  permanent: [
    "Unlimited validity period",
    "Incoming calls & SMS",
    "Toll-free call support",
    "Priority customer support",
    "Number customization options",
    "Advanced analytics dashboard",
    "Automatic renewal",
  ],
};

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function NumberDetailsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const router = useRouter();
  const { code } = use(params);
  const [selectedType, setSelectedType] = useState<PurchaseType>("temporary");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countryData, setCountryData] = useState<NumberDetails | null>(null);
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { countries } = useSupportedCountries();

  // Get currently selected number object
  const getCurrentNumber = () => {
    const current = availableNumbers.find((num) => num.phone_number === selectedNumber) || null;
    console.log("[NumberDetailsPage] Current number selected:", {
      selectedNumber,
      numberObject: current,
      features: current?.features,
      regions: current?.region_information,
    });
    return current;
  };
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get available numbers for this country - fetch up to 50 numbers
        const response = await phoneNumberService.getAvailableNumbers({
          country_code: code.toLowerCase(),
          limit: 50,
        });

        console.log("[NumberDetailsPage] Full response:", response);

        // Handle nested response structure: response.data.data
        let numbersArray: any[] = [];
        
        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data) && Array.isArray((response.data as any).data)) {
          numbersArray = (response.data as any).data;
        } else if (Array.isArray(response.data)) {
          numbersArray = response.data;
        } else if (Array.isArray(response.results)) {
          numbersArray = response.results;
        } else if (Array.isArray(response.phone_numbers)) {
          numbersArray = response.phone_numbers;
        }

        console.log("[NumberDetailsPage] Numbers array:", numbersArray);

        if (!response.success || numbersArray.length === 0) {
          setError("No phone numbers available for this country");
          return;
        }

        // Store all available numbers
        setAvailableNumbers(numbersArray);

        // Extract country name from countries list
        const countryRecord = countries?.find((c: any) => c.code?.toUpperCase() === code.toUpperCase());
        const countryName = countryRecord?.name || code;
        
        // Get first number to extract all details
        const firstNumber = numbersArray[0];
        console.log("[NumberDetailsPage] First number:", firstNumber);
        
        if (!firstNumber || !firstNumber.phone_number) {
          setError("Invalid phone number data received");
          return;
        }

        // Set first number as default selected
        setSelectedNumber(firstNumber.phone_number);
        
        // Extract pricing info
        const upfrontCostUsd = parseFloat(firstNumber.cost_information?.upfront_cost || "9.99");
        const monthlyCostUsd = parseFloat(firstNumber.cost_information?.monthly_cost || "29.99");
        const currencyFromBackend = firstNumber.cost_information?.currency || "USD";
        
        console.log("[NumberDetailsPage] Pricing from backend:", {
          upfront_cost_raw: firstNumber.cost_information?.upfront_cost,
          monthly_cost_raw: firstNumber.cost_information?.monthly_cost,
          currency: currencyFromBackend,
          upfront_parsed: upfrontCostUsd,
          monthly_parsed: monthlyCostUsd,
        });
        
        // ✅ Note: Backend should convert these to NGN for payment
        // Currently backend returns USD, frontend should NOT convert
        // TODO: Backend needs to return NGN amounts for checkout
        
        const data: NumberDetails = {
          code: code.toUpperCase(),
          countryName: String(countryName),
          dialCode: firstNumber.phone_number?.substring(0, 3) || "+1",
          sampleNumber: firstNumber.phone_number || "N/A",
          numberType: firstNumber.phone_number_type || "local",
          features: firstNumber.features || [],
          regions: firstNumber.region_information || [],
          numbersAvailable: response.pagination?.total_available || numbersArray.length,
          pricing: {
            temporary: upfrontCostUsd,      // ✅ In USD from backend
            permanent: monthlyCostUsd * 12, // ✅ In USD from backend
          },
          currency: currencyFromBackend, // ✅ Will be "USD"
          reservable: firstNumber.reservable || false,
        };

        console.log("[NumberDetailsPage] Country data:", data);
        setCountryData(data);
      } catch (err: any) {
        console.error("Failed to fetch country data:", err);
        setError(err?.message || "Failed to load country data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchCountryData();
    }
  }, [code, countries]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600">Loading country details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !countryData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {error || "Country not found"}
            </h1>
            <p className="text-gray-600 mb-4">
              This country is not currently available.
            </p>
            <button
              onClick={() => router.push("/dashboard/numbers")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to marketplace
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const country = countryData;

  const purchaseDetails: PurchaseDetails = {
    type: selectedType,
    price:
      selectedType === "temporary"
        ? country.pricing.temporary
        : country.pricing.permanent,
    duration: selectedType === "temporary" ? "30 days" : "1 month",
    renewalPrice:
      selectedType === "permanent"
        ? country.pricing.permanent
        : country.pricing.temporary,
    features: FEATURES[selectedType],
  };

  const handlePayment = async (method: PaymentMethod) => {
    if (!method || !selectedNumber) {
      toast.error("Please select a number before proceeding");
      return;
    }

    console.log("[NumberDetailsPage] Processing payment:", {
      selectedNumber,
      paymentMethod: method,
      purchaseType: selectedType,
      price: purchaseDetails.price,
      currency: country.currency,
    });

    setIsProcessing(true);
    try {
      if (method === "wallet") {
        // ==========================================
        // Option 1: Purchase directly from wallet
        // ==========================================
        console.log("[NumberDetailsPage] Using wallet payment method");
        
        const response = await phoneNumberService.purchasePhoneNumber({
          phone_number: selectedNumber,
          friendly_name: `${country.countryName} ${selectedType === "temporary" ? "Temporary" : "Permanent"} Number`,
        });

        console.log("[NumberDetailsPage] Wallet purchase response:", response);

        if (response.success) {
          toast.success("Number purchased successfully with wallet!");
          router.push("/dashboard/numbers");
        } else {
          if (
            response.message?.toLowerCase().includes("unauthorized") ||
            response.message?.toLowerCase().includes("unauthenticated")
          ) {
            console.error("[NumberDetailsPage] Authentication error detected");
            toast.error("Your session has expired. Please log in again.");
            router.push("/auth/login");
          } else if (response.message?.toLowerCase().includes("insufficient")) {
            toast.error("Insufficient wallet balance. Please fund your wallet.");
          } else {
            toast.error(response.message || "Purchase failed. Please try again.");
          }
        }
      } else if (method === "checkout") {
        // ==========================================
        // Option 2: Purchase via Paystack card payment
        // ==========================================
        console.log("[NumberDetailsPage] Using Paystack card payment method");
        
        // ✅ Backend converts USD → NGN automatically
        // purchaseDetails.price is in USD from backend
        const usdAmount = Math.round(purchaseDetails.price * 100) / 100;
        const estimatedNgnAmount = Math.round(usdAmount * 1550);
        
        console.log("[NumberDetailsPage] Price conversion:", {
          priceInUsd: usdAmount,
          exchangeRate: 1550,
          estimatedNgnAmount: estimatedNgnAmount,
          displayAsNgn: formatCurrency(estimatedNgnAmount, "NGN"),
        });
        
        console.log("[NumberDetailsPage] Price from backend:", {
          amountUsd: usdAmount,
          originalCurrency: country.currency,
          note: "Backend will convert USD → NGN"
        });

        // Initialize Paystack direct checkout
        const checkoutResult = await PaymentService.initializeDirectCheckout({
          amount: usdAmount, // ✅ Send USD amount, backend will convert to NGN
          checkout_type: "services", // Virtual phone number service
          items: [
            {
              id: `phone_${country.code}`,
              name: `${country.countryName} - ${selectedNumber}`,
              quantity: 1,
              price: usdAmount, // ✅ Price in USD
            },
          ],
          description: `Purchase ${selectedType} virtual phone number for ${country.countryName}`,
          metadata: {
            phone_number: selectedNumber,
            country_code: country.code,
            country_name: country.countryName,
            purchase_type: selectedType,
            number_type: country.numberType,
            original_price_usd: usdAmount, // Track original for audit
          },
          channel: "card",
        });

        console.log("[NumberDetailsPage] Paystack checkout response:", checkoutResult);

        if (checkoutResult.success && checkoutResult.data?.authorization_url) {
          // ✅ Backend response now includes NGN amount
          const ngnAmount = checkoutResult.data.amount;
          console.log("[NumberDetailsPage] Checkout initialized with NGN amount:", {
            usdAmount,
            ngnAmount,
            displayNgn: formatCurrency(ngnAmount, "NGN"),
            reference: checkoutResult.data.reference
          });
          
          // Store reference in session for later verification
          sessionStorage.setItem("payment_reference", checkoutResult.data.reference);
          sessionStorage.setItem("payment_type", "phone_number");
          sessionStorage.setItem(
            "payment_metadata",
            JSON.stringify({
              phone_number: selectedNumber,
              country_code: country.code,
              purchase_type: selectedType,
              amount: purchaseDetails.price,
            })
          );

          console.log("[NumberDetailsPage] Redirecting to Paystack:", checkoutResult.data.authorization_url);
          
          // Redirect to Paystack checkout
          window.location.href = checkoutResult.data.authorization_url;
        } else {
          toast.error(
            checkoutResult.message || "Failed to initialize payment. Please try again."
          );
        }
      }
    } catch (error: any) {
      console.error("[NumberDetailsPage] Payment error:", error);

      // Check error type
      if (error.response?.status === 401 || error.message?.includes("401")) {
        console.error("[NumberDetailsPage] 401 Unauthorized - redirecting to login");
        toast.error("Session expired. Please log in again.");
        router.push("/auth/login");
      } else if (error.message?.toLowerCase().includes("no token")) {
        console.error("[NumberDetailsPage] No auth token found");
        toast.error("Authentication error. Please log in again.");
        router.push("/auth/login");
      } else {
        toast.error(error?.message || "Payment failed. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white space-y-6">
        {/* Back button */}
        <motion.button
          variants={fadeUp}
          initial="hidden"
          animate="show"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Numbers
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Number Info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 space-y-6"
          >
            {/* Country Header */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <CountryFlag code={country.code} size="lg" />
                <div className="flex-1">
                  <h1 className="text-3xl font-semibold text-gray-900">
                    {country.countryName}
                  </h1>
                  <p className="mt-1 text-lg text-gray-600">
                    {country.dialCode}
                  </p>
                  <div className="mt-4 flex items-center gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Available Numbers</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {country.numbersAvailable.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Number Details Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Your Number
              </h2>
              <div className="space-y-4">
                {/* Number Selection Dropdown */}
                <div>
                  <label className="text-sm text-gray-600 font-medium block mb-2">
                    Available Numbers ({availableNumbers.length})
                  </label>
                  <select
                    value={selectedNumber}
                    onChange={(e) => setSelectedNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-mono text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {availableNumbers.map((number, idx) => (
                      <option key={idx} value={number.phone_number}>
                        {number.phone_number}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Number Grid - Show first 5 numbers */}
                {availableNumbers.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-2">Quick Select (Showing {Math.min(5, availableNumbers.length)} of {availableNumbers.length})</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableNumbers.slice(0, 5).map((number, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedNumber(number.phone_number)}
                          className={`p-3 rounded-lg border-2 transition-all text-center font-mono text-sm font-semibold ${
                            selectedNumber === number.phone_number
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                          }`}
                        >
                          {number.phone_number}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Number Display */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-600 font-medium mb-1">Selected Number</p>
                  <p className="text-2xl font-mono font-bold text-blue-600">
                    {selectedNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Number Details Card */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Number Details
              </h2>
              <div className="space-y-4">
                {getCurrentNumber() ? (
                  <>
                    {/* Details for Selected Number */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-sm text-gray-600 font-medium mb-1">Details for Selected Number</p>
                      <p className="text-sm text-gray-700 mt-2">
                        This number is a <span className="font-semibold capitalize">{getCurrentNumber()?.phone_number_type || country.numberType}</span> number in {country.countryName} and is currently <span className={`font-semibold ${getCurrentNumber()?.reservable ? 'text-green-700' : 'text-orange-700'}`}>{getCurrentNumber()?.reservable ? "available for reservation" : "limited availability"}</span>.
                      </p>
                    </div>

                    {/* Region Information for Selected Number */}
                    {getCurrentNumber()?.region_information && getCurrentNumber()?.region_information.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 font-medium mb-3">Service Region</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {getCurrentNumber()?.region_information.map((region: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Globe className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 capitalize">{region.region_type.replace(/_/g, ' ')}</p>
                                <p className="text-sm font-medium text-gray-900 break-words">{region.region_name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-sm text-yellow-800">No details available. Please select a number.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Available Features */}
            {getCurrentNumber()?.features && getCurrentNumber()?.features.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Number Capabilities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {getCurrentNumber()?.features.map((feature: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                      <Check className="w-4 h-4 text-green-600 shrink-0" />
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {feature.name.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Type Selection */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Number Type
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Temporary Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType("temporary")}
                  className={`relative p-5 rounded-lg border-2 transition-all text-left ${
                    selectedType === "temporary"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Temporary</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        30-day rental period
                      </p>
                    </div>
                    {selectedType === "temporary" && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-3">
                    {formatCurrency(country.pricing.temporary, "USD")}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ≈ {formatCurrency(Math.round(country.pricing.temporary * 1550), "NGN")} at checkout
                  </p>
                </motion.button>

                {/* Permanent Option */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedType("permanent")}
                  className={`relative p-5 rounded-lg border-2 transition-all text-left ${
                    selectedType === "permanent"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Permanent</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Unlimited validity
                      </p>
                    </div>
                    {selectedType === "permanent" && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-3">
                    {formatCurrency(country.pricing.permanent, "USD")}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    ≈ {formatCurrency(Math.round(country.pricing.permanent * 1550), "NGN")} at checkout
                  </p>
                </motion.button>
              </div>
            </div>

            {/* Features */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What's Included
              </h2>
              <div className="space-y-3">
                {purchaseDetails.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What You Can Do
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">INCOMING CALLS</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {getCurrentNumber()?.features?.some((f: any) => f.name === 'voice') ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">SMS/INBOX</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {getCurrentNumber()?.features?.some((f: any) => f.name === 'sms') ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Checkout */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="rounded-lg border border-gray-200 bg-white p-6 sticky top-24 space-y-6">
              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  {/* Selected Number */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-gray-600 font-medium mb-1">Phone Number</p>
                    <p className="text-sm font-mono font-bold text-blue-600">{selectedNumber}</p>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {country.countryName} (
                      {selectedType === "temporary" ? "30 days" : "Annual"})
                    </span>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(purchaseDetails.price, "USD")}
                      </div>
                      <div className="text-xs text-gray-500">
                        ≈ {formatCurrency(Math.round(purchaseDetails.price * 1550), "NGN")} to pay
                      </div>
                    </div>
                  </div>
                  {selectedType === "permanent" && purchaseDetails.renewalPrice && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Then {formatCurrency(purchaseDetails.renewalPrice, "USD")}/month (≈ {formatCurrency(Math.round(purchaseDetails.renewalPrice * 1550), "NGN")})
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Total */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-gray-600 font-medium">Total (USD)</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(purchaseDetails.price, "USD")}
                  </span>
                </div>
                <div className="flex justify-between items-baseline p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                  <span className="text-gray-700 font-medium">You'll Pay (NGN)</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(Math.round(purchaseDetails.price * 1550), "NGN")}
                  </span>
                </div>
                {selectedType === "permanent" && (
                  <p className="text-xs text-gray-500">
                    First payment then auto-renew at {formatCurrency(purchaseDetails.renewalPrice ?? purchaseDetails.price, "USD")}/month
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Payment Methods */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Payment Method
                </h3>
                <div className="space-y-2">
                  {/* Wallet Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod("wallet")}
                    disabled={isProcessing}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      paymentMethod === "wallet"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Wallet Balance
                          </p>
                          <p className="text-xs text-gray-500">Instant</p>
                        </div>
                      </div>
                      {paymentMethod === "wallet" && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      ₦50,000.00
                    </p>
                  </motion.button>

                  {/* Card Option */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod("checkout")}
                    disabled={isProcessing}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      paymentMethod === "checkout"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            Credit/Debit Card
                          </p>
                          <p className="text-xs text-gray-500">Secure</p>
                        </div>
                      </div>
                      {paymentMethod === "checkout" && (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Alert */}
              {!paymentMethod && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    Select a payment method to continue
                  </p>
                </div>
              )}

              {/* Pay Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePayment(paymentMethod)}
                disabled={!paymentMethod || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay {formatCurrency(Math.round(purchaseDetails.price * 1550), "NGN")}
                  </>
                )}
              </motion.button>

              {/* Security Info */}
              <div className="text-center relative h-30">
                <Image src={pstack} alt="Pstack Secure" fill className="object-contain" />
              </div>
              
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
