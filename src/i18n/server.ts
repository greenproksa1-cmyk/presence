import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";
import { LOCALE_COOKIE, normalizeLocale } from "@/i18n/core";

/**
 * Reads the active locale from the request cookie.
 * Server Components / Route Handlers / Server Actions only.
 */
export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  return normalizeLocale(jar.get(LOCALE_COOKIE)?.value);
}
