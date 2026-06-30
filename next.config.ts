// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const handlerPath = path.resolve(__dirname, "./utils/cacheHandler.cjs");

const nextConfig: NextConfig = {
  // 1. 👈 CRITICAL FIX: Isolates the build maps from Amplify's post-processing bundler
  output: "standalone",

  // 2. Keep your modern component architecture active
  cacheComponents: true,

  experimental: {
    // 3. Route component function hashes safely via S3
    cacheHandlers: isProd
      ? {
          default: handlerPath,
          remote: handlerPath,
          incremental: handlerPath,
        }
      : undefined,
  },
};

export default nextConfig;
