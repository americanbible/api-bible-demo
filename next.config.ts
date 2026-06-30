// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const handlerPath = path.resolve(__dirname, "./utils/cacheHandler.cjs");

const nextConfig: NextConfig = {
  // 1. Keeps modern partial pre-rendering and component caching workflows active
  cacheComponents: true,

  // 🛑 DELIBERATELY OMITTED: cacheHandler (singular) - MUST NOT BE SET
  // 🛑 DELIBERATELY OMITTED: cacheMaxMemorySize - MUST NOT BE SET

  experimental: {
    // 2. 👈 Route modern component function hashes directly to S3
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
