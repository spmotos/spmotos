import { MotoCard } from "@/components/MotoCard";
import { PublicMotoListItem } from "@/lib/clickgarage/types";
import { buildMotoDetailHref } from "@/lib/estoque-query";

interface MotoGridProps {
  motos: PublicMotoListItem[];
}

export const MotoGrid: React.FC<MotoGridProps> = ({ motos }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6 2xl:gap-7">
    {motos.map((moto, index) => (
      <MotoCard
        key={moto.id}
        moto={moto}
        detailHref={buildMotoDetailHref(moto.id)}
        priority={index === 0}
      />
    ))}
  </div>
);
