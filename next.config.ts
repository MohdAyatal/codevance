import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), "pyodide"];
    return config;
  },
};

export default nextConfig;
