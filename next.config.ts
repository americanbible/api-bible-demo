import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheHandlers: {
    default: require.resolve("./utils/cacheHandler.js"),
  },
  cacheMaxMemorySize: 0,
};

export default nextConfig;
