"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button, Input } from "@/components/ui";
import { MOCK_NUMBERS, MOCK_COUNTRIES_EXTENDED } from "@/mock/data";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Globe,
  MessageSquare,
  Phone,
  Clock,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils";
import { toast } from "sonner";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface NumberCapabilities {
  sms: boolean;
  voice: boolean;
}

interface VirtualNumber {
  id: string;
  number: string;
  country: string;
  type: string;
  isActive: boolean;
  capabilities: NumberCapabilities;
  expiryDate: string | Date;
}

interface CountryPricing {
  temporary: number;
  permanent: number;
}

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  pricing: CountryPricing;
  numbersAvailable: number;
}

/* ─── Animation ───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

/* ─── Shared tokens ───────────────────────────────────────────────────────── */
const BLUE = "#1a73e8";
const BLUE_BG = "#e8f0fe";
const BORDER = "#e8eaed";
const TEXT_PRIMARY = "#202124";
const TEXT_SECONDARY = "#5f6368";

const capChip =
  "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#f1f3f4] text-[#5f6368]";

const marketplaceStats = [
  { label: "Countries", value: "150+" },
  { label: "Available Numbers", value: "50K+" },
  { label: "Avg. Uptime", value: "99.9%" },
  { label: "Active Users", value: "10K+" },
];

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function NumbersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const numbers = MOCK_NUMBERS as VirtualNumber[];
  const allCountries = MOCK_COUNTRIES_EXTENDED as Country[];

  const filteredCountries = allCountries.filter((c) => {
    const matchName = c.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchType = !selectedType; // extend when real filter logic exists
    return matchName && matchType;
  });

  const handlePurchase = (label: string) => {
    toast.success(`Successfully purchased: ${label}`);
  };

  const handleRenew = (number: string) => {
    toast.success(`Renewal requested for ${number}`);
  };

  return (
    <DashboardLayout>
      <div
        className="min-h-screen bg-white space-y-8"
        style={{ fontFamily: "'Google Sans', 'Roboto', sans-serif" }}
      >
        {/* ── Page header ─────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-[22px] font-medium text-[#202124] tracking-tight">
              Virtual Numbers
            </h1>
            <p className="mt-1 text-sm text-[#5f6368]">
              Buy, rent, and manage virtual numbers from around the world.
            </p>
          </div>
          <Button
            asChild
            className="h-9 px-4 text-sm bg-[#1a73e8] hover:bg-[#1765cc] text-white rounded-md gap-2 font-medium shadow-none w-fit"
          >
            <a href="#marketplace">
              <Plus className="w-4 h-4" />
              Buy Number
            </a>
          </Button>
        </motion.div>

        {/* ── My Numbers ──────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white">
            {/* Section header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8eaed]">
              <div>
                <p className="text-sm font-medium text-[#202124]">
                  My Numbers
                </p>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Your active and expired virtual numbers
                </p>
              </div>
            </div>

            {/* Table head */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_160px_100px] gap-4 px-5 py-2.5 border-b border-[#e8eaed]">
              {["Number", "Country", "Capabilities", "Expires", ""].map((h) => (
                <span
                  key={h}
                  className="text-[11px] font-medium text-[#5f6368] uppercase tracking-wide"
                >
                  {h}
                </span>
              ))}
            </div>

            <div className="divide-y divide-[#f1f3f4]">
              {numbers.map((number, i) => (
                <motion.div
                  key={number.id}
                  variants={fadeUp}
                  custom={i + 2}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_160px_100px] gap-3 md:gap-4 items-center px-5 py-3.5 hover:bg-[#f8f9fa] transition-colors"
                >
                  {/* Number + status */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#e8f0fe]">
                      <Globe className="w-4 h-4 text-[#1a73e8]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#202124]">
                        {number.number}
                      </p>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold mt-0.5 ${
                          number.isActive
                            ? "bg-[#e6f4ea] text-[#137333]"
                            : "bg-[#fef7e0] text-[#b06000]"
                        }`}
                      >
                        {number.isActive ? "Active" : "Expired"}
                      </span>
                    </div>
                  </div>

                  {/* Country */}
                  <span className="text-sm text-[#5f6368]">
                    {number.country}
                  </span>

                  {/* Capabilities */}
                  <div className="flex gap-1.5 flex-wrap">
                    {number.capabilities.sms && (
                      <span className={capChip}>
                        <MessageSquare className="w-3 h-3" />
                        SMS
                      </span>
                    )}
                    {number.capabilities.voice && (
                      <span className={capChip}>
                        <Phone className="w-3 h-3" />
                        Voice
                      </span>
                    )}
                  </div>

                  {/* Expiry */}
                  <div className="flex items-center gap-1.5 text-sm text-[#5f6368]">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    {formatDate(number.expiryDate)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRenew(number.number)}
                      className="h-7 px-3 text-xs font-medium rounded border border-[#dadce0] text-[#1a73e8] hover:bg-[#f6fafe] transition-colors"
                    >
                      Renew
                    </button>
                    <button className="flex h-7 w-7 items-center justify-center rounded hover:bg-[#f1f3f4] transition-colors text-[#5f6368]">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Marketplace stats bar ────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          custom={numbers.length + 2}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 rounded-lg border border-[#e8eaed] divide-x divide-[#e8eaed] bg-white overflow-hidden">
            {marketplaceStats.map((s) => (
              <div key={s.label} className="px-5 py-4 text-center">
                <p className="text-[22px] font-semibold text-[#202124]">
                  {s.value}
                </p>
                <p className="text-xs text-[#5f6368] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Number Marketplace ──────────────────────────────────────────── */}
        <motion.div
          id="marketplace"
          variants={fadeUp}
          custom={numbers.length + 3}
          initial="hidden"
          animate="show"
        >
          <div className="rounded-lg border border-[#e8eaed] bg-white">
            {/* Section header */}
            <div className="px-5 py-4 border-b border-[#e8eaed]">
              <p className="text-sm font-medium text-[#202124]">
                Number Marketplace
              </p>
              <p className="text-xs text-[#5f6368] mt-0.5">
                Browse and purchase numbers from available countries
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-b border-[#e8eaed]">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f6368]" />
                <input
                  type="text"
                  placeholder="Search country…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-sm rounded-md border border-[#dadce0] bg-white text-[#202124] placeholder:text-[#9aa0a6] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-9 px-3 text-sm rounded-md border border-[#dadce0] bg-white text-[#202124] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] transition-colors"
              >
                <option value="">All Types</option>
                <option value="temporary">Temporary (30 days)</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>

            {/* Country grid */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCountries.map((country, i) => (
                <motion.div
                  key={country.code}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  animate="show"
                  className="rounded-lg border border-[#e8eaed] bg-white hover:shadow-[0_1px_6px_rgba(32,33,36,.18)] transition-shadow flex flex-col"
                >
                  {/* Card header */}
                  <div className="flex items-start gap-3 px-4 pt-4 pb-3 border-b border-[#f1f3f4]">
                    <span className="text-2xl leading-none">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#202124] truncate">
                        {country.name}
                      </p>
                      <p className="text-xs text-[#5f6368]">
                        {country.dialCode}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#5f6368] shrink-0">
                      {country.numbersAvailable} avail.
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-2 divide-x divide-[#f1f3f4] px-0">
                    <div className="px-4 py-3">
                      <p className="text-[10px] font-medium text-[#5f6368] uppercase tracking-wide mb-1">
                        Temporary
                      </p>
                      <p className="text-sm font-semibold text-[#202124]">
                        {formatCurrency(country.pricing.temporary)}
                      </p>
                      <p className="text-[10px] text-[#5f6368]">30 days</p>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-[10px] font-medium text-[#5f6368] uppercase tracking-wide mb-1">
                        Permanent
                      </p>
                      <p className="text-sm font-semibold text-[#202124]">
                        {formatCurrency(country.pricing.permanent)}
                      </p>
                      <p className="text-[10px] text-[#5f6368]">/month</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 px-4 pb-4 pt-3 mt-auto">
                    <button
                      onClick={() =>
                        handlePurchase(`temporary from ${country.name}`)
                      }
                      className="flex-1 h-8 text-xs font-medium rounded border border-[#dadce0] text-[#1a73e8] hover:bg-[#f6fafe] transition-colors"
                    >
                      Rent
                    </button>
                    <button
                      onClick={() =>
                        handlePurchase(`permanent from ${country.name}`)
                      }
                      className="flex-1 h-8 text-xs font-medium rounded bg-[#1a73e8] text-white hover:bg-[#1765cc] transition-colors"
                    >
                      Buy
                    </button>
                  </div>
                </motion.div>
              ))}

              {filteredCountries.length === 0 && (
                <div className="col-span-full py-16 text-center text-sm text-[#5f6368]">
                  No countries match your search.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}