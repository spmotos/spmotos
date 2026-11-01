import Image from "next/image";
import Link from "next/link";
import { copy } from "@/lib/copy";
import { formatCilindrada, formatKm, formatPriceCompact } from "@/lib/format";
import { PublicMotoListItem } from "@/lib/clickgarage/types";

interface MotoCardProps {
  moto: PublicMotoListItem;
  detailHref: string;
}

interface SpecIconProps {
  icon: "km" | "engine" | "year";
}

const SpecIcon: React.FC<SpecIconProps> = ({ icon }) => {
  if (icon === "km") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
        <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 13l4-4" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  if (icon === "engine") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
        <path
          d="M8 10h8v6H8zM10 7h4v3h-4zM6 12H4v4h2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
};

export const MotoCard: React.FC<MotoCardProps> = ({ moto, detailHref }) => {
  const cilindrada = formatCilindrada(moto.motor);
  const badge = moto.km === 0 ? copy.card.badgeNew : copy.card.badgeUsed;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone bg-surface shadow-sm focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 hover:border-accent">
      <div className="relative aspect-[4/3] bg-muted">
        {moto.imagemPrincipal ? (
          <Image
            src={moto.imagemPrincipal}
            alt={moto.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-moss">
            {copy.card.noPhoto}
          </div>
        )}
        <span className="absolute top-3 left-3 z-10 rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
          {badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-base font-bold text-page-foreground group-hover:text-moss">
          {/* Um link por card: o ::after cobre o card inteiro (uma parada de Tab, área de toque total). */}
          <Link
            href={detailHref}
            scroll={false}
            className="after:absolute after:inset-0 after:z-20 after:content-[''] focus-visible:outline-none"
          >
            {moto.titulo}
          </Link>
        </h3>
        <p className="text-price-fluid text-sale">{formatPriceCompact(moto.valorAnunciado)}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-moss">
          <span className="inline-flex items-center gap-1">
            <SpecIcon icon="km" />
            {formatKm(moto.km)}
          </span>
          {cilindrada ? (
            <span className="inline-flex items-center gap-1">
              <SpecIcon icon="engine" />
              {cilindrada}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <SpecIcon icon="year" />
            {moto.anoModelo}
          </span>
        </div>
        <span
          className="mt-auto inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-stone bg-muted px-4 py-2.5 text-sm font-semibold text-page-foreground group-hover:border-accent group-hover:text-accent"
          aria-hidden="true"
        >
          {copy.card.details}
          <span>→</span>
        </span>
      </div>
    </article>
  );
};
