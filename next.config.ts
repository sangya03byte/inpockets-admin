import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

// Browser hardening for a privileged console. The browser only ever talks to THIS origin
// (the /api/backend proxy), so connect-src is 'self' and no CORS is needed.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cache-Control", value: "no-store" },
  ...(isProd
    ? [
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        {
          key: "Content-Security-Policy",
          value:
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  // Permit the development machine on the LAN to request Next.js HMR resources.
  // Keep this limited to known development hosts; do not use a wildcard.
  allowedDevOrigins: ["192.168.117.1"],
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
