import "./globals.css";
import type { Metadata } from "next";
import { dir, getDictionary, getLocale } from "@/i18n";
import { getEventSettings } from "@/lib/site-content";

export const metadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const settings = await getEventSettings();

  return {
    title: dict.layout.title,
    description: dict.layout.subtitle,
  };
};