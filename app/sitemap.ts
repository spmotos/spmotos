import type { MetadataRoute } from "next";
import { listMotos } from "@/lib/clickgarage/repository";
import { getSiteUrl } from "@/lib/env";
import { buildMotoDetailHref } from "@/lib/estoque-query";

/** Mesmo intervalo do feed: motos novas entram no sitemap em até 5 minutos. */
export const revalidate = 300;

const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/venda-sua-moto", priority: 0.6 },
  { path: "/contato", priority: 0.6 },
];

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const siteUrl = getSiteUrl();
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "/" ? "daily" : "monthly",
    priority,
  }));

  try {
    const motos = await listMotos({});
    const motoEntries: MetadataRoute.Sitemap = motos.map((moto) => ({
      url: `${siteUrl}${buildMotoDetailHref(moto.id)}`,
      lastModified: moto.atualizadoEm,
      changeFrequency: "weekly",
      priority: 0.8,
      images: moto.imagemPrincipal ? [moto.imagemPrincipal] : undefined,
    }));
    return [...staticEntries, ...motoEntries];
  } catch (error) {
    console.error("Sitemap: feed indisponível, publicando só páginas fixas", error);
    return staticEntries;
  }
};

export default sitemap;
