const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toLatinDigits(value: string): string {
  return value
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)));
}

/**
 * Turns any reasonable human formatting of a mobile number into E.164.
 *
 * Saudi-local forms are accepted explicitly (05x, 5x, 9665x, 009665x).
 * Numbers from other countries must be entered in international form so we
 * never guess the wrong country. Deduplication uses this canonical value, so
 * "050 123 4567" and "+966501234567" collide as intended.
 */
export function normalizePhone(raw: string, countryCode = "SA"): string | null {
  let value = toLatinDigits(raw ?? "").trim();
  if (!value) return null;

  value = value.replace(/[\s\-()./]/g, "");
  if (value.startsWith("00")) value = `+${value.slice(2)}`;

  if (countryCode === "SA") {
    if (/^05\d{8}$/.test(value)) return `+966${value.slice(1)}`;
    if (/^5\d{8}$/.test(value)) return `+966${value}`;
    if (/^9665\d{8}$/.test(value)) return `+${value}`;
    if (/^\+9665\d{8}$/.test(value)) return value;
  }

  if (!value.startsWith("+")) return null;
  if (!/^\+[1-9]\d{7,14}$/.test(value)) return null;
  return value;
}

export function isValidPhone(raw: string, countryCode = "SA"): boolean {
  return normalizePhone(raw, countryCode) !== null;
}

export function formatPhoneForDisplay(phone: string): string {
  if (!phone.startsWith("+966")) return phone;
  const local = `0${phone.slice(4)}`;
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`.trim();
}
