const DEFAULT_FEED_URL =
  "https://clickgarage.com.br/integracoes/site-integracao/json/sp-motos-1";

export const getClickGarageFeedUrl = (): string =>
  process.env.CLICKGARAGE_FEED_URL?.trim() || DEFAULT_FEED_URL;

/**
 * URL pública usada em metadata, sitemap e links enviados no WhatsApp.
 * Ordem: SITE_URL explícita → domínio de produção da Vercel → localhost (dev).
 */
export const getSiteUrl = (): string => {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/+$/, "");
  }
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) {
    return `https://${vercelProduction}`;
  }
  return "http://localhost:3000";
};
