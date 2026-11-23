import { notFound } from "next/navigation";

export const metadata = async () => {
  const locale = await import("@/i18n").then((m) => m.getLocale());
  const dict = (await import("@/i18n")).getDictionary(locale);
  return {
    title: dict.auth.title,
    description: dict.auth.subtitle,
  };
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <main className="flex-1 p-6 sm:p-8 lg:p-10">
        {children}
      </main>
    </div>
  );
}