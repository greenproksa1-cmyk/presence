"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/format";

export function AdminNav({
  items,
  label,
}: {
  items: ReadonlyArray<{ href: string; label: string }>;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/admin/dashboard" && pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "whitespace-nowrap rounded-lg px-3 py-2 text-[0.82rem] font-medium transition-colors",
              active
                ? "bg-navy-900 text-white shadow-sm"
                : "text-navy-800 hover:bg-white hover:text-navy-950",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
