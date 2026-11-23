import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionary";
import type { EventSettingsView, Locale } from "@/lib/types";
import { localized } from "@/i18n";
import { contentIcon } from "@/components/site/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/format";

export function AboutSection({
  settings,
  locale,
  dict,
}: {
  settings: EventSettingsView;
  locale: Locale;
  dict: Dictionary;
}) {
  const about = settings.content.about;

  return (
    <section id="about" className="section-pad bg-white">
      <div className="container-page grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
        <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border">
            <Image
              src={settings.aboutImageUrl}
              alt={dict.home.aboutImageAlt}
              width={1200}
              height={900}
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 end-4 w-[46%] overflow-hidden rounded-2xl border-4 border-white shadow-card sm:end-6">
            <Image
              src="/images/food.jpg"
              alt=""
              width={600}
              height={600}
              sizes="(max-width: 768px) 45vw, 20vw"
              className="aspect-square w-full object-cover"
            />
          </div>
          <div className="absolute start-4 top-4 rounded-full border border-white/50 bg-white/90 px-3.5 py-1.5 text-[0.7rem] font-bold text-navy-900 shadow-sm backdrop-blur sm:start-6">
            {localized(settings.content.brand.tagline, locale)}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3">
            <span className="h-px w-6 bg-gold-400" aria-hidden="true" />
            {about.title[locale]}
          </p>
          <h2 className="text-[1.7rem] leading-[1.45] text-navy-950 sm:text-[2rem]">
            {localized(about.lead, locale)}
          </h2>

          <div className="mt-5 space-y-4 text-[0.93rem] leading-8 text-muted">
            {(about.paragraphs[locale] || about.paragraphs.ar).slice(0, 2).map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {about.points.map((point) => {
              const Icon = contentIcon(point.icon);
              return (
                <div
                  key={point.title.en}
                  className="rounded-xl border border-border bg-cream-50 p-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-100 text-gold-800">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-[0.84rem] font-bold text-navy-900">
                    {localized(point.title, locale)}
                  </h3>
                  <p className="mt-1 text-[0.72rem] leading-6 text-muted">
                    {localized(point.body, locale)}
                  </p>
                </div>
              );
            })}
          </div>

          <Link
            href="/about"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-7 gap-1.5",
            )}
          >
            {dict.home.aboutCta}
            <ArrowLeft className="h-3.5 w-3.5 flip-icon" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
