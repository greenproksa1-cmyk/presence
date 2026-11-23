import { cookies } from "next/headers";
import type { Bilingual, Locale } from "@/lib/types";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/types";
import { dictionaries, type Dictionary } from "@/i18n/dictionary";

export const LOCALE_COOKIE = "mff_locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function normalizeLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  return normalizeLocale(jar.get(LOCALE_COOKIE)?.value);
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