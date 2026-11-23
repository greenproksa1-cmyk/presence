"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, LockKeyhole, ShieldCheck, Ticket } from "lucide-react";
import {
  initialRegistrationState,
  registerAction,
  type RegistrationActionState,
} from "@/app/(site)/register/actions";
import type { Dictionary } from "@/i18n/dictionary";
import type { CountryOption } from "@/lib/countries";
import type { Locale, OrganizationTypeKey } from "@/lib/types";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "@/components/site/turnstile-widget";
import { cn } from "@/lib/format";

export function RegistrationForm({
  locale,
  dict,
  countries,
  orgTypes,
  turnstileSiteKey,
  startedAt,
}: {
  locale: Locale;
  dict: Dictionary;
  countries: CountryOption[];
  orgTypes: Array<{ value: OrganizationTypeKey; label: string }>;
  turnstileSiteKey: string | null;
  startedAt: number;
}) {
  const [state, action, pending] = useActionState<RegistrationActionState, FormData>(
    registerAction,
    initialRegistrationState,
  );
  const [turnstileNonce, setTurnstileNonce] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.formError && !state.fieldErrors) return;
    setTurnstileNonce((value) => value + 1);
    const firstInvalid = formRef.current?.querySelector<HTMLElement>(
      "[aria-invalid='true']",
    );
    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: true });
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state]);

  const errors = state.fieldErrors ?? {};
  const r = dict.register;
  const optional = dict.common.optional;

  return (
    <form
      ref={formRef}
      action={action}
      noValidate
      className="relative"
      aria-describedby={state.formError ? "registration-error" : undefined}
    >
      <input type="hidden" name="startedAt" value={startedAt} />
      <input type="hidden" name="locale" value={locale} />
      <div className="sr-only absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.formError ? (
        <div
          ref={errorRef}
          id="registration-error"
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-[0.85rem] leading-6 text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">{state.formError}</p>
            {state.code === "duplicate" ? (
              <p className="mt-1 text-red-700">{r.alreadyRegistered}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="space-y-8">
        <section aria-labelledby="personal-heading">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-[0.72rem] font-bold text-white">
              1
            </span>
            <h2 id="personal-heading" className="text-[1.02rem] font-bold text-navy-900">
              {r.personalSection}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={r.fullName}
              htmlFor="fullName"
              required
              error={errors.fullName}
              className="sm:col-span-2"
            >
              <Input
                id="fullName"
                name="fullName"
                autoComplete="name"
                placeholder={r.fullNamePlaceholder}
                maxLength={120}
                invalid={Boolean(errors.fullName)}
                required
              />
            </Field>

            <Field label={r.email} htmlFor="email" required error={errors.email}>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                placeholder={r.emailPlaceholder}
                maxLength={254}
                invalid={Boolean(errors.email)}
                required
              />
            </Field>

            <Field label={r.phone} htmlFor="phone" required error={errors.phone} hint={r.phoneHint}>
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                placeholder={r.phonePlaceholder}
                maxLength={40}
                invalid={Boolean(errors.phone)}
                required
              />
            </Field>

            <Field label={r.country} htmlFor="countryCode" required error={errors.countryCode}>
              <Select
                id="countryCode"
                name="countryCode"
                defaultValue="SA"
                autoComplete="country"
                invalid={Boolean(errors.countryCode)}
                required
              >
                <option value="">{r.countryPlaceholder}</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={r.city} htmlFor="city" required error={errors.city}>
              <Input
                id="city"
                name="city"
                autoComplete="address-level2"
                placeholder={r.cityPlaceholder}
                maxLength={80}
                invalid={Boolean(errors.city)}
                required
              />
            </Field>
          </div>
        </section>

        <div className="hairline" />

        <section aria-labelledby="work-heading">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-[0.72rem] font-bold text-white">
              2
            </span>
            <h2 id="work-heading" className="text-[1.02rem] font-bold text-navy-900">
              {r.workSection}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={r.company}
              htmlFor="company"
              required
              error={errors.company}
              className="sm:col-span-2"
            >
              <Input
                id="company"
                name="company"
                autoComplete="organization"
                placeholder={r.companyPlaceholder}
                maxLength={140}
                invalid={Boolean(errors.company)}
                required
              />
            </Field>

            <Field label={r.jobTitle} htmlFor="jobTitle" required error={errors.jobTitle}>
              <Input
                id="jobTitle"
                name="jobTitle"
                autoComplete="organization-title"
                placeholder={r.jobTitlePlaceholder}
                maxLength={100}
                invalid={Boolean(errors.jobTitle)}
                required
              />
            </Field>

            <Field
              label={r.organizationType}
              htmlFor="organizationType"
              required
              error={errors.organizationType}
            >
              <Select
                id="organizationType"
                name="organizationType"
                defaultValue=""
                invalid={Boolean(errors.organizationType)}
                required
              >
                <option value="">{r.organizationTypePlaceholder}</option>
                {orgTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </section>

        <div className="hairline" />

        <section aria-labelledby="interest-heading">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-100 text-[0.72rem] font-bold text-gold-800">
              3
            </span>
            <h2 id="interest-heading" className="text-[1.02rem] font-bold text-navy-900">
              {r.interestSection}
            </h2>
          </div>

          <Field
            label={r.interest}
            htmlFor="interest"
            optionalLabel={optional}
            error={errors.interest}
          >
            <Textarea
              id="interest"
              name="interest"
              placeholder={r.interestPlaceholder}
              maxLength={300}
              rows={3}
              invalid={Boolean(errors.interest)}
            />
          </Field>
        </section>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-cream-50 p-4">
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            value="true"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-border-strong accent-gold-500"
            aria-invalid={Boolean(errors.consent) || undefined}
            required
          />
          <span className="text-[0.8rem] leading-6 text-muted">
            {r.consent}{" "}
            <Link
              href="/privacy"
              className="font-semibold text-navy-800 underline underline-offset-4 hover:text-gold-700"
              target="_blank"
            >
              {r.privacyLink}
            </Link>
          </span>
        </label>
        {errors.consent ? (
          <p className="mt-2 ps-7 text-xs font-medium text-red-600" role="alert">
            {errors.consent}
          </p>
        ) : null}
      </div>

      {turnstileSiteKey ? (
        <div className="mt-5">
          <TurnstileWidget
            key={turnstileNonce}
            siteKey={turnstileSiteKey}
            language={locale}
          />
        </div>
      ) : null}

      <div className="mt-6">
        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={pending}
          className={cn("h-12 w-full gap-2 text-[0.95rem]", pending && "cursor-wait")}
        >
          <Ticket className="h-4.5 w-4.5" aria-hidden="true" />
          {pending ? r.submitting : r.submit}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[0.7rem] text-muted-soft">
          <LockKeyhole className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
          {r.secureNote}
        </p>
      </div>

      <div className="mt-6 grid gap-2 border-t border-border pt-4 text-[0.72rem] leading-6 text-muted-soft sm:grid-cols-2">
        <p className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
          {r.emailQueued}
        </p>
        <p className="sm:text-end">{r.alreadyRegistered}</p>
      </div>
    </form>
  );
}
