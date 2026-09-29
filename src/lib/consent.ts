export const CONSENT_VERSION = "2026-05-05";
export const CONSENT_STORAGE_KEY = "seobrothers-consent";
/** sessionStorage: the per-session geo decision from /api/geo. */
export const GEO_STORAGE_KEY = "seobrothers-geo";
/** sessionStorage: first-touch attribution captured on the entry page. */
export const ENTRY_STORAGE_KEY = "seobrothers-entry";

// Where the law requires opt-in before non-essential cookies are set: the
// EU/EEA, the UK and Switzerland (ePrivacy + GDPR) and Quebec (Law 25). The
// banner shows there and analytics stays off until the visitor accepts.
// Everywhere else analytics runs on implied consent with notice in the
// privacy policy and a "Your privacy choices" link in the footer to opt out,
// and the Global Privacy Control browser signal keeps advertising storage off.
export const OPT_IN_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", // EU 27
  "IS", "LI", "NO", // EEA
  "GB", "CH",
]);
export const OPT_IN_REGIONS: Record<string, Set<string>> = {
  CA: new Set(["QC"]),
};

/** True when the visitor's location needs opt-in consent. Unknown = opt-in. */
export function consentRequiredFor(
  country: string | null | undefined,
  region: string | null | undefined,
): boolean {
  if (!country || country.length !== 2) return true;
  const c = country.toUpperCase();
  if (OPT_IN_COUNTRIES.has(c)) return true;
  const regions = OPT_IN_REGIONS[c];
  if (regions && region && regions.has(region.toUpperCase())) return true;
  return false;
}
