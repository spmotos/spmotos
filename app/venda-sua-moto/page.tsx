import type { Metadata } from "next";
import type { FC } from "react";
import { ConsignacaoVideo } from "@/components/ConsignacaoVideo";
import { WhatsAppContactButtons } from "@/components/WhatsAppContactButtons";
import { PageShell } from "@/components/PageShell";
import { copy } from "@/lib/copy";
import { buildDefaultOpenGraph } from "@/lib/site-metadata";
import { buildWhatsAppHrefPlainLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: copy.venda.metaTitle,
  description: copy.venda.metaDescription,
  alternates: { canonical: "/venda-sua-moto" },
  openGraph: buildDefaultOpenGraph({
    title: copy.venda.metaTitle,
    description: copy.venda.metaDescription,
    url: "/venda-sua-moto",
  }),
};

const VendaSuaMotoPage: FC = () => {
  const whatsappLinks = buildWhatsAppHrefPlainLinks(copy.venda.whatsappPrefill);

  return (
    <PageShell width="prose">
      <article className="flex w-full min-w-0 flex-col gap-8">
        <header className="flex flex-col gap-4">
          <h1 className="text-display font-bold text-foreground">{copy.venda.title}</h1>
          <p className="text-lg font-medium leading-relaxed text-foreground">{copy.venda.lead}</p>
        </header>

        <section
          className="flex flex-col gap-4 rounded-xl border border-stone bg-surface p-5 shadow-sm"
          aria-labelledby="venda-services-heading"
        >
          <h2 id="venda-services-heading" className="text-section-title text-foreground">
            {copy.venda.servicesHighlightTitle}
          </h2>
          <ul className="flex flex-col gap-2 text-pretty text-moss">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {copy.venda.servicesHighlightConsorcio}
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {copy.venda.servicesHighlightFinanciamento}
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-3" aria-labelledby="venda-video-heading">
          <h2 id="venda-video-heading" className="text-section-title text-foreground">
            {copy.venda.videoHeading}
          </h2>
          <ConsignacaoVideo
            ariaLabel={copy.venda.videoAria}
            fallbackText={copy.venda.videoFallback}
          />
          <p className="text-sm text-moss">{copy.venda.videoDataHint}</p>
        </section>

        <div className="flex flex-col gap-8">
          {copy.venda.sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-2">
              <h2 className="text-section-title text-foreground">{section.title}</h2>
              <p className="leading-relaxed text-moss">{section.body}</p>
            </section>
          ))}
        </div>

        <footer className="flex flex-col gap-6 border-t border-stone pt-6">
          <p className="leading-relaxed text-moss">{copy.venda.closing}</p>
          <WhatsAppContactButtons links={whatsappLinks} action="sell" />
        </footer>
      </article>
    </PageShell>
  );
};

export default VendaSuaMotoPage;
