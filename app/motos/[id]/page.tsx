import type { Metadata } from "next";
import type { FC } from "react";
import { notFound } from "next/navigation";
import { MotoDetailView } from "@/components/MotoDetailView";
import { PageShell } from "@/components/PageShell";
import { getMotoById } from "@/lib/clickgarage/repository";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppHrefForMotoLinks, motoPageUrl } from "@/lib/whatsapp";

export const revalidate = 300;

interface MotoDetailPageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: MotoDetailPageProps): Promise<Metadata> => {
  const { id } = await params;
  const moto = await getMotoById(id);
  if (!moto) {
    return { title: "Moto não encontrada", robots: { index: false } };
  }
  return {
    title: moto.titulo,
    description: `${moto.titulo} — ${formatPrice(moto.valorAnunciado)}`,
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
      <MotoDetailView moto={moto} whatsappLinks={whatsappLinks} />
    </PageShell>
  );
};

export default MotoDetailPage;
