import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // iOS-specific settings
  buildExcludes: [/middleware-manifest\.json$/],
  fallbacks: {
    document: "/offline",
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  // Use webpack for next-pwa compatibility
  turbopack: {},
  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
