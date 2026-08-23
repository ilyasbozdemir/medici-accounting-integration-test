import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["medici", "mongoose", "mongodb-memory-server"],
};

export default nextConfig;
