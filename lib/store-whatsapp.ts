export interface StoreWhatsAppContact {
  id: "sandra" | "caroline";
  name: string;
  e164: string;
  displayPhone: string;
}

export interface WhatsAppContactLink {
  contact: StoreWhatsAppContact;
  href: string;
}

export const STORE_WHATSAPP_CONTACTS: StoreWhatsAppContact[] = [
  {
    id: "sandra",
    name: "Sandra",
    e164: "5553999337965",
    displayPhone: "(53) 99933-7965",
  },
  {
    id: "caroline",
    name: "Caroline",
    e164: "5553981100585",
    displayPhone: "(53) 98110-0585",
  },
];

export const buildWaMeHref = (e164: string, text: string): string =>
  `https://wa.me/${e164}?text=${encodeURIComponent(text)}`;

export const buildContactLinksForText = (text: string): WhatsAppContactLink[] =>
  STORE_WHATSAPP_CONTACTS.map((contact) => ({
    contact,
    href: buildWaMeHref(contact.e164, text),
  }));
