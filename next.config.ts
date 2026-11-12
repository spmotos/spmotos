import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Celular na rede local / 127.0.0.1: sem isso o dev bloqueia JS client e o menu não abre. */
  allowedDevOrigins: ["127.0.0.1", "192.168.8.142"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          /** Geolocalização só para a rota "a partir da minha localização" (ContatoDirections). */
          {
            key: "Permissions-Policy",
            value: "geolocation=(self), camera=(), microphone=(), payment=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/estoque",
        destination: "/",
        permanent: true,
      },
      {
        source: "/vendidas",
        destination: "/",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    /** Fotos do Click Garage mudam de URL quando trocam; 30 dias evita reotimizar a cada 4 h. */
    minimumCacheTTL: 2_592_000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.clickgarage.com.br",
      },
      {
        protocol: "https",
        hostname: "clickgarage-prod.s3.us-west-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

/** Bindings da Cloudflare (R2, Images) disponíveis também no `next dev`. */
initOpenNextCloudflareForDev();
