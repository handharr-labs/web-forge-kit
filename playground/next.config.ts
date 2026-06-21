import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@handharr-labs/core",
    "@handharr-labs/ui-xpnsio",
    "@handharr-labs/web-client",
  ],
};

export default nextConfig;
