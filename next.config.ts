import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permit the development machine on the LAN to request Next.js HMR resources.
  // Keep this limited to known development hosts; do not use a wildcard.
  allowedDevOrigins: ["192.168.117.1"],
};

export default nextConfig;
