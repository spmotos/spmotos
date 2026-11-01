import { WhatsAppContactButtons } from "@/components/WhatsAppContactButtons";
import { copy } from "@/lib/copy";
import { WhatsAppContactLink } from "@/lib/store-whatsapp";

interface EmptyStateProps {
  whatsappLinks: WhatsAppContactLink[];
  variant?: "noResults" | "unavailable";
}

export const EmptyState: React.FC<EmptyStateProps> = ({ whatsappLinks, variant = "noResults" }) => {
  const text = variant === "unavailable" ? copy.empty.unavailable : copy.empty.noResults;
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone bg-surface px-6 py-10 text-center">
      <h2 className="text-lg font-bold text-page-foreground">{text.title}</h2>
      <p className="max-w-md text-moss">{text.body}</p>
      <div className="w-full max-w-lg">
        <WhatsAppContactButtons links={whatsappLinks} action="negotiate" />
      </div>
    </div>
  );
};
