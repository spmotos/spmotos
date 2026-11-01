import type { Metadata } from "next";
import type { FC } from "react";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/JsonLdScript";
import { MotoDetailView } from "@/components/MotoDetailView";
import { PageShell } from "@/components/PageShell";
import { getMotoById } from "@/lib/clickgarage/repository";
import { PublicMoto } from "@/lib/clickgarage/types";
import { copy } from "@/lib/copy";
import { buildMotoDetailHref } from "@/lib/estoque-query";
import { formatKm, formatPrice, formatYearRange } from "@/lib/format";
import { buildDefaultOpenGraph } from "@/lib/site-metadata";
import { buildMotoJsonLd } from "@/lib/structured-data";
import { buildWhatsAppHrefForMotoLinks, motoPageUrl } from "@/lib/whatsapp";

export const revalidate = 300;

interface MotoDetailPageProps {
  params: Promise<{ id: string }>;
}

/** Ex.: "HONDA SAHARA 300 2024, 12.000 Km, cor Vermelha, R$ 31.900". */
const buildMotoResumo = (moto: PublicMoto): string =>
  [
    `${moto.titulo.replace(/\s+\d{4}\b.*$/, "")} ${formatYearRange(moto.anoFabricacao, moto.anoModelo)}`,
    moto.km === 0 ? copy.card.badgeNew : formatKm(moto.km),
    moto.cor ? `cor ${moto.cor.toLowerCase()}` : null,
    formatPrice(moto.valorAnunciado),
  ]
    .filter(Boolean)
    .join(", ");

export const generateMetadata = async ({
  params,
}: MotoDetailPageProps): Promise<Metadata> => {
  const { id } = await params;
  const moto = await getMotoById(id);
  if (!moto) {
    return { title: "Moto não encontrada", robots: { index: false } };
  }
  const path = buildMotoDetailHref(moto.id);
  const description = copy.detail.metaDescription(buildMotoResumo(moto));
  return {
    title: moto.titulo,
    description,
    alternates: { canonical: path },
    openGraph: buildDefaultOpenGraph({
      title: `${moto.titulo} — ${formatPrice(moto.valorAnunciado)}`,
      description,
      url: path,
      /** Prévia do link no WhatsApp mostra a foto da moto. */
      ...(moto.imagemPrincipal
        ? { images: [{ url: moto.imagemPrincipal, alt: moto.titulo }] }
        : {}),
    }),
  };
};

const MotoDetailPage: FC<MotoDetailPageProps> = async ({ params }) => {
  const { id } = await params;
  const moto = await getMotoById(id);
  if (!moto) {
    notFound();
  }

  const whatsappLinks = buildWhatsAppHrefForMotoLinks(moto, motoPageUrl(moto.id));

  return (
    <PageShell>
      <JsonLdScript data={buildMotoJsonLd(moto)} />
      <MotoDetailView moto={moto} whatsappLinks={whatsappLinks} />
    </PageShell>
  );
};

export default MotoDetailPage;
