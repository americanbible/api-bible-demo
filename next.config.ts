// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const handlerPath = path.resolve(__dirname, "./utils/cacheHandler.cjs");

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheHandlers: isProd
    ? {
        default: handlerPath,
        remote: handlerPath,
        incremental: handlerPath,
      }
    : undefined,
};

export default nextConfig;
