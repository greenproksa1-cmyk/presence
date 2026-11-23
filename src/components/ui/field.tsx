import * as React from "react";
import { cn } from "@/lib/format";

const baseField =
  "w-full rounded-xl border border-border-strong bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted-soft/70 shadow-[0_1px_1px_rgba(16,24,40,0.02)] transition-colors focus:border-navy-400 focus:outline-none focus:ring-4 focus:ring-navy-500/10 disabled:cursor-not-allowed disabled:bg-cream-200 disabled:text-muted";

export function Input({
  className,
  invalid,
  ...props
}: React.ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      className={cn(
        baseField,
        "h-12",
        invalid && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Textarea({
  className,
  invalid,
  ...props
}: React.ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(
        baseField,
        "min-h-28 resize-y leading-7",
        invalid && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: React.ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <select
      className={cn(
        baseField,
        "h-12 appearance-none cursor-pointer",
        invalid && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
        className,
      )}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  );
}

export function Field({
  label,
  htmlFor,
  required,
  optionalLabel,
  hint,
  error,
  children,
  className,
}: {
  label: React.ReactNode;
  htmlFor: string;
  required?: boolean;
  optionalLabel?: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-navy-900">
          {label}
          {required ? (
            <span className="ms-1 text-gold-600" aria-hidden="true">
              *
            </span>
          ) : optionalLabel ? (
            <span className="ms-2 text-[0.7rem] font-normal text-muted-soft">
              ({optionalLabel})
            </span>
          ) : null}
        </label>
      </div>
      {children}
      {hint && !error ? (
        <p className="text-xs leading-5 text-muted-soft">{hint}</p>
      ) : null}
      {error ? (
        <p className="text-xs font-medium leading-5 text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
