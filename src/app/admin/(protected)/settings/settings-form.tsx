"use client";

import { useActionState } from "react";
import { AlertCircle, Check, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import {
  initialSettingsFormState,
  updateSettingsAction,
  type SettingsFormState,
} from "./actions";

export interface SettingsValues {
  eventDate: string;
  logoUrl: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  venueImageUrl: string;
  mapUrl: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  emailEnabled: boolean;
  whatsappEnabled: boolean;
  brandNameAr: string;
  brandNameEn: string;
  brandShortAr: string;
  brandShortEn: string;
  brandTaglineAr: string;
  brandTaglineEn: string;
  heroDescriptionAr: string;
  heroDescriptionEn: string;
}

export function SettingsForm({
  values,
  labels,
}: {
  values: SettingsValues;
  labels: {
    eventSection: string;
    eventDate: string;
    contactSection: string;
    contactEmail: string;
    contactPhone: string;
    whatsappNumber: string;
    linksSection: string;
    logoUrl: string;
    heroImageUrl: string;
    aboutImageUrl: string;
    venueImageUrl: string;
    mapUrl: string;
    brandSection: string;
    brandNameAr: string;
    brandNameEn: string;
    brandShortAr: string;
    brandShortEn: string;
    brandTaglineAr: string;
    brandTaglineEn: string;
    heroDescriptionAr: string;
    heroDescriptionEn: string;
    togglesSection: string;
    emailEnabled: string;
    whatsappEnabled: string;
    save: string;
    saving: string;
    saved: string;
    saveFailed: string;
    contentNote: string;
  };
}) {
  const [state, formAction, pending] = useActionState<SettingsFormState, FormData>(
    updateSettingsAction,
    initialSettingsFormState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.ok ? (
        <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[0.8rem] font-medium text-emerald-800">
          <Check className="h-4 w-4" aria-hidden="true" />
          {labels.saved}
        </p>
      ) : null}
      {state.error ? (
        <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[0.8rem] font-medium text-red-700">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {labels.saveFailed}
        </p>
      ) : null}

      <section className="rounded-2xl border border-border bg-white p-4 shadow-card sm:p-5">
        <h2 className="text-[0.9rem] font-bold text-navy-900">{labels.eventSection}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label={labels.eventDate} htmlFor="eventDate">
            <Input id="eventDate" name="eventDate" type="date" defaultValue={values.eventDate} dir="ltr" />
          </Field>
          <Field label={labels.mapUrl} htmlFor="mapUrl">
            <Input id="mapUrl" name="mapUrl" defaultValue={values.mapUrl} dir="ltr" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-card sm:p-5">
        <h2 className="text-[0.9rem] font-bold text-navy-900">{labels.contactSection}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label={labels.contactEmail} htmlFor="contactEmail">
            <Input id="contactEmail" name="contactEmail" type="email" defaultValue={values.contactEmail} dir="ltr" />
          </Field>
          <Field label={labels.contactPhone} htmlFor="contactPhone">
            <Input id="contactPhone" name="contactPhone" defaultValue={values.contactPhone} dir="ltr" />
          </Field>
          <Field label={labels.whatsappNumber} htmlFor="whatsappNumber">
            <Input id="whatsappNumber" name="whatsappNumber" defaultValue={values.whatsappNumber} dir="ltr" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-card sm:p-5">
        <h2 className="text-[0.9rem] font-bold text-navy-900">{labels.brandSection}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label={labels.brandNameAr} htmlFor="brandNameAr">
            <Input id="brandNameAr" name="brandNameAr" defaultValue={values.brandNameAr} />
          </Field>
          <Field label={labels.brandNameEn} htmlFor="brandNameEn">
            <Input id="brandNameEn" name="brandNameEn" defaultValue={values.brandNameEn} dir="ltr" />
          </Field>
          <Field label={labels.brandShortAr} htmlFor="brandShortAr">
            <Input id="brandShortAr" name="brandShortAr" defaultValue={values.brandShortAr} />
          </Field>
          <Field label={labels.brandShortEn} htmlFor="brandShortEn">
            <Input id="brandShortEn" name="brandShortEn" defaultValue={values.brandShortEn} dir="ltr" />
          </Field>
          <Field label={labels.brandTaglineAr} htmlFor="brandTaglineAr">
            <Input id="brandTaglineAr" name="brandTaglineAr" defaultValue={values.brandTaglineAr} />
          </Field>
          <Field label={labels.brandTaglineEn} htmlFor="brandTaglineEn">
            <Input id="brandTaglineEn" name="brandTaglineEn" defaultValue={values.brandTaglineEn} dir="ltr" />
          </Field>
          <Field label={labels.heroDescriptionAr} htmlFor="heroDescriptionAr" className="sm:col-span-2">
            <textarea
              id="heroDescriptionAr"
              name="heroDescriptionAr"
              defaultValue={values.heroDescriptionAr}
              rows={3}
              className="w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-[0.9rem] text-ink focus:border-navy-400 focus:outline-none focus:ring-4 focus:ring-navy-500/10"
            />
          </Field>
          <Field label={labels.heroDescriptionEn} htmlFor="heroDescriptionEn" className="sm:col-span-2">
            <textarea
              id="heroDescriptionEn"
              name="heroDescriptionEn"
              defaultValue={values.heroDescriptionEn}
              rows={3}
              dir="ltr"
              className="w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-[0.9rem] text-ink focus:border-navy-400 focus:outline-none focus:ring-4 focus:ring-navy-500/10"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-card sm:p-5">
        <h2 className="text-[0.9rem] font-bold text-navy-900">{labels.linksSection}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label={labels.logoUrl} htmlFor="logoUrl">
            <Input id="logoUrl" name="logoUrl" defaultValue={values.logoUrl} dir="ltr" />
          </Field>
          <Field label={labels.heroImageUrl} htmlFor="heroImageUrl">
            <Input id="heroImageUrl" name="heroImageUrl" defaultValue={values.heroImageUrl} dir="ltr" />
          </Field>
          <Field label={labels.aboutImageUrl} htmlFor="aboutImageUrl">
            <Input id="aboutImageUrl" name="aboutImageUrl" defaultValue={values.aboutImageUrl} dir="ltr" />
          </Field>
          <Field label={labels.venueImageUrl} htmlFor="venueImageUrl">
            <Input id="venueImageUrl" name="venueImageUrl" defaultValue={values.venueImageUrl} dir="ltr" />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-card sm:p-5">
        <h2 className="text-[0.9rem] font-bold text-navy-900">{labels.togglesSection}</h2>
        <div className="mt-3 flex flex-wrap gap-5">
          <label className="inline-flex items-center gap-2 text-[0.82rem] text-navy-900">
            <input
              type="checkbox"
              name="emailEnabled"
              defaultChecked={values.emailEnabled}
              className="h-4 w-4 rounded border-border-strong accent-navy-900"
            />
            {labels.emailEnabled}
          </label>
          <label className="inline-flex items-center gap-2 text-[0.82rem] text-navy-900">
            <input
              type="checkbox"
              name="whatsappEnabled"
              defaultChecked={values.whatsappEnabled}
              className="h-4 w-4 rounded border-border-strong accent-navy-900"
            />
            {labels.whatsappEnabled}
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="gold" disabled={pending} className="gap-2">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="h-4 w-4" aria-hidden="true" />
          )}
          {pending ? labels.saving : labels.save}
        </Button>
        <p className="text-[0.72rem] text-muted">{labels.contentNote}</p>
      </div>
    </form>
  );
}
