/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
        module: /./,
        message: /Serializing big strings.*impacts deserialization performance/,
      },
    ];
    return config;
  },
  // Exclude Prisma from client bundle to avoid webpack cache warnings
  serverExternalPackages: ["@prisma/client", "prisma"],
};

module.exports = nextConfig;
