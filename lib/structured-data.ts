import { PublicMoto } from "@/lib/clickgarage/types";
import { copy } from "@/lib/copy";
import { getSiteUrl } from "@/lib/env";
import { buildMotoDetailHref } from "@/lib/estoque-query";
import { STORE_SOCIAL_LINKS } from "@/lib/social";
import { STORE_GOOGLE_MAPS_URL, STORE_LAT, STORE_LNG } from "@/lib/store-location";
import { STORE_WHATSAPP_CONTACTS } from "@/lib/store-whatsapp";

type JsonLd = Record<string, unknown>;

const storeId = (): string => `${getSiteUrl()}/#loja`;

const toE164Display = (e164: string): string => `+${e164}`;

/** RN-01/RN-02: só campos públicos — sem placa nem custos. */
export const buildStoreJsonLd = (): JsonLd => {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "MotorcycleDealer",
    "@id": storeId(),
    name: copy.brand,
    description: copy.tagline,
    url: siteUrl,
    image: `${siteUrl}/banner.jpeg`,
    logo: `${siteUrl}/icon.png`,
    telephone: toE164Display(STORE_WHATSAPP_CONTACTS[0].e164),
    contactPoint: STORE_WHATSAPP_CONTACTS.map((contact) => ({
      "@type": "ContactPoint",
      telephone: toE164Display(contact.e164),
      contactType: "sales",
      name: contact.name,
      availableLanguage: "pt-BR",
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Avenida Domingos de Almeida, 3364",
      addressLocality: "Pelotas",
      addressRegion: "RS",
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: STORE_LAT, longitude: STORE_LNG },
    hasMap: STORE_GOOGLE_MAPS_URL,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "12:00",
      },
    ],
    areaServed: { "@type": "City", name: "Pelotas" },
    sameAs: STORE_SOCIAL_LINKS.map((link) => link.href),
  };
};

const motoPhotos = (moto: PublicMoto): string[] =>
  [...new Set([moto.imagemPrincipal, ...moto.galeria].filter((photo): photo is string => Boolean(photo)))];

export const buildMotoJsonLd = (moto: PublicMoto): JsonLd => {
  const url = `${getSiteUrl()}${buildMotoDetailHref(moto.id)}`;
  return {
    "@context": "https://schema.org",
    "@type": ["Product", "Motorcycle"],
    "@id": `${url}#moto`,
    name: moto.titulo,
    url,
    image: motoPhotos(moto),
    brand: { "@type": "Brand", name: moto.marca },
    model: moto.modelo,
    vehicleModelDate: String(moto.anoModelo),
    productionDate: String(moto.anoFabricacao),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: moto.km, unitCode: "KMT" },
    color: moto.cor,
    fuelType: moto.combustivel,
    vehicleTransmission: moto.cambio,
    itemCondition:
      moto.km === 0 ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url,
      price: moto.valorAnunciado,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      seller: { "@id": storeId() },
    },
  };
};

/** Escapa `<` para impedir fechar a tag `<script>` com dados do feed (recomendação do Next). */
export const serializeJsonLd = (data: JsonLd): string =>
  JSON.stringify(data).replace(/</g, "\\u003c");
