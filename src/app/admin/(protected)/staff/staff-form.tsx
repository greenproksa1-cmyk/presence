"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Check, KeyRound, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import {
  createStaffAction,
  type StaffFormState,
} from "./actions";

function randomPassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export function StaffForm({
  labels,
}: {
  labels: {
    addTitle: string;
    name: string;
    email: string;
    password: string;
    passwordHint: string;
    generate: string;
    create: string;
    creating: string;
    created: string;
    createFailed: string;
    passwordOnce: string;
  };
}) {
  const [state, formAction, pending] = useActionState<StaffFormState, FormData>(
    createStaffAction,
    { ok: undefined, error: undefined, password: undefined, email: undefined } as StaffFormState,
  );
  const [password, setPassword] = useState("");

  return (
    <section className="rounded-2xl border border-border bg-white p-4 shadow-card sm:p-5">
      <h2 className="flex items-center gap-2 text-[0.9rem] font-bold text-navy-900">
        <Plus className="h-4 w-4 text-gold-600" aria-hidden="true" />
        {labels.addTitle}
      </h2>

      {state.ok && state.password ? (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[0.78rem]">
          <p className="flex items-center gap-1.5 font-semibold text-emerald-800">
            <Check className="h-4 w-4" aria-hidden="true" />
            {labels.created}
          </p>
          <p className="mt-1 text-emerald-700">{labels.passwordOnce}</p>
          <code
            dir="ltr"
            className="mt-2 block rounded-md bg-white px-2 py-1 font-mono text-[0.8rem] text-navy-900"
          >
            {state.email} · {state.password}
          </code>
        </div>
      ) : null}

      {state.error ? (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[0.78rem] text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {labels.createFailed}
        </p>
      ) : null}

      <form action={formAction} className="mt-3 space-y-3">
        <Field label={labels.name} htmlFor="staff-name" required>
          <Input id="staff-name" name="name" required minLength={3} maxLength={120} />
        </Field>
        <Field label={labels.email} htmlFor="staff-email" required>
          <Input id="staff-email" name="email" type="email" dir="ltr" required />
        </Field>
        <Field label={labels.password} htmlFor="staff-password" hint={labels.passwordHint}>
          <div className="flex gap-2">
            <Input
              id="staff-password"
              name="password"
              dir="ltr"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={12}
              maxLength={128}
              autoComplete="new-password"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setPassword(randomPassword())}
              className="shrink-0 gap-1.5 px-3"
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{labels.generate}</span>
            </Button>
          </div>
        </Field>
        <Button type="submit" variant="gold" disabled={pending} className="w-full gap-2">
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Plus className="h-4 w-4" aria-hidden="true" />
          )}
          {pending ? labels.creating : labels.create}
        </Button>
      </form>
    </section>
  );
}
