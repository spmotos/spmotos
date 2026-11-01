import { copy } from "@/lib/copy";
import { WhatsAppContactLink } from "@/lib/store-whatsapp";

type WhatsAppContactAction = "negotiate" | "sell";

interface WhatsAppContactButtonsProps {
  links: WhatsAppContactLink[];
  action: WhatsAppContactAction;
  layout?: "stack" | "inline";
  showChooserHint?: boolean;
  surface?: "page" | "chrome";
}

const ctaClassName =
  "inline-flex min-h-[44px] w-full flex-col items-center justify-center rounded-full bg-accent-cta px-4 py-2.5 text-sm font-bold hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-page focus-visible:outline-none";

const headerLinkClassName =
  "text-lg font-bold text-chrome-foreground hover:text-accent focus-visible:text-accent focus-visible:outline-none md:text-xs md:font-semibold";

export const WhatsAppContactButtons: React.FC<WhatsAppContactButtonsProps> = ({
  links,
  action,
  layout = "stack",
  showChooserHint = true,
  surface = "page",
}) => {
  const hintClassName = surface === "chrome" ? "text-chrome-muted" : "text-foreground";
  const getPrimaryLabel = (name: string): string => {
    if (action === "sell") {
      return copy.whatsappSellWith(name);
    }
    return copy.whatsappNegotiateWith(name);
  };

  if (layout === "inline") {
    return (
      <span className="inline-flex min-h-[44px] flex-wrap items-center justify-center gap-x-1.5 gap-y-1 lg:min-h-0">
        {links.map(({ contact, href }, index) => (
          <span key={contact.id} className="inline-flex items-center gap-1.5">
            {index > 0 ? (
              <span className="text-chrome-muted" aria-hidden="true">
                ·
              </span>
            ) : null}
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={copy.whatsappAriaLink(`${contact.name}, ${contact.displayPhone}`)}
              className={`inline-flex min-h-[44px] items-center lg:min-h-0 ${headerLinkClassName}`}
            >
              {contact.name}
            </a>
          </span>
        ))}
      </span>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      {showChooserHint ? (
        <p className={`text-sm font-medium ${hintClassName}`}>{copy.whatsappChooseContact}</p>
      ) : null}
      <div
        className={
          action === "sell"
            ? "grid grid-cols-1 gap-3 lg:grid-cols-2"
            : "grid grid-cols-1 gap-3 sm:grid-cols-2"
        }
      >
        {links.map(({ contact, href }) => (
          <a
            key={contact.id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={copy.whatsappAriaLink(
              `${getPrimaryLabel(contact.name)}, ${contact.displayPhone}`,
            )}
            className={`${ctaClassName} px-3 sm:px-4`}
          >
            <span
              className={
                action === "sell"
                  ? "max-w-full text-center text-xs font-bold whitespace-nowrap sm:text-sm"
                  : "text-base font-bold max-md:text-lg"
              }
            >
              {getPrimaryLabel(contact.name)}
            </span>
            <span className="text-xs font-normal opacity-90">{contact.displayPhone}</span>
          </a>
        ))}
      </div>
    </div>
  );
};
