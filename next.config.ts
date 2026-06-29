import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // cacheHandler: require.resolve("./utils/cacheHandler.cjs"),
  cacheMaxMemorySize: 0,
  // experimental: {
  //   cacheHandlers: {
  //     default: require.resolve("./utils/cacheHandler.cjs"),
  //   },
  // },
};

export default nextConfig;
