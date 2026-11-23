import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/lib/types";
import { EVENT_TIMEZONE } from "@/lib/site-content";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDateTime(locale: Locale, date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: EVENT_TIMEZONE,
  }).format(value);
}

export function formatTime(locale: Locale, date: Date | string): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: EVENT_TIMEZONE,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-GB").format(value);
}

export function formatPercent(value: number): string {
  return `${new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value)}%`;
}

export function truncate(value: string, max = 80): string {
  if (value.length <= max) return value;
  return `${value.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(2, local.length - 2))}@${domain}`;
}

export function buttonVariants({ variant, size }: { variant: "gold" | "outline" | "danger"; size: "sm" | "lg" | "xl" }): string {
  const base = {
    gold: "bg-gold-600 text-navy-950 hover:bg-gold-500",
    outline: "border border-gold-600 text-gold-600 hover:bg-gold-50",
    danger: "bg-red-600 text-white hover:bg-red-500",
  }[variant];
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    lg: "px-6 py-2 text-lg",
    xl: "px-8 py-3 text-xl",
  }[size];
  return `${base} ${sizeStyles}`;
}
