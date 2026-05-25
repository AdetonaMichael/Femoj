import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      black: "#000000",
      white: "#ffffff",
      slate: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
      },
      blue: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
      },
      green: {
        600: "#16a34a",
      },
      amber: {
        600: "#d97706",
      },
      red: {
        600: "#dc2626",
      },
      primary: "#0057ff",
      "primary-dark": "#0b1f4d",
      "primary-light": "#3b82f6",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444",
      info: "#3b82f6",
      foreground: "#000",
      background: "#fff",
      muted: "#6b7280",
      "muted-foreground": "#9ca3af",
      border: "#e5e7eb",
      input: "#e5e7eb",
      ring: "#0057ff",
      "card-background": "#f9fafb",
    },
    extend: {
      backgroundColor: {
        primary: "#0057ff",
        background: "#fff",
        border: "#e5e7eb",
        muted: "#6b7280",
        "card-background": "#f9fafb",
      },
      borderColor: {
        border: "#e5e7eb",
        primary: "#0057ff",
        DEFAULT: "#e5e7eb",
      },
      textColor: {
        foreground: "#000",
        "muted-foreground": "#9ca3af",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { "background-position": "-1000px 0" },
          "100%": { "background-position": "1000px 0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
