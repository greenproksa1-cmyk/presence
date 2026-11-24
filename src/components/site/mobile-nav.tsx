"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/format";

interface NavItem {
  href: string;
  label: string;
}

export function MobileNav({
  items,
  cta,
  official,
  menuLabel,
  closeLabel,
}: {
  items: NavItem[];
  cta: string;
  official: string;
  menuLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-navy-900 lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? closeLabel : menuLabel}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div
        id="mobile-navigation"
        className={cn(
          "absolute inset-x-0 top-full z-50 border-b border-border bg-cream-50 shadow-card lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-4" aria-label={menuLabel}>
          {items.map((item) => {
            const active =
              item.href === pathname ||
              (item.href !== "/" && !item.href.includes("#") && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-[0.95rem] font-medium text-navy-900 transition-colors hover:bg-white",
                  active && "bg-white text-gold-700",
                )}
              >
                {item.label}
                <ArrowLeft className={cn("h-4 w-4 text-muted-soft flip-icon")} aria-hidden="true" />
              </Link>
            );
          })}
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="mt-3 flex h-12 items-center justify-center rounded-xl bg-gold-400 px-5 font-bold text-navy-950"
          >
            {cta}
          </Link>
          <p className="px-1 pt-3 pb-2 text-[0.7rem] leading-5 text-muted-soft">{official}</p>
        </nav>
      </div>
    </>
  );
}
