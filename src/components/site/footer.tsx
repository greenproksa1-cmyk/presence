import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, QrCode } from "lucide-react";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import {
  formatEventDate,
  getEventSettings,
  DEFAULT_MAP_URL,
} from "@/lib/site-content";
import { localized } from "@/i18n";
import { Logo } from "@/components/site/logo";

export async function SiteFooter() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const settings = await getEventSettings();
  const content = settings.content;
  const brand = content.brand;
  const year = new Date().getFullYear();

  const socials = [
    { label: "X", href: settings.socialX },
    { label: "Instagram", href: settings.socialInstagram },
    { label: "LinkedIn", href: settings.socialLinkedin },
    { label: "YouTube", href: settings.socialYoutube },
  ].filter((item) => item.href.trim());

  const hasContact = Boolean(
    settings.contactEmail || settings.contactPhone || socials.length,
  );

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/about", label: dict.nav.about },
    { href: "/#event", label: dict.nav.event },
    { href: "/register", label: dict.nav.register },
  ];

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 pattern-dark opacity-60" />
      <div className="container-page relative py-14 md:py-16">
        <div
          className={
            hasContact
              ? "grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_0.9fr_1.1fr]"
              : "grid gap-10 md:grid-cols-3"
          }
        >
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3" aria-label={brand.name[locale]}>
              <Logo src={settings.logoUrl} size={52} className="ring-white/15" />
              <span>
                <span className="block text-[0.98rem] font-bold leading-tight text-white">
                  {brand.shortName[locale]}
                </span>
                <span className="mt-1 block text-[0.7rem] font-medium tracking-wide text-gold-300">
                  {brand.tagline[locale]}
                </span>
              </span>
            </Link>
            <p className="mt-5 text-[0.83rem] leading-7 text-white/70">
              {content.footer.note[locale]}
            </p>
            <p className="mt-4 inline-flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[0.72rem] leading-5 text-gold-200">
              <QrCode className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {content.footer.accessNote[locale]}
            </p>
          </div>

          <FooterColumn title={dict.footer.explore}>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.85rem] text-white/70 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title={dict.footer.event}>
            <ul className="space-y-3 text-[0.82rem] leading-6 text-white/70">
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                <span>{formatEventDate(locale, settings.eventDate)}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                <span>
                  {localized(content.event.venueName, locale)}
                  <span className="mt-1 block text-white/45">
                    {localized(content.event.venueAddress, locale)}
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                <span>{localized(content.event.participationValue, locale)}</span>
              </li>
            </ul>
          </FooterColumn>

          {hasContact ? (
            <FooterColumn title={dict.footer.contact}>
              <ul className="space-y-3 text-[0.82rem] text-white/70">
                {settings.contactEmail ? (
                  <li>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-300"
                    >
                      <Mail className="h-4 w-4 text-gold-400" aria-hidden="true" />
                      <span dir="ltr">{settings.contactEmail}</span>
                    </a>
                  </li>
                ) : null}
                {settings.contactPhone ? (
                  <li>
                    <a
                      href={`tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`}
                      className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-300"
                      dir="ltr"
                    >
                      <Phone className="h-4 w-4 text-gold-400" aria-hidden="true" />
                      {settings.contactPhone}
                    </a>
                  </li>
                ) : null}
                <li>
                  <a
                    href={settings.mapUrl || DEFAULT_MAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 transition-colors hover:text-gold-300"
                  >
                    <MapPin className="h-4 w-4 text-gold-400" aria-hidden="true" />
                    {dict.common.openMap}
                  </a>
                </li>
              </ul>
              {socials.length ? (
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-white/60 transition-colors hover:text-gold-300"
                    >
                      {social.label}
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              ) : null}
            </FooterColumn>
          ) : null}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-[0.72rem] text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {brand.name[locale]}. {dict.footer.rights}.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition-colors hover:text-gold-300">
              {dict.footer.privacy}
            </Link>
            <span>{dict.footer.builtNote}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-gold-300">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}
