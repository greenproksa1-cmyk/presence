import * as React from "react";
import { cn } from "@/lib/format";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("card-soft", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6 pb-0", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-lg font-bold text-navy-900 leading-snug", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm leading-7 text-muted", className)} {...props} />;
}

const badgeStyles = {
  neutral: "bg-cream-200 text-navy-700 border-border",
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  navy: "bg-navy-50 text-navy-800 border-navy-100",
  gold: "bg-gold-50 text-gold-800 border-gold-200",
  outline: "bg-transparent text-muted border-border",
} as const;

export function Badge({
  tone = "neutral",
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { tone?: keyof typeof badgeStyles }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold leading-none",
        badgeStyles[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
