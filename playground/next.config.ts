import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Set by CI (actions/configure-pages) or leave empty for custom domain / local dev.
  basePath: process.env.NEXT_BASE_PATH || "",
  images: { unoptimized: true },
  transpilePackages: [
    "@handharr-labs/core",
    "@handharr-labs/ui-base-bronze",
    "@handharr-labs/ui-base-silver",
    "@handharr-labs/ui-base-gold",
    "@handharr-labs/ui-cikal-showcase",
    "@handharr-labs/ui-xpnsio",
    "@handharr-labs/web-client",
  ],
};

export default nextConfig;
