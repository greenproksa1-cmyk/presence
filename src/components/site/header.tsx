import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { getEventSettings } from "@/lib/site-content";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { LanguageSwitch } from "@/components/site/language-switch";
import { MobileNav } from "@/components/site/mobile-nav";
import { cn } from "@/lib/format";

export async function SiteHeader() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const settings = await getEventSettings();
  const brand = settings.content.brand;

  const items = [
    { href: "/", label: dict.nav.home },
    { href: "/about", label: dict.nav.about },
    { href: "/#event", label: dict.nav.event },
    { href: "/register", label: dict.nav.register },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-cream-100/90 backdrop-blur-md">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4 lg:h-20">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          aria-label={brand.name[locale]}
        >
          <Logo src={settings.logoUrl} size={46} priority />
          <span className="min-w-0">
            <span className="block truncate text-[0.98rem] font-bold leading-tight text-navy-900">
              {brand.shortName[locale]}
            </span>
            <span className="mt-0.5 block truncate text-[0.68rem] font-medium tracking-wide text-gold-700">
              {brand.tagline[locale]}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={dict.nav.home}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-[0.88rem] font-medium text-navy-800 transition-colors hover:bg-white hover:text-navy-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch locale={locale} label={dict.switchLabel} />
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "gold", size: "default" }),
              "hidden h-10 gap-1.5 px-4 text-[0.83rem] sm:inline-flex",
            )}
          >
            {dict.header.registerCta}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <MobileNav
            items={items}
            cta={dict.header.registerCta}
            official={dict.header.official}
            menuLabel={dict.header.menu}
            closeLabel={dict.header.close}
          />
        </div>
      </div>
    </header>
  );
}
