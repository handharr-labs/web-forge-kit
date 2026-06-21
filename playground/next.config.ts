import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@handharr-labs/core",
    "@handharr-labs/ui-base-bronze",
    "@handharr-labs/ui-base-silver",
    "@handharr-labs/ui-base-gold",
    "@handharr-labs/ui-cikal",
    "@handharr-labs/ui-xpnsio",
    "@handharr-labs/web-client",
  ],
};

export default nextConfig;
