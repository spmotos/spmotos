import { PublicMoto } from "@/lib/clickgarage/types";
import { getSiteUrl } from "@/lib/env";
import { buildMotoDetailHref } from "@/lib/estoque-query";
import { formatPrice } from "@/lib/format";
import { buildContactLinksForText, WhatsAppContactLink } from "@/lib/store-whatsapp";

export const motoPageUrl = (id: string): string =>
  `${getSiteUrl()}${buildMotoDetailHref(id)}`;

const buildMotoInterestText = (moto: PublicMoto, pageUrl: string): string =>
  `Olá! Tenho interesse na ${moto.titulo} — ${formatPrice(moto.valorAnunciado)}. ${pageUrl}`;

export const buildWhatsAppHrefPlainLinks = (text: string): WhatsAppContactLink[] =>
  buildContactLinksForText(text);

export const buildWhatsAppHrefForMotoLinks = (
  moto: PublicMoto,
  pageUrl: string,
): WhatsAppContactLink[] => buildContactLinksForText(buildMotoInterestText(moto, pageUrl));
