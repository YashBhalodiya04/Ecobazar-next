import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // ✅ for Server Actions
    },
  },
  images: {
    domains: ['images.unsplash.com'], // ✅ Allow Unsplash
  },
};

export default nextConfig;
