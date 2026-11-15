import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel's adapter handles deployment output; Docker needs the standalone bundle.
  output: process.env.VERCEL === "1" ? undefined : "standalone",
};

export default nextConfig;
