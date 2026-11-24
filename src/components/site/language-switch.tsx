"use client";

import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/format";
import { LOCALE_COOKIE } from "@/i18n/core";
import type { Locale } from "@/lib/types";

export function LanguageSwitch({
  locale,
  label,
  compact = false,
}: {
  locale: Locale;
  label: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const next: Locale = locale === "ar" ? "en" : "ar";

  function switchLocale() {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/70 px-2.5 py-2 text-xs font-semibold text-navy-800 transition-colors hover:border-navy-200 hover:bg-white",
        compact && "px-2",
      )}
      aria-label={label}
      title={label}
    >
      <Globe className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
      <span>{locale === "ar" ? "EN" : "ع"}</span>
    </button>
  );
}
