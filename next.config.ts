import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n.ts");

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    viewTransition: true,
  },
};

export default withNextIntl(nextConfig);
