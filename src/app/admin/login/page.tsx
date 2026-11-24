import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/i18n/server";
import { getAuth } from "@/lib/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "دخول لوحة التحكم | Admin sign in",
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const auth = await getAuth();
  if (auth.user) {
    redirect(auth.user.role === "ADMIN" ? "/admin/dashboard" : "/admin/check-in");
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <LoginForm
      labels={{
        title: dict.auth.title,
        subtitle: dict.auth.subtitle,
        email: dict.auth.email,
        password: dict.auth.password,
        signIn: dict.auth.signIn,
        signingIn: dict.auth.signingIn,
        invalid: dict.auth.invalid,
        rateLimited: dict.auth.rateLimited,
        backToSite: dict.auth.backToSite,
        staffNotice: dict.auth.staffNotice,
      }}
    />
  );
}
