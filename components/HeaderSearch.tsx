"use client";

import { useSearchParams } from "next/navigation";
import { copy } from "@/lib/copy";

const fieldClassName =
  "min-h-[44px] w-full min-w-0 flex-1 rounded-full border border-chrome-border bg-chrome/60 px-4 py-2 text-base text-chrome-foreground placeholder:text-chrome-muted md:text-sm";

export const HeaderSearch: React.FC = () => {
  const searchParams = useSearchParams();
  const busca = searchParams.get("busca") ?? "";

  return (
    <form action="/" method="get" className="hidden items-center gap-2 lg:flex lg:w-72 2xl:w-96">
      <label className="sr-only" htmlFor="header-busca">
        {copy.searchPlaceholder}
      </label>
      <input
        id="header-busca"
        name="busca"
        type="search"
        defaultValue={busca}
        key={busca}
        placeholder={copy.searchPlaceholder}
        className={fieldClassName}
      />
      <button
        type="submit"
        className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-accent-cta px-4 text-sm font-bold focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-chrome focus-visible:outline-none"
      >
        {copy.searchSubmit}
      </button>
    </form>
  );
};
