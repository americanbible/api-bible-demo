import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheHandler: require.resolve("./utils/cacheHandler.cjs"),
  cacheHandlers: {
    default: require.resolve("./utils/cacheHandler.cjs"),
  },
  experimental: {
    cacheHandlers: {
      default: require.resolve("./utils/cacheHandler.cjs"),
    },
  },
  cacheMaxMemorySize: 0,
};

export default nextConfig;
