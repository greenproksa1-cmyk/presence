"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AlertCircle, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { signInAction, type LoginState } from "./actions";

export function LoginForm({
  labels,
}: {
  labels: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    invalid: string;
    rateLimited: string;
    backToSite: string;
    staffNotice: string;
  };
}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    signInAction,
    {},
  );

  const errorMessage =
    state.error === "rate_limited"
      ? labels.rateLimited
      : state.error
        ? labels.invalid
        : null;

  return (
    <section className="flex min-h-screen items-center justify-center bg-cream-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-card sm:p-10">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-300">
            <LockKeyhole className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-navy-950">{labels.title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted">{labels.subtitle}</p>
        </div>

        {errorMessage ? (
          <div
            className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <form action={formAction} className="space-y-5">
          <Field label={labels.email} htmlFor="email" required>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              inputMode="email"
              dir="ltr"
              required
            />
          </Field>

          <Field label={labels.password} htmlFor="password" required>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              dir="ltr"
              required
            />
          </Field>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {labels.signingIn}
              </span>
            ) : (
              labels.signIn
            )}
          </Button>
        </form>

        <p className="mt-6 flex items-start gap-2 rounded-lg bg-cream-100 p-3 text-[0.72rem] leading-5 text-muted">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
          {labels.staffNotice}
        </p>

        <p className="mt-5 text-center text-[0.75rem] text-muted-soft">
          <Link
            href="/"
            className="font-medium text-navy-800 underline underline-offset-4 hover:text-gold-700"
          >
            {labels.backToSite}
          </Link>
        </p>
      </div>
    </section>
  );
}
