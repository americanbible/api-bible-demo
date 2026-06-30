// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const handlerPath = path.resolve(__dirname, "./utils/cacheHandler.cjs");

const nextConfig: NextConfig = {
  // 1. Keep your experimental component framework active
  cacheComponents: true,

  // 🛑 REMOVED: cacheHandler (singular)
  // 🛑 REMOVED: cacheMaxMemorySize

  experimental: {
    // 2. 👈 CRITICAL: Force Next.js to exclusively route component data via S3
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
