import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable the dev toolbar indicator that shows git commit info at the bottom of the screen
  devIndicators: false,
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
};

export default nextConfig;
