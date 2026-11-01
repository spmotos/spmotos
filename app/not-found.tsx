import type { Metadata } from "next";
import type { FC } from "react";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: copy.notFound.title,
  robots: { index: false },
};

const NotFoundPage: FC = () => (
  <PageShell width="prose">
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-display font-bold text-foreground">{copy.notFound.title}</h1>
        <p className="leading-relaxed text-moss">{copy.notFound.body}</p>
      </header>
      <Link
        href="/#estoque"
        className="inline-flex min-h-[44px] w-fit items-center gap-2 rounded-full bg-accent-cta px-6 py-3 text-sm font-bold focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {copy.notFound.backToEstoque}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  </PageShell>
);

export default NotFoundPage;
