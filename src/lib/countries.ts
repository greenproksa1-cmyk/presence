import type { Locale } from "@/lib/types";

// ISO 3166-1 alpha-2 codes. Localised names come from Intl.DisplayNames so the
// list stays correct in both Arabic and English without a 400-line dictionary.
const ISO_CODES = `AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW`
  .split(/\s+/)
  .filter(Boolean);

const displayNamesCache = new Map<Locale, Intl.DisplayNames>();

function getDisplayNames(locale: Locale): Intl.DisplayNames | null {
  if (typeof Intl.DisplayNames !== "function") return null;
  const cached = displayNamesCache.get(locale);
  if (cached) return cached;
  try {
    const instance = new Intl.DisplayNames([locale === "ar" ? "ar" : "en"], {
      type: "region",
    });
    displayNamesCache.set(locale, instance);
    return instance;
  } catch {
    return null;
  }
}

export function countryName(code: string, locale: Locale): string {
  const normalized = (code ?? "").toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return code;
  const names = getDisplayNames(locale);
  try {
    return names?.of(normalized) ?? normalized;
  } catch {
    return normalized;
  }
}

export interface CountryOption {
  code: string;
  name: string;
}

export function getCountryOptions(locale: Locale): CountryOption[] {
  return ISO_CODES.map((code) => ({ code, name: countryName(code, locale) })).sort(
    (a, b) => a.name.localeCompare(b.name, locale === "ar" ? "ar" : "en"),
  );
}

export function isValidCountryCode(code: string): boolean {
  return /^[A-Z]{2}$/.test(code) && ISO_CODES.includes(code);
}
