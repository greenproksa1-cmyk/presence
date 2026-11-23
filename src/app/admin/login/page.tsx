import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/format";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createSession } from "@/lib/session";
import { getDictionary, getLocale } from "@/i18n";
import { Metadata } from "next";

const ADMIN_PASSWORD_HASH = "$2a$10$VjYD.MOeB2O0GW5AvOe.wumM2GZb8R.zEIZ4.kaxqR/tH1YKq.HeWu";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [locale, setLocale] = useState<Locale | null>(null);
  const [dict, setDict] = useState<Dictionary | null>(null);

  useEffect(() => {
    async function fetchLocale() {
      const locale = await getLocale();
      setLocale(locale);
      setDict(getDictionary(locale));
    }
    fetchLocale();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    try {
      const passwordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
      if (!passwordValid) {
        throw new Error(dict.auth.invalid);
      }
      await createSession(
        { type: "ADMIN", id: "1", email },
        { ip: null, userAgent: null },
      );
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || dict.auth.invalid);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-cream-100">
      <div className="container-page max-w-md w-full bg-white rounded-2xl border border-border p-8 sm:p-10 shadow-card">
        <div className="text-center mb-8">
          <ShieldCheck className="mx-auto h-12 w-12 text-gold-600 mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-navy-950">{dict.auth.title}</h1>
          <p className="text-muted mt-2">{dict.auth.subtitle}</p>
        </div>

        {error ? (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200">
            <span className="text-red-700">{error}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email">{dict.auth.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={dict.auth.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">{dict.auth.password}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder={dict.auth.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {dict.auth.signingIn}
              </span>
            ) : (
              <span>{dict.auth.signIn}</span>
            )}
          </Button>

          <p className="text-center text-[0.75rem] text-muted-soft">
            <Link href="/admin/check-in" className="font-medium text-navy-800 underline underline-offset-4 hover:text-gold-700">
              {dict.auth.backToSite}
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-navy-800 mb-1.5">
      {children}
    </label>
  );
}