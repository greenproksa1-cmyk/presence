import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="eyebrow mb-3">
            <span className="h-px w-6 bg-gold-400" aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-[1.75rem] leading-[1.35] text-navy-950 sm:text-[2.1rem]">
          {title}
        </h2>
        {description ? (
          <div className="mt-3 text-[0.95rem] leading-8 text-muted">{description}</div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
