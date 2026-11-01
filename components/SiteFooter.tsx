import Image from "next/image";
import Link from "next/link";
import { StoreSocialLinks } from "@/components/StoreSocialLinks";
import { WhatsAppContactButtons } from "@/components/WhatsAppContactButtons";
import { brandAssets } from "@/lib/brand";
import { copy } from "@/lib/copy";
import { WhatsAppContactLink } from "@/lib/store-whatsapp";

const FOOTER_LINKS: { href: string; label: string }[] = [
  { href: "/#estoque", label: copy.home.estoqueTitle },
  { href: "/venda-sua-moto", label: copy.nav.venda },
  { href: "/contato", label: copy.nav.contato },
];

interface SiteFooterProps {
  whatsappLinks: WhatsAppContactLink[];
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ whatsappLinks }) => (
  <footer className="mt-auto border-t border-chrome-border bg-chrome text-chrome-foreground">
    <div className="site-container flex flex-col gap-6 py-6 md:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Image
            src={brandAssets.logo}
            alt={copy.brand}
            className="h-12 w-auto object-contain object-left sm:h-14"
          />
          <div className="flex flex-col gap-3 text-sm text-chrome-muted">
            <address className="flex flex-col gap-0.5 not-italic">
              <p>{copy.contato.address}</p>
              <p>{copy.contato.hours}</p>
              <p>{copy.footer}</p>
            </address>
            <nav aria-label={copy.footerNavLabel}>
              <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {FOOTER_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex min-h-[44px] items-center text-chrome-foreground hover:text-accent focus-visible:text-accent focus-visible:outline-none sm:min-h-0"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <StoreSocialLinks surface="chrome" />
          </div>
        </div>
        <div className="w-full min-w-0 sm:max-w-md">
          <WhatsAppContactButtons
            links={whatsappLinks}
            action="negotiate"
            surface="chrome"
          />
        </div>
      </div>
    </div>
  </footer>
);
