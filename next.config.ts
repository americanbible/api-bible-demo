import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  output: "export",
  basePath: "/api-bible-demo",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
