import { z } from "zod";
import type { Dictionary } from "@/i18n/dictionary";
import { dictionaries } from "@/i18n/dictionary";
import type { Locale } from "@/lib/types";
import { isValidCountryCode } from "@/lib/countries";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { normalizePhone } from "@/lib/phone";

export function buildRegistrationSchema(locale: Locale) {
  const messages = dictionaries[locale].register.errors;

  const phoneSchema = z
    .string({ error: messages.phoneRequired })
    .trim()
    .min(1, { error: messages.phoneRequired })
    .max(40, { error: messages.phoneInvalid });

  return z
    .object({
      fullName: z
        .string({ error: messages.nameRequired })
        .trim()
        .min(1, { error: messages.nameRequired })
        .min(3, { error: messages.nameLength })
        .max(120, { error: messages.nameLength }),
      email: z
        .string({ error: messages.emailRequired })
        .trim()
        .min(1, { error: messages.emailRequired })
        .max(254, { error: messages.emailInvalid })
        .refine(isValidEmail, { error: messages.emailInvalid })
        .transform(normalizeEmail),
      phone: phoneSchema,
      countryCode: z
        .string({ error: messages.countryInvalid })
        .trim()
        .toUpperCase()
        .refine(isValidCountryCode, { error: messages.countryInvalid }),
      city: z
        .string({ error: messages.cityRequired })
        .trim()
        .min(1, { error: messages.cityRequired })
        .min(2, { error: messages.cityRequired })
        .max(80),
      company: z
        .string({ error: messages.companyRequired })
        .trim()
        .min(1, { error: messages.companyRequired })
        .min(2, { error: messages.companyRequired })
        .max(140),
      jobTitle: z
        .string({ error: messages.jobTitleRequired })
        .trim()
        .min(1, { error: messages.jobTitleRequired })
        .min(2, { error: messages.jobTitleRequired })
        .max(100),
      organizationType: z
        .string({ error: messages.orgTypeInvalid })
        .refine(
          (value) =>
            dictionaries[locale].orgTypes[value as keyof Dictionary["orgTypes"]] !==
            undefined,
          { error: messages.orgTypeInvalid },
        )
        .transform((value) => value as keyof Dictionary["orgTypes"]),
      interest: z
        .string()
        .trim()
        .max(300, { error: messages.interestMax })
        .optional()
        .or(z.literal(""))
        .transform((value) => (value ? value : undefined)),
      consent: z.preprocess(
        (value) => value === true || value === "true" || value === "on" || value === "1",
        z.literal(true, { error: messages.consentRequired }),
      ),
      locale: z.enum(["ar", "en"]).default(locale),
    })
    .superRefine((data, ctx) => {
      if (!normalizePhone(data.phone, data.countryCode)) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: messages.phoneInvalid,
        });
      }
    });
}

export type RegistrationFormValues = z.infer<ReturnType<typeof buildRegistrationSchema>>;

export function flattenFieldErrors(
  error: z.ZodError,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}

export const loginSchema = z.object({
  email: z.email({ error: "invalid" }).transform(normalizeEmail),
  password: z.string().min(1, { error: "invalid" }).max(128),
  next: z.string().optional(),
});

export const adminRegistrationEditSchema = z
  .object({
    fullName: z.string().trim().min(3).max(120),
    email: z.email().max(254).transform(normalizeEmail),
    phone: z.string().trim().min(6).max(40),
    countryCode: z
      .string()
      .trim()
      .toUpperCase()
      .refine(isValidCountryCode),
    city: z.string().trim().min(2).max(80),
    company: z.string().trim().min(2).max(140),
    jobTitle: z.string().trim().min(2).max(100),
    organizationType: z.string().min(1).max(60),
    interest: z.string().trim().max(300).optional(),
  })
  .superRefine((data, ctx) => {
    if (!normalizePhone(data.phone, data.countryCode)) {
      ctx.addIssue({ code: "custom", path: ["phone"], message: "رقم الجوال غير صحيح." });
    }
  });

export const passwordSchema = z
  .string()
  .min(12, { error: "كلمة المرور يجب أن تكون 12 حرفًا على الأقل." })
  .max(128, { error: "كلمة المرور طويلة جدًا." })
  .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), {
    error: "يجب أن تحتوي كلمة المرور على حروف وأرقام.",
  });

export const staffCreateSchema = z.object({
  name: z.string().trim().min(3).max(120),
  email: z.email().max(254).transform(normalizeEmail),
  password: passwordSchema,
});

export const staffPasswordSchema = z.object({
  password: passwordSchema,
});
