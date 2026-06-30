// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const handlerPath = path.resolve(__dirname, "./utils/cacheHandler.cjs");

const nextConfig: NextConfig = {
  // 1. Maintain modern partial pre-rendering and component caching workflows
  cacheComponents: true,

  // 2. 👈 FIX FOR P.GET: Force Next.js to route the page structural shell via S3
  cacheHandler: isProd ? handlerPath : undefined,
  cacheMaxMemorySize: isProd ? 0 : undefined,

  experimental: {
    // 3. Force Next.js to route component function hashes directly to S3
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
