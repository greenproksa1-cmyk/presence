"use client";

import { useActionState, useRef } from "react";
import { AlertCircle, Check, Clock, Loader2, ScanLine } from "lucide-react";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { QrScanner } from "@/components/admin/qr-scanner";
import { checkInAction, initialCheckInState, type CheckInActionState } from "./actions";

export interface CheckInLabels {
  scanTitle: string;
  scanDescription: string;
  startCamera: string;
  stopCamera: string;
  cameraError: string;
  manualTitle: string;
  manualDescription: string;
  placeholder: string;
  submit: string;
  submitting: string;
  validTitle: string;
  validBody: string;
  alreadyTitle: string;
  alreadyBody: string;
  cancelledTitle: string;
  cancelledBody: string;
  invalidTitle: string;
  invalidBody: string;
  at: string;
  operator: string;
  clear: string;
  scanHint: string;
}

function formatTime(locale: Locale, iso: string): string {
  try {
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Riyadh",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function CheckInPanel({
  locale,
  labels,
}: {
  locale: Locale;
  labels: CheckInLabels;
}) {
  const [state, formAction, pending] = useActionState<CheckInActionState, FormData>(
    checkInAction,
    initialCheckInState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDetected(value: string) {
    if (inputRef.current) inputRef.current.value = value;
    formRef.current?.requestSubmit();
  }

  const tone =
    state.state === "VALID"
      ? "border-emerald-200 bg-emerald-50"
      : state.state === "ALREADY_CHECKED_IN"
        ? "border-amber-200 bg-amber-50"
        : "border-red-200 bg-red-50";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-white p-4 shadow-card sm:p-5">
        <h2 className="flex items-center gap-2 text-[0.9rem] font-bold text-navy-900">
          <ScanLine className="h-4 w-4 text-gold-600" aria-hidden="true" />
          {labels.scanTitle}
        </h2>
        <p className="mt-1 text-[0.75rem] leading-5 text-muted">{labels.scanDescription}</p>
        <div className="mt-3">
          <QrScanner
            onDetected={handleDetected}
            labels={{
              startCamera: labels.startCamera,
              stopCamera: labels.stopCamera,
              cameraError: labels.cameraError,
            }}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-card sm:p-5">
        <h2 className="text-[0.9rem] font-bold text-navy-900">{labels.manualTitle}</h2>
        <p className="mt-1 text-[0.75rem] leading-5 text-muted">{labels.manualDescription}</p>

        <form ref={formRef} action={formAction} className="mt-3 space-y-3">
          <input type="hidden" name="gate" value="main" />
          <Input
            ref={inputRef}
            name="value"
            dir="ltr"
            maxLength={120}
            autoComplete="off"
            spellCheck={false}
            placeholder={labels.placeholder}
            aria-label={labels.manualTitle}
            className="font-mono"
          />
          <Button type="submit" variant="gold" disabled={pending} className="w-full gap-2">
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Check className="h-4 w-4" aria-hidden="true" />
            )}
            {pending ? labels.submitting : labels.submit}
          </Button>
        </form>

        <p className="mt-3 text-[0.68rem] text-muted-soft">{labels.scanHint}</p>
      </section>

      {state.state !== "IDLE" ? (
        <section
          className={cn("rounded-2xl border p-4 sm:p-5 lg:col-span-2", tone)}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 shrink-0">
              {state.state === "VALID" ? (
                <Check className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              ) : state.state === "ALREADY_CHECKED_IN" ? (
                <Clock className="h-5 w-5 text-amber-600" aria-hidden="true" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[0.9rem] font-bold text-navy-950">
                {state.state === "VALID"
                  ? labels.validTitle
                  : state.state === "ALREADY_CHECKED_IN"
                    ? labels.alreadyTitle
                    : state.state === "CANCELLED"
                      ? labels.cancelledTitle
                      : labels.invalidTitle}
              </p>
              <p className="mt-1 text-[0.78rem] leading-6 text-muted">
                {state.state === "VALID"
                  ? labels.validBody
                  : state.state === "ALREADY_CHECKED_IN"
                    ? labels.alreadyBody
                    : state.state === "CANCELLED"
                      ? labels.cancelledBody
                      : labels.invalidBody}
              </p>

              {state.registration ? (
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-[0.65rem] text-muted-soft">{labels.operator}</dt>
                    <dd className="text-[0.8rem] font-semibold text-navy-900">
                      {state.registration.fullName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] text-muted-soft">#{state.registration.registrationNumber}</dt>
                    <dd dir="ltr" className="font-mono text-[0.8rem] font-semibold text-navy-900">
                      {state.registration.registrationNumber}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] text-muted-soft">{labels.at}</dt>
                    <dd className="text-[0.8rem] font-semibold text-navy-900">
                      {state.checkedInAt ? formatTime(locale, state.checkedInAt) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] text-muted-soft">{labels.operator}</dt>
                    <dd className="text-[0.8rem] font-semibold text-navy-900">
                      {state.operator ?? "—"}
                    </dd>
                  </div>
                </dl>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
