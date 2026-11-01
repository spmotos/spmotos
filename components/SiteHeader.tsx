import { Suspense } from "react";
import { HeaderContactBar } from "@/components/HeaderContactBar";
import { HeaderFrame } from "@/components/HeaderFrame";
import { HeaderNav } from "@/components/HeaderNav";
import { HeaderSearch } from "@/components/HeaderSearch";
import { copy } from "@/lib/copy";
import { buildWhatsAppHrefPlainLinks } from "@/lib/whatsapp";

const HeaderSearchFallback: React.FC = () => (
  <div className="hidden h-11 rounded-full border border-chrome-border lg:block lg:w-72 2xl:w-96" />
);

export const SiteHeader: React.FC = () => {
  const whatsappLinks = buildWhatsAppHrefPlainLinks(`Olá! Quero falar com a ${copy.brand}.`);

  return (
  <HeaderFrame>
    <HeaderContactBar whatsappLinks={whatsappLinks} />
    <div className="site-container flex flex-col gap-2 overflow-visible py-2 lg:flex-row lg:items-center lg:gap-6 lg:py-3 2xl:gap-8">
      <HeaderNav />
      <div className="hidden w-full items-center justify-end lg:flex lg:w-auto lg:shrink-0">
        <Suspense fallback={<HeaderSearchFallback />}>
          <HeaderSearch />
        </Suspense>
      </div>
    </div>
  </HeaderFrame>
  );
};
