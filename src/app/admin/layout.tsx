import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-cream-100">{children}</div>;
}
