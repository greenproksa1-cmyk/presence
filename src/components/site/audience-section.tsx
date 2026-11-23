import type { Dictionary } from "@/i18n/dictionary";
import type { EventSettingsView, Locale } from "@/lib/types";
import { localized } from "@/i18n";
import { contentIcon } from "@/components/site/icons";
import { SectionHeading } from "@/components/site/section-heading";

export function AudienceSection({
  settings,
  locale,
  dict,
}: {
  settings: EventSettingsView;
  locale: Locale;
  dict: Dictionary;
}) {
  const audience = settings.content.audience;

  return (
    <section className="section-pad bg-cream-50">
      <div className="container-page">
        <SectionHeading
          eyebrow={audience.title[locale]}
          title={dict.home.audienceTitle}
          description={localized(audience.description, locale)}
          align="center"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audience.items.map((item) => {
            const Icon = contentIcon(item.icon);
            return (
              <article
                key={item.title.en}
                className="group lift rounded-2xl border border-border bg-white p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream-200 text-navy-800 transition-colors group-hover:bg-gold-100 group-hover:text-gold-800">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[0.95rem] font-bold text-navy-900">
                  {localized(item.title, locale)}
                </h3>
                <p className="mt-1.5 text-[0.8rem] leading-7 text-muted">
                  {localized(item.body, locale)}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
