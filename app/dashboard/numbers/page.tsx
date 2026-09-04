"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useVirtualNumbers } from "@/hooks/useVirtualNumbers";
import { useWallet } from "@/hooks/useWallet";
import { useCredits } from "@/hooks/useCredits";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Clock,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  Filter,
  X,
  Loader2,
  Globe,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Flame,
  Heart,
  Shield,
  MessageSquare,
  Gamepad2,
  Ghost,
  Music,
  Monitor,
  SearchIcon,
  Smartphone as PhoneIcon,
  MessageCircle,
  ShoppingBag,
  Car,
  Tv,
  Wallet,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

const SERVICE_ICONS: Record<string, string> = {
  whatsapp: "/whatsapp.png",
  telegram: "/telegram.png",
  instagram: "/google.png",
  twitter: "/google.png",
  facebook: "/meta.png",
  tiktok: "/tiktok.png",
  snapchat: "/snapchat.png",
  tinder: "/google.png",
  bumble: "/google.png",
  discord: "/discord.png",
  signal: "/google.png",
  viber: "/google.png",
  wechat: "/google.png",
  line: "/google.png",
  kakaotalk: "/google.png",
  microsoft: "/google.png",
  google: "/google.png",
  apple: "/google.png",
  amazon: "/google.png",
  uber: "/uber.png",
  netflix: "/google.png",
  spotify: "/google.png",
  paypal: "/paypal.png",
  cashapp: "/google.png",
  other: "",
};

const CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "messaging", label: "Messaging" },
  { slug: "social", label: "Social" },
  { slug: "dating", label: "Dating" },
  { slug: "gaming", label: "Gaming" },
  { slug: "tech", label: "Tech" },
  { slug: "ecommerce", label: "Shopping" },
  { slug: "finance", label: "Finance" },
];

type Step = "service" | "country" | "confirm" | "success";

export default function NumbersPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    }>
      <NumbersContent />
    </Suspense>
  );
}

function NumbersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { services, servicesLoading, useCountries, usePricing, numbers, numbersLoading, orderNumber, isOrdering, stats } = useVirtualNumbers();
  const { balance } = useWallet();
  const { creditBalance } = useCredits();

  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [orderType, setOrderType] = useState<"activation" | "rent">("activation");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);

  const { data: countries, isLoading: countriesLoading } = useCountries(selectedService?.id || null);
  const { data: pricing, isLoading: pricingLoading } = usePricing(selectedService?.id || null, selectedCountry?.id || null);

  const creditPrice = orderType === "activation"
    ? pricing?.credit_price_activation ?? 0
    : pricing?.credit_price_rent_30d ?? 0;

  // Pre-select from URL params
  useEffect(() => {
    const serviceSlug = searchParams.get("service");
    if (serviceSlug && services) {
      const svc = services.find((s) => s.slug === serviceSlug);
      if (svc) {
        setSelectedService(svc);
        setStep("country");
      }
    }
  }, [searchParams, services]);

  const filteredServices = (services || []).filter((s) => {
    const matchesCategory = activeCategory === "all" || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectService = (service: any) => {
    setSelectedService(service);
    setStep("country");
  };

  const handleSelectCountry = (country: any) => {
    setSelectedCountry(country);
    setStep("confirm");
  };

  const handleOrder = async () => {
    if (!selectedService || !selectedCountry) return;

    const price = creditPrice;

    if (price && creditBalance < price) {
      toast.error("Insufficient credits. Please purchase more credits.");
      return;
    }

    try {
      const res = await orderNumber({
        service_id: selectedService.id,
        country_id: selectedCountry.id,
        type: orderType,
      });

      if (res?.success && res.data) {
        setResult(res.data);
        setStep("success");
      }
    } catch {
      // Error handled by mutation
    }
  };

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedId(Number(number));
    toast.success("Number copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resetFlow = () => {
    setStep("service");
    setSelectedService(null);
    setSelectedCountry(null);
    setResult(null);
    setSearchQuery("");
    setActiveCategory("all");
    router.push("/dashboard/numbers");
  };

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-[#f8f9fa]"
        style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
      >
        <AnimatePresence mode="wait">
          {/* ── STEP 1: Select Service ──────────────────────────────────────── */}
          {step === "service" && (
            <motion.div
              key="service"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-[22px] font-medium text-[#202124]">
                    Buy Virtual Number
                  </h1>
                </div>
                <p className="text-sm text-[#5f6368]">
                  Select a service to receive SMS verification codes
                </p>
              </div>

              {/* Search + Categories */}
              <div className="mb-6 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-[#e8eaed] rounded-lg focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`shrink-0 h-8 px-4 text-xs font-medium rounded-full border transition-colors ${
                        activeCategory === cat.slug
                          ? "bg-[#1a73e8] text-white border-[#1a73e8]"
                          : "bg-white text-[#5f6368] border-[#e8eaed] hover:border-[#dadce0]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services Grid */}
              {servicesLoading ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="animate-pulse rounded-lg border border-[#e8eaed] bg-white p-4">
                      <div className="h-12 w-12 bg-[#f1f3f4] rounded-xl mx-auto mb-3" />
                      <div className="h-3 bg-[#f1f3f4] rounded w-2/3 mx-auto" />
                    </div>
                  ))}
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center py-12 rounded-lg border border-[#e8eaed] bg-white">
                  <SearchIcon className="w-8 h-8 text-[#9aa0a6] mx-auto mb-3" />
                  <p className="text-sm text-[#5f6368]">No services found</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {filteredServices.map((service, i) => (
                    <motion.button
                      key={service.id}
                      variants={fadeUp}
                      custom={i}
                      initial="hidden"
                      animate="show"
                      onClick={() => handleSelectService(service)}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-[#e8eaed] bg-white hover:border-[#1a73e8] hover:shadow-[0_1px_6px_rgba(26,115,232,0.15)] transition-all group"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f8f9fa] group-hover:bg-[#e8f0fe] transition-colors overflow-hidden">
                        {SERVICE_ICONS[service.slug] ? (
                          <img
                            src={SERVICE_ICONS[service.slug]}
                            alt={service.name}
                            className="h-9 w-9 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                            }}
                          />
                        ) : null}
                        <span className={`text-3xl ${SERVICE_ICONS[service.slug] ? "hidden" : ""}`}>📱</span>
                      </div>
                      <span className="text-xs font-medium text-[#202124] text-center leading-tight">
                        {service.name}
                      </span>
                      <span className="text-[10px] text-[#9aa0a6] capitalize">
                        {service.category}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 2: Select Country ──────────────────────────────────────── */}
          {step === "country" && (
            <motion.div
              key="country"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-6">
                <button
                  onClick={() => setStep("service")}
                  className="flex items-center gap-1 text-sm text-[#1a73e8] hover:underline mb-3"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to services
                </button>
                <div className="flex items-center gap-3 mb-1">
                  {SERVICE_ICONS[selectedService?.slug] ? (
                    <img
                      src={SERVICE_ICONS[selectedService?.slug]}
                      alt={selectedService?.name}
                      className="h-9 w-9 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <span className={`text-3xl ${SERVICE_ICONS[selectedService?.slug] ? "hidden" : ""}`}>📱</span>
                  <div>
                    <h1 className="text-[22px] font-medium text-[#202124]">
                      {selectedService?.name}
                    </h1>
                    <p className="text-sm text-[#5f6368]">
                      Select a country for your number
                    </p>
                  </div>
                </div>
              </div>

              {countriesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse rounded-lg border border-[#e8eaed] bg-white p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-[#f1f3f4] rounded-lg" />
                        <div className="flex-1">
                          <div className="h-4 bg-[#f1f3f4] rounded w-1/2 mb-2" />
                          <div className="h-3 bg-[#f1f3f4] rounded w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(countries || []).map((country, i) => (
                    <motion.button
                      key={country.id}
                      variants={fadeUp}
                      custom={i}
                      initial="hidden"
                      animate="show"
                      onClick={() => handleSelectCountry(country)}
                      className="flex items-center gap-3 p-4 rounded-lg border border-[#e8eaed] bg-white hover:border-[#1a73e8] hover:shadow-[0_1px_6px_rgba(26,115,232,0.15)] transition-all text-left"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8f9fa] text-2xl shrink-0">
                        {country.flag_emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#202124]">
                          {country.name}
                        </p>
                        <p className="text-xs text-[#5f6368]">
                          {country.dial_code}
                        </p>
                      </div>
                      {country.pivot && (
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-[#202124]">
                            ₦{Number(country.pivot.activation_price).toLocaleString()}
                            <span className="text-xs text-[#5f6368] block">
                              ({country.pivot.credit_price_activation ?? 0} credits)
                            </span>
                          </p>
                          <p className="text-[10px] text-[#9aa0a6]">activation</p>
                        </div>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#9aa0a6] shrink-0" />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP 3: Confirm Order ──────────────────────────────────────── */}
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-lg mx-auto"
            >
              <div className="mb-6">
                <button
                  onClick={() => setStep("country")}
                  className="flex items-center gap-1 text-sm text-[#1a73e8] hover:underline mb-3"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to countries
                </button>
                <h1 className="text-[22px] font-medium text-[#202124] mb-1">
                  Confirm Purchase
                </h1>
                <p className="text-sm text-[#5f6368]">
                  Review your order before purchasing
                </p>
              </div>

              <div className="rounded-lg border border-[#e8eaed] bg-white p-6 mb-4">
                {/* Service + Country */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#e8eaed]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8f9fa] text-4xl">
                    {selectedCountry?.flag_emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-medium text-[#202124]">
                        {selectedService?.name}
                      </p>
                    </div>
                    <p className="text-sm text-[#5f6368]">
                      {selectedCountry?.name} · {selectedCountry?.dial_code}
                    </p>
                  </div>
                </div>

                {/* Order Type */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-[#202124] mb-3">
                    Select Type
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setOrderType("activation")}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        orderType === "activation"
                          ? "border-[#1a73e8] bg-[#f6fafe]"
                          : "border-[#e8eaed] hover:border-[#dadce0]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className={`w-4 h-4 ${orderType === "activation" ? "text-[#1a73e8]" : "text-[#5f6368]"}`} />
                        <span className="text-sm font-medium text-[#202124]">Activation</span>
                      </div>
                      <p className="text-xs text-[#5f6368] mb-2">
                        20 minutes access. One-time use.
                      </p>
                      <p className="text-lg font-semibold text-[#202124]">
                        {pricing?.credit_price_activation ?? 0} credits
                      </p>
                      <p className="text-xs text-[#5f6368]">
                        ₦{Number(pricing?.activation_price ?? 0).toLocaleString()}
                      </p>
                    </button>

                    <button
                      onClick={() => setOrderType("rent")}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        orderType === "rent"
                          ? "border-[#1a73e8] bg-[#f6fafe]"
                          : "border-[#e8eaed] hover:border-[#dadce0]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className={`w-4 h-4 ${orderType === "rent" ? "text-[#1a73e8]" : "text-[#5f6368]"}`} />
                        <span className="text-sm font-medium text-[#202124]">Rent (30 days)</span>
                      </div>
                      <p className="text-xs text-[#5f6368] mb-2">
                        Unlimited SMS for 30 days.
                      </p>
                      <p className="text-lg font-semibold text-[#202124]">
                        {pricing?.credit_price_rent_30d ?? 0} credits
                      </p>
                      <p className="text-xs text-[#5f6368]">
                        ₦{Number(pricing?.rent_price_30d ?? 0).toLocaleString()}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Credit Balance Check */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fa]">
                  <span className="text-sm text-[#5f6368]">Your Credits</span>
                  <span className="text-sm font-medium text-[#202124]">
                    {creditBalance.toLocaleString()} credits
                  </span>
                </div>

                {creditPrice > 0 && creditBalance < creditPrice && (
                  <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-[#fce8e6]">
                    <AlertCircle className="w-4 h-4 text-[#c5221f] shrink-0" />
                    <p className="text-xs text-[#c5221f]">
                      Insufficient credits. Please purchase more credits.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleOrder}
                disabled={
                  isOrdering ||
                  !pricing ||
                  creditBalance < creditPrice
                }
                className="w-full h-12 flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1765cc] disabled:bg-[#9aa0a6] disabled:cursor-not-allowed text-white rounded-lg font-medium text-sm transition-colors"
              >
                {isOrdering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Purchase Number
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ── STEP 4: Success ──────────────────────────────────────────────── */}
          {step === "success" && result && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto"
            >
              <div className="text-center mb-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f4ea] mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#137333]" />
                </div>
                <h1 className="text-[22px] font-medium text-[#202124] mb-1">
                  Number Purchased!
                </h1>
                <p className="text-sm text-[#5f6368]">
                  Copy the number below and use it for verification
                </p>
              </div>

              <div className="rounded-lg border border-[#e8eaed] bg-white p-6 mb-6">
                {/* Number Display */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-4xl">{result.country.flag_emoji}</span>
                    {SERVICE_ICONS[result.service?.slug] ? (
                      <img
                        src={SERVICE_ICONS[result.service?.slug]}
                        alt={result.service?.name}
                        className="h-10 w-10 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <span className={`text-3xl ${SERVICE_ICONS[result.service?.slug] ? "hidden" : ""}`}>📱</span>
                  </div>
                  <p className="text-2xl font-mono font-semibold text-[#202124] mb-1">
                    {result.number}
                  </p>
                  <p className="text-sm text-[#5f6368]">
                    {result.service?.name} · {result.country?.name}
                  </p>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => copyNumber(result.number)}
                  className="w-full h-12 flex items-center justify-center gap-2 border border-[#e8eaed] hover:bg-[#f8f9fa] rounded-lg font-medium text-sm text-[#202124] transition-colors mb-4"
                >
                  {copiedId === Number(result.number) ? (
                    <>
                      <Check className="w-4 h-4 text-[#137333]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Number
                    </>
                  )}
                </button>

                {/* Details */}
                <div className="space-y-3 p-4 rounded-lg bg-[#f8f9fa]">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#5f6368]">Type</span>
                    <span className="text-sm font-medium text-[#202124] capitalize">
                      {result.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#5f6368]">Amount Paid</span>
                    <span className="text-sm font-medium text-[#202124]">
                      ₦{Number(result.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#5f6368]">Expires</span>
                    <span className="text-sm font-medium text-[#202124]">
                      {result.time_remaining || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#5f6368]">New Balance</span>
                    <span className="text-sm font-medium text-[#137333]">
                      ₦{Number(result.new_balance).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetFlow}
                  className="flex-1 h-12 flex items-center justify-center gap-2 border border-[#e8eaed] hover:bg-[#f8f9fa] rounded-lg font-medium text-sm text-[#5f6368] transition-colors"
                >
                  Buy Another
                </button>
                <Link
                  href={`/dashboard/numbers/${result.id}`}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-[#1a73e8] hover:bg-[#1765cc] text-white rounded-lg font-medium text-sm transition-colors"
                >
                  View Number
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── My Numbers Section ──────────────────────────────────────────────── */}
        {step === "service" && (
          <motion.div
            className="mt-8"
            variants={fadeUp}
            custom={10}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-lg border border-[#e8eaed] bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-[#202124]">
                    My Numbers
                  </p>
                  <p className="text-xs text-[#5f6368] mt-0.5">
                    {numbers?.length || 0} total numbers
                  </p>
                </div>
              </div>

              {numbersLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg border border-[#e8eaed]">
                      <div className="h-10 w-10 bg-[#f1f3f4] rounded-lg" />
                      <div className="flex-1">
                        <div className="h-4 bg-[#f1f3f4] rounded w-1/3 mb-2" />
                        <div className="h-3 bg-[#f1f3f4] rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !numbers || numbers.length === 0 ? (
                <div className="text-center py-8">
                  <Smartphone className="w-8 h-8 text-[#9aa0a6] mx-auto mb-3" />
                  <p className="text-sm text-[#5f6368]">No numbers yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {numbers.slice(0, 5).map((number) => (
                    <Link
                      key={number.id}
                      href={`/dashboard/numbers/${number.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#e8eaed] hover:bg-[#f8f9fa] transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f8f9fa] shrink-0 text-lg">
                        {number.country.flag_emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#202124] truncate">
                            {number.number}
                          </p>
                          {number.unread_sms > 0 && (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1a73e8] px-1.5 text-[10px] font-semibold text-white">
                              {number.unread_sms}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5f6368]">
                          {number.service.name} · {number.country.name}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                            number.status === "active"
                              ? "bg-[#e6f4ea] text-[#137333]"
                              : number.status === "expired"
                              ? "bg-[#fef7e0] text-[#b06000]"
                              : "bg-[#f1f3f4] text-[#5f6368]"
                          }`}
                        >
                          {number.status}
                        </span>
                        {number.time_remaining && (
                          <p className="text-[10px] text-[#9aa0a6] mt-1">
                            {number.time_remaining}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#9aa0a6] group-hover:text-[#1a73e8] transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Zap icon component
function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
