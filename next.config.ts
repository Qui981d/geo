import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Security & Performance Headers ───
  // These headers improve SEO ranking (Google uses HTTPS and security as signals)
  // and protect against common web vulnerabilities
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent MIME-type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Enable XSS protection
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Control referrer info
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions policy — disable unnecessary browser APIs
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/:path(.+\\.(?:ico|png|jpg|jpeg|svg|webp|woff2|woff|css|js))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // ─── Image Optimization ───
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // ─── Compression ───
  compress: true,

  // ─── Powered-by header removal ───
  poweredByHeader: false,
};

export default nextConfig;
