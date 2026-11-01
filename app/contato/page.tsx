import type { Metadata } from "next";
import type { FC } from "react";
import { ContatoDirections } from "@/components/ContatoDirections";
import { StoreSocialLinks } from "@/components/StoreSocialLinks";
import { ContatoInfoCard } from "@/components/ContatoInfoCard";
import { StoreMapEmbed } from "@/components/StoreMapEmbed";
import { WhatsAppContactButtons } from "@/components/WhatsAppContactButtons";
import { PageShell } from "@/components/PageShell";
import { copy } from "@/lib/copy";
import { buildDefaultOpenGraph } from "@/lib/site-metadata";
import { buildWhatsAppHrefPlainLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: copy.contato.metaTitle,
  description: copy.contato.metaDescription,
  alternates: { canonical: "/contato" },
  openGraph: buildDefaultOpenGraph({
    title: copy.contato.metaTitle,
    description: copy.contato.metaDescription,
    url: "/contato",
  }),
};

const ContatoPage: FC = () => {
  const whatsappLinks = buildWhatsAppHrefPlainLinks(`Olá! Quero falar com a ${copy.brand}.`);

  return (
    <PageShell>
      <article className="flex w-full min-w-0 flex-col gap-8 2xl:gap-10">
        <header className="flex max-w-prose flex-col gap-3">
          <h1 className="text-display font-bold text-foreground">{copy.contato.title}</h1>
          <p className="leading-relaxed text-moss">{copy.contato.intro}</p>
        </header>

        <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 2xl:gap-14">
          <div className="flex min-w-0 flex-col gap-8">
            <ContatoInfoCard whatsappLinks={whatsappLinks} />
            <StoreSocialLinks />
            <ContatoDirections />
          </div>

          <section className="flex min-w-0 flex-col gap-3" aria-labelledby="contato-map-heading">
            <h2 id="contato-map-heading" className="text-section-title text-foreground">
              {copy.contato.mapHeading}
            </h2>
            <StoreMapEmbed />
          </section>
        </div>

        <footer className="border-t border-stone pt-6">
          <WhatsAppContactButtons links={whatsappLinks} action="negotiate" />
        </footer>
      </article>
    </PageShell>
  );
};

export default ContatoPage;
