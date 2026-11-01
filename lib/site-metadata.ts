import type { Metadata } from "next";
import { copy } from "@/lib/copy";
import { getSiteUrl } from "@/lib/env";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

export const siteMetadataBase = (): URL => new URL(getSiteUrl());

/** Servida por `app/opengraph-image.jpg` (gerada em `npm run share:images`). */
const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: `${copy.brand} — loja de motos em Pelotas/RS`,
};

/**
 * `openGraph` de uma página substitui o herdado por inteiro (inclusive a imagem
 * do arquivo na raiz), então as páginas devem partir daqui.
 */
export const buildDefaultOpenGraph = (overrides: Partial<OpenGraph> = {}): OpenGraph => ({
  type: "website",
  locale: "pt_BR",
  siteName: copy.brand,
  title: copy.brand,
  description: copy.tagline,
  images: [DEFAULT_OG_IMAGE],
  ...overrides,
});

export const buildDefaultTwitter = (): NonNullable<Metadata["twitter"]> => ({
  card: "summary_large_image",
  title: copy.brand,
  description: copy.tagline,
});
