/**
 * Country Flag Component
 * Displays country flags using Unicode emoji with proper styling for consistency
 */

import React from "react";

interface CountryFlagProps {
  code: string;
  countryName?: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

// Unicode flag emoji mapping for all countries
const FLAG_EMOJIS: Record<string, string> = {
  US: "🇺🇸",
  GB: "🇬🇧",
  CA: "🇨🇦",
  AU: "🇦🇺",
  DE: "🇩🇪",
  FR: "🇫🇷",
  NG: "🇳🇬",
  ZA: "🇿🇦",
  IN: "🇮🇳",
  JP: "🇯🇵",
  SG: "🇸🇬",
  HK: "🇭🇰",
  NZ: "🇳🇿",
  IE: "🇮🇪",
  NL: "🇳🇱",
  BE: "🇧🇪",
  CH: "🇨🇭",
  SE: "🇸🇪",
  NO: "🇳🇴",
  DK: "🇩🇰",
  FI: "🇫🇮",
  PL: "🇵🇱",
  CZ: "🇨🇿",
  HU: "🇭🇺",
  RO: "🇷🇴",
  GR: "🇬🇷",
  IT: "🇮🇹",
  ES: "🇪🇸",
  PT: "🇵🇹",
  AT: "🇦🇹",
  BR: "🇧🇷",
  MX: "🇲🇽",
  AR: "🇦🇷",
  CL: "🇨🇱",
  CO: "🇨🇴",
  PE: "🇵🇪",
  KR: "🇰🇷",
  TW: "🇹🇼",
  TH: "🇹🇭",
  MY: "🇲🇾",
  PH: "🇵🇭",
  ID: "🇮🇩",
  VN: "🇻🇳",
  AE: "🇦🇪",
  SA: "🇸🇦",
  QA: "🇶🇦",
  IL: "🇮🇱",
  EG: "🇪🇬",
  KE: "🇰🇪",
  GH: "🇬🇭",
  MA: "🇲🇦",
  TN: "🇹🇳",
  PK: "🇵🇰",
  BD: "🇧🇩",
  LK: "🇱🇰",
  RU: "🇷🇺",
  TR: "🇹🇷",
  UA: "🇺🇦",
  ZZ: "🌍", // Default/unknown
};

const sizeStyles = {
  sm: "text-lg", // 18px
  md: "text-2xl", // 24px
  lg: "text-4xl", // 36px
};

const emojiStyle = {
  fontFamily: "system-ui, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif",
  fontSmoothing: "antialiased" as const,
  WebkitFontSmoothing: "antialiased" as const,
};

export function CountryFlag({
  code,
  countryName,
  size = "md",
  showName = false,
  className = "",
}: CountryFlagProps) {
  const flagEmoji = FLAG_EMOJIS[code.toUpperCase()] || FLAG_EMOJIS.ZZ;

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      title={countryName || code}
    >
      <span 
        className={`${sizeStyles[size]} leading-none`} 
        style={emojiStyle}
        role="img" 
        aria-label={code}
      >
        {flagEmoji}
      </span>
      {showName && countryName && (
        <span className="text-sm font-medium text-gray-700">{countryName}</span>
      )}
    </div>
  );
}

/**
 * Get flag emoji directly without component wrapper
 * Useful for inline usage
 */
export function getFlagEmoji(countryCode: string): string {
  return FLAG_EMOJIS[countryCode.toUpperCase()] || FLAG_EMOJIS.ZZ;
}

/**
 * Flag badge component for display in lists/tables
 */
export function FlagBadge({
  code,
  countryName,
}: {
  code: string;
  countryName: string;
}) {
  const flagEmoji = FLAG_EMOJIS[code.toUpperCase()] || FLAG_EMOJIS.ZZ;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200 hover:border-gray-300 transition-colors">
      <span 
        className="text-xl leading-none" 
        style={emojiStyle}
        role="img" 
        aria-label={code}
      >
        {flagEmoji}
      </span>
      <span className="text-sm font-medium text-gray-900">{countryName}</span>
    </div>
  );
}

/**
 * Flag icon for use in table/list headers with country code
 */
export function FlagWithCode({
  code,
  countryName,
  size = "md",
}: {
  code: string;
  countryName: string;
  size?: "sm" | "md" | "lg";
}) {
  const flagEmoji = FLAG_EMOJIS[code.toUpperCase()] || FLAG_EMOJIS.ZZ;

  return (
    <div className="inline-flex items-center gap-2">
      <span 
        className={`${sizeStyles[size]} leading-none`} 
        style={emojiStyle}
        role="img" 
        aria-label={code}
      >
        {flagEmoji}
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{countryName}</span>
        <span className="text-xs text-gray-500">{code}</span>
      </div>
    </div>
  );
}
