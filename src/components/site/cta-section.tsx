import Link from "next/link";
import { ArrowLeft, QrCode } from "lucide-react";
import type { EventSettingsView, Locale } from "@/lib/types";
import { localized } from "@/i18n";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/format";

export function CtaSection({
  settings,
  locale,
  note,
}: {
  settings: EventSettingsView;
  locale: Locale;
  note: string;
}) {
  const cta = settings.content.cta;

  return (
    <section className="bg-cream-50 pb-16 md:pb-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[1.9rem] bg-navy-900 px-6 py-12 text-center text-white sm:px-10 md:py-16">
          <div className="pointer-events-none absolute inset-0 pattern-dark opacity-50" />
          <div className="pointer-events-none absolute -top-16 start-1/2 h-56 w-56 -translate-x-1/2 rounded-full border border-gold-400/15" />
          <div className="relative mx-auto max-w-2xl">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gold-300">
              <QrCode className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-[1.7rem] leading-[1.4] text-white sm:text-[2.15rem]">
              {localized(cta.title, locale)}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[0.92rem] leading-8 text-white/65">
              {localized(cta.description, locale)}
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "gold", size: "lg" }),
                  "h-12 gap-2 px-7 text-[0.95rem]",
                )}
              >
                {localized(cta.button, locale)}
                <ArrowLeft className="h-4 w-4 flip-icon" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-4 text-[0.7rem] leading-6 text-white/45">{note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
