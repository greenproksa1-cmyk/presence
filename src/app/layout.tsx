import "./globals.css";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/alexandria/index.css";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";

import type { Metadata, Viewport } from "next";
import { dir, getDictionary, localized } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { getEventSettings } from "@/lib/site-content";
import { Toaster } from "@/components/ui/toaster";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const settings = await getEventSettings();
  const content = settings.content;
  const title = localized(content.seo.title, locale);
  const description = localized(content.seo.description, locale);

  return {
    title: {
      default: title,
      template: `%s · ${localized(content.brand.shortName, locale)}`,
    },
    description,
    applicationName: localized(content.brand.shortName, locale),
    keywords:
      locale === "ar"
        ? ["منتدى مكة الغذائي", "الإعاشة", "التموين", "الضيافة", "مكة المكرمة"]
        : ["Makkah Food Forum", "catering", "food supply", "hospitality", "Makkah"],
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_GB",
      siteName: localized(content.brand.name, locale),
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.jpg"],
    },
    icons: {
      icon: [{ url: "/brand/logo-mark.svg", type: "image/svg+xml" }],
      apple: [{ url: "/brand/logo-mark.png" }],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#16224a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
      <body className="min-h-screen bg-cream-100 text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          {dict.common.skipToContent}
        </a>
        {children}
        <Toaster dir={dir(locale)} />
      </body>
    </html>
  );
}
