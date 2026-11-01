import type { FC } from "react";
import { MotoDetailMissingModal, MotoDetailModal } from "@/components/MotoDetailModal";
import { getMotoById } from "@/lib/clickgarage/repository";
import { buildWhatsAppHrefForMotoLinks, motoPageUrl } from "@/lib/whatsapp";

interface InterceptedMotoPageProps {
  params: Promise<{ id: string }>;
}

/** Card clicado na home: abre a ficha em modal. Acesso direto cai em `app/motos/[id]`. */
const InterceptedMotoPage: FC<InterceptedMotoPageProps> = async ({ params }) => {
  const { id } = await params;
  const moto = await getMotoById(id);
  if (!moto) {
    return <MotoDetailMissingModal />;
  }
  const whatsappLinks = buildWhatsAppHrefForMotoLinks(moto, motoPageUrl(moto.id));
  return <MotoDetailModal moto={moto} whatsappLinks={whatsappLinks} />;
};

export default InterceptedMotoPage;
