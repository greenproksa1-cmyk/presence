"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/format";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { Select } from "@/components/ui/field";
import { Textarea } from "@/components/ui/field";
import { getDictionary, getLocale } from "@/i18n";
import { getEventSettings, DEFAULT_SETTINGS, parseSiteContent, mergeValue } from "@/lib/site-content";
import { prisma } from "@/lib/db";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [locale, setLocale] = useState("ar");
  useEffect(() => {
    getLocale().then(l => setLocale(l));
  }, []);
  const dict = getDictionary(locale);

  // Auth check
  const { user } = useAdminAuth();
  if (!user) {
    router.push("/admin/login");
    return null;
  }

  const [settings, setSettings] = useState<import("@/lib/site-content").EventSettingsView>(DEFAULT_SETTINGS);
  const [content, setContent] = useState<import("@/lib/site-content").SiteContent>(DEFAULT_SETTINGS.content);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load settings from DB on mount
  useEffect(() => {
    async function load() {
      try {
        const row = await prisma.eventSettings.findUnique({ where: { id: "main" } });
        if (row) {
          const parsedContent = row.content ? parseSiteContent(row.content) : DEFAULT_SETTINGS.content;
          setSettings({
            id: row.id,
            eventDate: row.eventDate,
            logoUrl: row.logoUrl,
            heroImageUrl: row.heroImageUrl,
            aboutImageUrl: row.aboutImageUrl,
            venueImageUrl: row.venueImageUrl,
            mapUrl: row.mapUrl,
            contactEmail: row.contactEmail,
            contactPhone: row.contactPhone,
            whatsappNumber: row.whatsappNumber,
            socialX: row.socialX,
            socialInstagram: row.socialInstagram,
            socialLinkedin: row.socialLinkedin,
            socialYoutube: row.socialYoutube,
            whatsappEnabled: row.whatsappEnabled,
            emailEnabled: row.emailEnabled,
            content: parsedContent,
            updatedAt: row.updatedAt,
          });
          setContent(parsedContent);
        }
      } catch (error) {
        console.error("[admin-settings] failed to load", error);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await prisma.eventSettings.update({
        where: { id: "main" },
        data: {
          eventDate: settings.eventDate,
          logoUrl: settings.logoUrl,
          heroImageUrl: settings.heroImageUrl,
          aboutImageUrl: settings.aboutImageUrl,
          venueImageUrl: settings.venueImageUrl,
          mapUrl: settings.mapUrl,
          contactEmail: settings.contactEmail,
          contactPhone: settings.contactPhone,
          whatsappNumber: settings.whatsappNumber,
          socialX: settings.socialX,
          socialInstagram: settings.socialInstagram,
          socialLinkedin: settings.socialLinkedin,
          socialYoutube: settings.socialYoutube,
          whatsappEnabled: settings.whatsappEnabled,
          emailEnabled: settings.emailEnabled,
          content: mergeValue(DEFAULT_SETTINGS.content, content),
          updatedById: user.id,
        },
      });
      // Also update the in-memory content
      const merged = mergeValue(DEFAULT_SETTINGS.content, content);
      setContent(merged);
      setSettings(prev => ({
        ...prev,
        content: merged,
      }));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("[admin-settings] failed to save", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen bg-cream-100">
      <div className="container-page p-6 sm:p-8 lg:p-10">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-navy-950">
            {dict.nav.settings}
          </h1>
          <p className="text-muted mt-1">
            {dict.auth.staffNotice}
          </p>
        </header>

        {showSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
            <Check className="h-4 w-4 text-emerald-600 mb-2" aria-hidden="true" />
            <span className="text-emerald-700">تم حفظ الإعدادات بنجاح</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: General settings */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card">
            <h2 className="text-[0.85rem] font-bold text-navy-900 uppercase tracking-wider mb-4">
              {dict.settings.general}
            </h2>

            <div className="grid gap-4">
              {/* Event date */}
              <div>
                <label className="block text-[0.7rem] font-medium text-navy-800 mb-2">
                  {dict.settings.eventDate}
                </label>
                <Input
                  type="date"
                  value={settings.eventDate.toISOString().slice(0, 10)}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setSettings(prev => ({
                      ...prev,
                      eventDate: date,
                    }));
                  }}
                  className="w-full"
                />
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-[0.7rem] font-medium text-navy-800 mb-2">
                  {dict.settings.logoUrl}
                </label>
                <Input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) => {
                    setSettings(prev => ({
                      ...prev,
                      logoUrl: e.target.value,
                    }));
                  }}
                  className="w-full"
                  placeholder="/brand/logo-mark.svg"
                />
              </div>

              {/* Email enabled */}
              <div>
                <Select
                  value={settings.emailEnabled ? "true" : "false"}
                  onValueChange={(v) =>
                    setSettings(prev => ({ ...prev, emailEnabled: v === "true" }))
                  }
                >
                  <option value="true">مفعل</option>
                  <option value="false">معطل</option>
                </Select>
              </div>

              {/* WhatsApp enabled */}
              <div>
                <Select
                  value={settings.whatsappEnabled ? "true" : "false"}
                  onValueChange={(v) =>
                    setSettings(prev => ({ ...prev, whatsappEnabled: v === "true" }))
                  }
                >
                  <option value="true">مفعل</option>
                  <option value="false">معطل</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Middle column: Content / Arabic copy */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card">
            <h2 className="text-[0.85rem] font-bold text-navy-900 uppercase tracking-wider mb-4">
              {dict.settings.contentArabic}
            </h2>

            <Textarea
              value={content.brand.name.ar}
              onChange={(e) => setContent(c => ({ ...c, brand: { ...c.brand, name: { ...c.name, ar: e.target.value } } }))}
              placeholder="اسم الفعالية بالعربية"
              className="h-32"
            />
            <Textarea
              value={content.brand.name.en}
              onChange={(e) => setContent(c => ({ ...c, brand: { ...c.brand, name: { ...c.name, en: e.target.value } } }))}
              placeholder="Event name in English"
              className="h-32 mt-3"
            />
          </div>

          {/* Right column: English copy */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-card">
            <h2 className="text-[0.85rem] font-bold text-navy-900 uppercase tracking-wider mb-4">
              {dict.settings.contentEnglish}
            </h2>

            <Textarea
              value={content.brand.name.ar}
              onChange={(e) => setContent(c => ({ ...c, brand: { ...c.brand, name: { ...c.name, ar: c.name.ar } } }))}
              placeholder="Arabic name"
              className="h-32"
            />
            <Textarea
              value={content.brand.name.en}
              onChange={(e) => setContent(c => ({ ...c, brand: { ...c.brand, name: { ...c.name, en: e.target.value } } }))}
              placeholder="Event name in English"
              className="h-32 mt-3"
            />
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="gold"
            size="lg"
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {dict.common.saving}
              </span>
            ) : (
              <span>{dict.common.save}</span>
            )}
          </Button>

          {showSuccess && (
            <p className="mt-3 text-sm text-emerald-700">
              تم حفظ التغييرات
            </p>
          )}
        </div>
      </div>
    </section>
  );
}