import type { Metadata } from "next";
import type { FC } from "react";
import { permanentRedirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { EstoqueFilters } from "@/components/EstoqueFilters";
import { HomeEstoqueGrid } from "@/components/HomeEstoqueGrid";
import { HomeHero } from "@/components/HomeHero";
import { HomeTrustStrip } from "@/components/HomeTrustStrip";
import {
  ESTOQUE_BATCH_SIZE,
  ListMotosBatchResult,
  listMotos,
  listMotosBatch,
  marcasFromMotos,
} from "@/lib/clickgarage/repository";
import { ListMotosParams } from "@/lib/clickgarage/types";
import { copy } from "@/lib/copy";
import {
  buildMotoDetailHref,
  parseEstoqueParams,
  parseLegacyMotoId,
  QueryValueMap,
} from "@/lib/estoque-query";
import { HOME_RECENT_ORDER } from "@/lib/home-hero";
import { buildWhatsAppHrefPlainLinks } from "@/lib/whatsapp";

export const revalidate = 300;

export const metadata: Metadata = {
  /** `title.template` do layout não se aplica ao page.tsx do mesmo segmento. */
  title: { absolute: copy.home.metaTitle },
  description: copy.tagline,
};

interface HomeEstoqueData {
  marcas: string[];
  batch: ListMotosBatchResult;
}

/** Feed fora do ar não derruba a home: hero e contatos continuam visíveis. */
const loadHomeEstoque = async (
  listParams: ListMotosParams,
): Promise<HomeEstoqueData | null> => {
  try {
    const estoqueBase = await listMotos({ ordenar: HOME_RECENT_ORDER });
    const batch = await listMotosBatch(listParams, 0, ESTOQUE_BATCH_SIZE);
    return { marcas: marcasFromMotos(estoqueBase), batch };
  } catch (error) {
    console.error("Home: falha ao carregar estoque do feed", error);
    return null;
  }
};

interface HomePageProps {
  searchParams: Promise<QueryValueMap>;
}

const HomePage: FC<HomePageProps> = async ({ searchParams }) => {
  const query = await searchParams;
  const legacyMotoId = parseLegacyMotoId(query);
  if (legacyMotoId) {
    permanentRedirect(buildMotoDetailHref(legacyMotoId));
  }

  const params = parseEstoqueParams(query);
  const listParams = {
    ...params,
    ordenar: params.ordenar ?? HOME_RECENT_ORDER,
  };

  const estoque = await loadHomeEstoque(listParams);
  const whatsappLinks = buildWhatsAppHrefPlainLinks(`Olá! Quero falar com a ${copy.brand}.`);

  const busca = params.busca ?? "";
  const marca = params.marca ?? "";
  const valorMax = params.valorMax !== undefined ? String(params.valorMax) : "";

  return (
    <>
      <HomeHero />
      <div className="relative z-10 mt-4 md:-mt-8">
        <EstoqueFilters
          marcas={estoque?.marcas ?? []}
          busca={busca}
          marca={marca}
          valorMax={valorMax}
        />
      </div>
      <div className="bg-page">
        {estoque === null || estoque.batch.total === 0 ? (
          <section id="estoque" className="scroll-mt-header py-10 md:py-12">
            <div className="site-container">
              <EmptyState
                whatsappLinks={whatsappLinks}
                variant={estoque === null ? "unavailable" : "noResults"}
              />
            </div>
          </section>
        ) : (
          <section id="estoque" className="scroll-mt-header py-10 md:py-12 2xl:py-14">
            <div className="site-container flex flex-col gap-6 2xl:gap-8">
              <div className="flex items-center gap-3">
                <span className="h-8 w-1 rounded-full bg-accent" aria-hidden="true" />
                <h2 className="text-section-title text-page-foreground">
                  {copy.home.estoqueTitle}
                </h2>
              </div>
              <HomeEstoqueGrid
                key={JSON.stringify(listParams)}
                initialItems={estoque.batch.items}
                total={estoque.batch.total}
                listParams={listParams}
              />
            </div>
          </section>
        )}
        <HomeTrustStrip />
      </div>
    </>
  );
};

export default HomePage;
