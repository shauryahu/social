import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow serving large video assets
  experimental: {},
  // Images config — allow logo from local
  images: {
    unoptimized: false,
  },
  // Ensure headers set for video content-type
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, immutable" },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
    ];
  },
};

export default nextConfig;
