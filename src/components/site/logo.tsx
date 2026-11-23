import Image from "next/image";
import { cn } from "@/lib/format";

export function Logo({
  src,
  className,
  size = 44,
  priority = false,
}: {
  src: string;
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream-100 ring-1 ring-border",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        unoptimized
        priority={priority}
        className="h-full w-full object-contain p-1"
      />
    </span>
  );
}
