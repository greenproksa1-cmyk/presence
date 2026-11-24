import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/format";

export function PageHero({
  eyebrow,
  title,
  description,
  homeLabel,
  homeHref = "/",
  currentLabel,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  homeLabel: string;
  homeHref?: string;
  currentLabel: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-cream-100">
      <div className="pointer-events-none absolute inset-0 pattern-light opacity-40" />
      <div className="pointer-events-none absolute -top-28 end-[-6%] h-64 w-64 rounded-full border border-gold-200/60" />
      <div
        className={cn(
          "container-page relative",
          compact ? "py-8 sm:py-10" : "py-12 sm:py-16",
        )}
      >
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-[0.72rem] text-muted">
          <Link href={homeHref} className="transition-colors hover:text-navy-900">
            {homeLabel}
          </Link>
          <ChevronLeft className="h-3 w-3 flip-icon text-muted-soft" aria-hidden="true" />
          <span className="font-medium text-navy-800">{currentLabel}</span>
        </nav>

        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="eyebrow mb-3">
              <span className="h-px w-6 bg-gold-400" aria-hidden="true" />
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-[1.9rem] leading-[1.35] text-navy-950 sm:text-[2.5rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-[0.95rem] leading-8 text-muted">{description}</p>
          ) : null}
          {children}
        </div>
      </div>
      <div
        className="h-1 w-full bg-gradient-to-r from-gold-500 via-gold-300 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
