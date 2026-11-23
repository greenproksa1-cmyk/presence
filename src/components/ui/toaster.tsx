"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster({ dir }: { dir: "rtl" | "ltr" }) {
  return (
    <Sonner
      dir={dir}
      position="top-center"
      toastOptions={{
        style: {
          fontFamily:
            dir === "rtl"
              ? "var(--font-arabic)"
              : "var(--font-sans)",
          border: "1px solid var(--color-border)",
          background: "#fff",
          color: "var(--color-ink)",
        },
      }}
    />
  );
}
