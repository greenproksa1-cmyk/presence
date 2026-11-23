export type Locale = "ar" | "en";

export const LOCALES: readonly Locale[] = ["ar", "en"] as const;
export const DEFAULT_LOCALE: Locale = "ar";

export interface Bilingual {
  ar: string;
  en: string;
}

export interface BilingualList {
  ar: string[];
  en: string[];
}

export type ContentIcon =
  | "catering"
  | "beverage"
  | "hotel"
  | "restaurant"
  | "logistics"
  | "factory"
  | "government"
  | "investment"
  | "expertise"
  | "partnership"
  | "knowledge"
  | "opportunity";

export interface ContentPoint {
  icon: ContentIcon;
  title: Bilingual;
  body: Bilingual;
}

export interface AudienceItem {
  icon: ContentIcon;
  title: Bilingual;
  body: Bilingual;
}

export interface PrivacySection {
  title: Bilingual;
  body: BilingualList;
}

export interface SiteContent {
  brand: {
    name: Bilingual;
    shortName: Bilingual;
    tagline: Bilingual;
  };
  hero: {
    eyebrow: Bilingual;
    titleBefore: Bilingual;
    titleHighlight: Bilingual;
    titleAfter: Bilingual;
    description: Bilingual;
    primaryCta: Bilingual;
    secondaryCta: Bilingual;
  };
  about: {
    title: Bilingual;
    lead: Bilingual;
    paragraphs: BilingualList;
    points: ContentPoint[];
  };
  event: {
    title: Bilingual;
    dateNote: Bilingual;
    venueName: Bilingual;
    venueAddress: Bilingual;
    participationLabel: Bilingual;
    participationValue: Bilingual;
    mapCta: Bilingual;
    note: Bilingual;
  };
  audience: {
    title: Bilingual;
    description: Bilingual;
    items: AudienceItem[];
  };
  cta: {
    title: Bilingual;
    description: Bilingual;
    button: Bilingual;
  };
  privacy: {
    title: Bilingual;
    intro: Bilingual;
    sections: PrivacySection[];
  };
  footer: {
    note: Bilingual;
    accessNote: Bilingual;
  };
  seo: {
    title: Bilingual;
    description: Bilingual;
  };
}

export interface EventSettingsView {
  id: string;
  eventDate: Date;
  logoUrl: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  venueImageUrl: string;
  mapUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  socialX: string;
  socialInstagram: string;
  socialLinkedin: string;
  socialYoutube: string;
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  content: SiteContent;
  updatedAt: Date | null;
}

export type OrganizationTypeKey =
  | "catering"
  | "food_beverage"
  | "hotel"
  | "restaurant"
  | "supply_distribution"
  | "food_manufacturing"
  | "government"
  | "investor"
  | "entrepreneur"
  | "consultant"
  | "other";

export const ORGANIZATION_TYPES: readonly OrganizationTypeKey[] = [
  "catering",
  "food_beverage",
  "hotel",
  "restaurant",
  "supply_distribution",
  "food_manufacturing",
  "government",
  "investor",
  "entrepreneur",
  "consultant",
  "other",
] as const;

export interface RegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  city: string;
  company: string;
  jobTitle: string;
  organizationType: OrganizationTypeKey;
  interest?: string;
  consent: true;
  locale: Locale;
}

export interface RegistrationSummary {
  id: string;
  registrationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  city: string;
  company: string;
  jobTitle: string;
  organizationType: string;
  interest: string | null;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: Date;
  checkedInAt: Date | null;
  ticketStatus: "CONFIRMED" | "CANCELLED" | null;
}

export type CheckInState =
  | "VALID"
  | "ALREADY_CHECKED_IN"
  | "INVALID"
  | "CANCELLED";

export interface CheckInResult {
  state: CheckInState;
  checkedInAt?: string;
  registration?: {
    fullName: string;
    registrationNumber: string;
    company: string;
    checkedInAt: string | null;
  };
  message?: string;
}
