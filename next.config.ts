import type { NextConfig } from "next";

const devNextConfig: NextConfig = {
  cacheComponents: true,
};

//In production, enable custom-built S3 cache handler
const prodNextConfig: NextConfig = {
  cacheComponents: true,
  cacheHandlers: {
    default: require.resolve("./utils/cacheHandler.js"),
  },
  staticPageGenerationTimeout: 300,
};

const nextConfig: NextConfig =
  process.env.NODE_ENV === "development" ? devNextConfig : prodNextConfig;

export default nextConfig;
