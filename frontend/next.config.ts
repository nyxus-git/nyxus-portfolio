import type { NextConfig } from "next";

const backendOrigin = (
  process.env.NEXT_PUBLIC_API_URL || "https://api.rohanmane.dev/api"
).replace(/\/api\/?$/, "");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.rohanmane.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.onrender.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/images/:path*",
          destination: `${backendOrigin}/images/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
