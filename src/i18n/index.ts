/**
 * Public, client-safe i18n surface.
 *
 * `getLocale()` is exported from `@/i18n/server` because it depends on the
 * request cookies. Keeping it out of this module lets Client Components import
 * dictionaries, `localized`, `dir`, etc. without dragging `next/headers` into
 * the browser bundle.
 */
export * from "@/i18n/core";
