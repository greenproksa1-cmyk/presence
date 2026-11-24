import type { Bilingual, Locale } from "@/lib/types";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/types";
import { dictionaries, type Dictionary } from "@/i18n/dictionary";

/**
 * Client-safe i18n helpers.
 *
 * This module intentionally has **no** dependency on `next/headers`, so it can
 * be imported from Client Components. Anything that needs the request (the
 * active locale) lives in `@/i18n/server`.
 */
export const LOCALE_COOKIE = "mff_locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function localized(value: Bilingual, locale: Locale): string {
  return value[locale] || value.ar || value.en;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

export type { Dictionary };
