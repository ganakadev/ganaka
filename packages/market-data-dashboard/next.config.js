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
    return config;
  },
  // Exclude Prisma from client bundle to avoid webpack cache warnings
  serverExternalPackages: ["@prisma/client", "prisma"],
};

module.exports = nextConfig;
