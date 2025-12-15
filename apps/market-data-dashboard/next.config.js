/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/charts",
      "@mantine/dates",
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    // Suppress webpack cache warnings about serializing big strings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        message: /Serializing big strings/,
      },
      {
        message: /webpack\.cache\.PackFileCacheStrategy/,
      },
      {
        message: /impacts deserialization performance/,
      },
    ];
    return config;
  },
  // Exclude Prisma from client bundle to avoid webpack cache warnings
  serverExternalPackages: ["@prisma/client", "prisma"],
};

module.exports = nextConfig;
