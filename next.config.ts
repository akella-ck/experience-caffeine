import type { NextConfig } from "next";

const staticExportEnabled = process.env.STATIC_EXPORT === "true";
const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: process.cwd(),
  ...(staticExportEnabled
    ? {
        output: "export" as const,
        trailingSlash: true,
        basePath: configuredBasePath,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
