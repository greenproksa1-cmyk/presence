import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { requireAdmin } from "@/lib/session";
import { getEventSettings, EVENT_TIMEZONE } from "@/lib/site-content";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

function dateInputValue(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default async function AdminSettingsPage() {
  await requireAdmin();
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const labels = dict.admin.settings;
  const settings = await getEventSettings();
  const content = settings.content;

  return (
    <div className="container-page space-y-5 py-6 sm:py-8">
      <header>
        <h1 className="text-2xl font-bold text-navy-950">{labels.title}</h1>
        <p className="mt-1 text-sm text-muted">{labels.subtitle}</p>
      </header>

      <SettingsForm
        values={{
          eventDate: dateInputValue(settings.eventDate),
          logoUrl: settings.logoUrl,
          heroImageUrl: settings.heroImageUrl,
          aboutImageUrl: settings.aboutImageUrl,
          venueImageUrl: settings.venueImageUrl,
          mapUrl: settings.mapUrl,
          contactEmail: settings.contactEmail,
          contactPhone: settings.contactPhone,
          whatsappNumber: settings.whatsappNumber,
          emailEnabled: settings.emailEnabled,
          whatsappEnabled: settings.whatsappEnabled,
          brandNameAr: content.brand.name.ar,
          brandNameEn: content.brand.name.en,
          brandShortAr: content.brand.shortName.ar,
          brandShortEn: content.brand.shortName.en,
          brandTaglineAr: content.brand.tagline.ar,
          brandTaglineEn: content.brand.tagline.en,
          heroDescriptionAr: content.hero.description.ar,
          heroDescriptionEn: content.hero.description.en,
        }}
        labels={{
          eventSection: labels.eventSection,
          eventDate: labels.eventDate,
          contactSection: labels.contactSection,
          contactEmail: labels.contactEmail,
          contactPhone: labels.contactPhone,
          whatsappNumber: labels.whatsappNumber,
          linksSection: labels.linksSection,
          logoUrl: labels.logoUrl,
          heroImageUrl: labels.heroImageUrl,
          aboutImageUrl: labels.aboutImageUrl,
          venueImageUrl: labels.venueImageUrl,
          mapUrl: labels.mapUrl,
          brandSection: labels.brandSection,
          brandNameAr: labels.brandNameAr,
          brandNameEn: labels.brandNameEn,
          brandShortAr: labels.brandShortAr,
          brandShortEn: labels.brandShortEn,
          brandTaglineAr: labels.brandTaglineAr,
          brandTaglineEn: labels.brandTaglineEn,
          heroDescriptionAr: labels.heroDescriptionAr,
          heroDescriptionEn: labels.heroDescriptionEn,
          togglesSection: labels.togglesSection,
          emailEnabled: labels.emailEnabled,
          whatsappEnabled: labels.whatsappEnabled,
          save: labels.save,
          saving: labels.saving,
          saved: labels.saved,
          saveFailed: labels.saveFailed,
          contentNote: labels.contentNote,
        }}
      />
    </div>
  );
}
