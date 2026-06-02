import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.remopay.remonode.com",
      },
    ],
  },
};

export default nextConfig;
