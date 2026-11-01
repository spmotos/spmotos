"use client";

import { useEffect } from "react";
import { PageShell } from "@/components/PageShell";
import { WhatsAppContactButtons } from "@/components/WhatsAppContactButtons";
import { copy } from "@/lib/copy";
import { buildContactLinksForText } from "@/lib/store-whatsapp";

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, retry }) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell width="prose">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <h1 className="text-display font-bold text-foreground">{copy.errorPage.title}</h1>
          <p className="leading-relaxed text-moss">{copy.errorPage.body}</p>
        </header>
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex min-h-[44px] w-fit items-center justify-center rounded-full border border-stone bg-surface px-6 text-sm font-semibold text-foreground hover:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {copy.errorPage.retry}
        </button>
        <WhatsAppContactButtons
          links={buildContactLinksForText(`Olá! Quero falar com a ${copy.brand}.`)}
          action="negotiate"
        />
      </div>
    </PageShell>
  );
};

export default ErrorPage;
