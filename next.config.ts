// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const handlerPath = path.resolve(__dirname, "./utils/cacheHandler.cjs");

const nextConfig: NextConfig = {
  // 1. Keep the base option active
  cacheComponents: true,

  // 2. Direct core handler configuration
  cacheHandler: isProd ? handlerPath : undefined,
  cacheMaxMemorySize: isProd ? 0 : undefined,

  experimental: {
    // 3. 👈 ABSOLUTELY REQUIRED FOR CACHECOMPONENTS TO EVALUATE S3 STRINGS
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
