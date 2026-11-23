"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      language?: string;
      callback?: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileWidget({
  siteKey,
  language,
}: {
  siteKey: string;
  language: "ar" | "en";
}) {
  const container = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !container.current || !window.turnstile) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      theme: "light",
      language: language === "ar" ? "ar" : "en",
      callback: (token) => {
        if (input.current) input.current.value = token;
      },
      "expired-callback": () => {
        if (input.current) input.current.value = "";
      },
      "error-callback": () => {
        if (input.current) input.current.value = "";
      },
    });
    return () => {
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* widget already removed */
        }
      }
      widgetId.current = null;
    };
  }, [ready, siteKey, language]);

  return (
    <div>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      {!ready ? (
        <div className="h-[65px] w-full max-w-[300px] animate-pulse rounded-lg border border-border bg-cream-200" />
      ) : null}
      <div ref={container} />
      <input ref={input} type="hidden" name="cf-turnstile-response" />
    </div>
  );
}
