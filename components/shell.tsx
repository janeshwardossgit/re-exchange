"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toasts, cn } from "./ui";

const links = [
  { href: "/", label: "Discover" },
  { href: "/match", label: "Campus Match" },
  { href: "/create", label: "Create" },
  { href: "/messages", label: "Messages" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="relative z-[1] flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-[color-mix(in_oklab,var(--paper)_88%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/" className="flex items-center leading-none">
            <img src="/re-exchange-wordmark.svg" alt="RE:EXCHANGE" className="h-8 w-auto" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
              return (
               <Link
  href="/"
  className="group flex items-center gap-2 leading-none"
  aria-label="RE:EXCHANGE home"
>
  <span className="grid h-8 w-8 place-items-center rounded-xl bg-forest text-sm font-bold text-[#f6f1e7] transition group-hover:scale-105">
    ↔
  </span>

  <span className="text-[15px] font-black tracking-[-0.03em]">
    <span className="text-ember">RE:</span>
    <span className="text-ink">EXCHANGE</span>
  </span>
</Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/impact"
              className="hidden rounded-full border border-line bg-card px-3 py-1.5 text-xs text-muted sm:inline"
            >
              Campus impact
            </Link>
            <Link
              href="/profile"
              className="grid h-9 w-9 place-items-center rounded-full bg-forest text-xs font-semibold text-[#f6f1e7]"
              aria-label="Your profile"
            >
              JN
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:pb-12">{children}</main>
      <footer className="hidden border-t border-line px-4 py-8 text-center text-xs text-muted md:block">
        SRM Institute of Technology · peer exchange, not a classifieds dump.
      </footer>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[color-mix(in_oklab,var(--paper)_92%,transparent)] backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5">
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-1 py-3 text-center text-[11px]",
                  active ? "font-semibold text-forest" : "text-muted",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <Toasts />
    </div>
  );
}