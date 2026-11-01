"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { brandAssets } from "@/lib/brand";
import { copy } from "@/lib/copy";

interface NavLinkItem {
  href: string;
  label: string;
}

const NAV_LINKS: NavLinkItem[] = [
  { href: "/", label: copy.nav.home },
  { href: "/venda-sua-moto", label: copy.nav.venda },
  { href: "/contato", label: copy.nav.contato },
];

const isActivePath = (pathname: string, href: string): boolean =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

const desktopLinkClassName = (active: boolean): string =>
  [
    "inline-flex min-h-[44px] items-center border-b-2 px-1 text-sm font-semibold tracking-wide transition-colors lg:min-h-0 lg:text-base",
    active
      ? "border-accent text-accent"
      : "border-transparent text-chrome-foreground hover:text-accent",
  ].join(" ");

const mobileLinkClassName = (active: boolean): string =>
  [
    "inline-flex min-h-[44px] items-center rounded-md px-3 py-2 text-base font-medium focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-chrome focus-visible:outline-none",
    active ? "bg-chrome-border/50 text-accent" : "text-chrome-foreground hover:bg-chrome-border/30",
  ].join(" ");

export const HeaderNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="flex w-full flex-col lg:w-auto lg:flex-1">
      <div className="relative flex h-11 items-center justify-between gap-4 lg:h-auto lg:justify-start lg:gap-10">
        <Link
          href="/"
          className="relative z-0 flex h-11 max-w-[min(52vw,11rem)] shrink-0 items-center overflow-hidden lg:h-auto lg:max-w-none lg:overflow-visible"
          onClick={() => setOpen(false)}
        >
          <Image
            src={brandAssets.logo}
            alt={copy.brand}
            className="h-[4.375rem] w-auto max-h-none object-contain object-left sm:h-[4.75rem] lg:h-[4.625rem] lg:max-w-[12.5rem] 2xl:max-w-[14rem]"
            loading="eager"
          />
        </Link>
        <nav
          className="hidden flex-1 items-center justify-center gap-6 lg:flex lg:gap-8"
          aria-label={copy.nav.menu}
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={desktopLinkClassName(isActivePath(pathname, item.href))}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          ref={menuButtonRef}
          type="button"
          className="relative z-20 inline-flex min-h-[44px] min-w-[44px] shrink-0 touch-manipulation items-center justify-center rounded-md text-chrome-foreground hover:bg-chrome-border/30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-chrome focus-visible:outline-none lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? copy.nav.menuClose : copy.nav.menuOpen}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          )}
        </button>
      </div>
      {open ? (
        <nav
          ref={mobileNavRef}
          id="menu-mobile"
          className="mt-2 flex flex-col gap-1 lg:hidden"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={mobileLinkClassName(isActivePath(pathname, item.href))}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
};
