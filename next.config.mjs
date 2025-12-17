/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        // Forces Turbopack to use the pro version automatically
        html2canvas: "html2canvas-pro",
      },
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      html2canvas: "html2canvas-pro",
    };
    return config;
  },
};

export default nextConfig;