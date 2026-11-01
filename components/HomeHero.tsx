import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "@/lib/brand";
import { copy } from "@/lib/copy";

const HeroChip: React.FC<{ label: string }> = ({ label }) => (
  <li className="grid grid-cols-[0.375rem_1fr] items-start gap-x-2.5 text-sm text-chrome-foreground/90 sm:grid-cols-[0.5rem_1fr] sm:gap-x-3 md:text-base lg:text-lg 2xl:text-xl">
    <span
      className="mt-[0.4375rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent sm:mt-2 sm:h-2 sm:w-2 md:mt-2.5"
      aria-hidden="true"
    />
    <span className="min-w-0 text-pretty">{label}</span>
  </li>
);

export const HomeHero: React.FC = () => (
  <section className="hero-banner relative isolate w-full overflow-hidden text-chrome-foreground">
    <div className="absolute inset-0">
      <Image
        src={brandAssets.heroBanner}
        alt={copy.home.heroBannerAlt}
        fill
        className="object-cover object-[var(--hero-banner-position)]"
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
      />
    </div>

    <div className="pointer-events-none absolute inset-0 bg-chrome/55 max-md:bg-chrome/60" aria-hidden="true" />
    <div
      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-chrome/90 via-chrome/50 to-chrome/15 max-md:from-chrome/92 max-md:via-chrome/65 max-md:to-chrome/25"
      aria-hidden="true"
    />

    <div className="site-container relative z-10 pb-32 pt-8 md:pt-10 lg:pt-12 2xl:pb-36">
      <div className="flex max-w-xl flex-col gap-4 text-left md:gap-5 2xl:max-w-2xl">
        <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-chrome-muted uppercase">
          {copy.home.heroKicker}
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
        </p>
        <p className="text-xs text-chrome-muted">{copy.contato.hours}</p>
        <h1 className="text-display font-bold tracking-tight">
          {copy.home.heroTitleLead}{" "}
          <span className="text-accent">{copy.home.heroTitleAccent}</span>
        </h1>
        <p className="max-w-prose text-base text-chrome-muted md:text-lg">{copy.home.heroBody}</p>
        <div>
          <Link
            href="#estoque"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-accent-cta px-6 py-3 text-sm font-bold focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-chrome focus-visible:outline-none"
          >
            {copy.home.heroCta}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className="flex max-w-md flex-col gap-3 pt-1 md:max-w-lg md:gap-3.5 lg:max-w-xl lg:gap-4 2xl:max-w-2xl">
          <HeroChip label={copy.home.heroChip1} />
          <HeroChip label={copy.home.heroChip2} />
          <HeroChip label={copy.home.heroChip3} />
          <HeroChip label={copy.home.heroChip4} />
        </ul>
      </div>
    </div>
  </section>
);
