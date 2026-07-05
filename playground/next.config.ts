import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Set by CI (actions/configure-pages) or leave empty for custom domain / local dev.
  basePath: process.env.NEXT_BASE_PATH || "",
  images: { unoptimized: true },
  transpilePackages: [
    "@handharr-labs/forge-core",
    "@handharr-labs/forge-ui-base-bronze",
    "@handharr-labs/forge-ui-base-silver",
    "@handharr-labs/forge-ui-base-gold",
    "@handharr-labs/ui-cikal-showcase",
    "@handharr-labs/forge-ui-uno",
    "@handharr-labs/forge-ui-dos",
    "@handharr-labs/forge-web-client",
    "@handharr-labs/forge-auth",
  ],
};

export default nextConfig;
