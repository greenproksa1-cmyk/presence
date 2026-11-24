import { randomUUID } from "node:crypto";
import { Prisma, PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

/**
 * `npm run db:seed`
 *
 * Idempotent seed for a fresh database:
 *  - the single `event_settings` row with the official copy and event date;
 *  - optionally, the first administrator when ADMIN_EMAIL is set.
 *
 * For local development `npm run dev` handles both automatically. This script
 * is for managed PostgreSQL (Supabase) where you run migrations once by hand.
 */

function loadEnv(): void {
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(file);
    } catch {
      // Optional file.
    }
  }
}

async function main(): Promise<void> {
  loadEnv();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set.");
  }

  const { DEFAULT_CONTENT, EVENT_DATE_FALLBACK, DEFAULT_MAP_URL } = await import(
    "@/lib/site-content"
  );
  const prisma = new PrismaClient();

  try {
    const settings = await prisma.eventSettings.upsert({
      where: { id: "main" },
      create: {
        id: "main",
        eventDate: EVENT_DATE_FALLBACK,
        mapUrl: DEFAULT_MAP_URL,
        contactEmail: "",
        contactPhone: "",
        whatsappNumber: "",
        whatsappEnabled: false,
        emailEnabled: true,
        content: DEFAULT_CONTENT as unknown as Prisma.InputJsonValue,
      },
      update: {},
      select: { id: true, eventDate: true },
    });
    console.log(`[seed] event_settings ready (${settings.id}, ${settings.eventDate.toISOString()})`);

    const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
    if (email) {
      const existing = await prisma.adminUser.findUnique({ where: { email } });
      if (existing) {
        console.log(`[seed] admin ${email} already exists`);
      } else {
        const provided = process.env.ADMIN_PASSWORD?.trim();
        if (provided && provided.length < 12) {
          throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
        }
        const password = provided || randomUUID().replaceAll("-", "");
        await prisma.adminUser.create({
          data: {
            name: (process.env.ADMIN_NAME ?? "Forum Administrator").trim(),
            email,
            passwordHash: await hash(password, 12),
            role: "SUPER_ADMIN",
          },
        });
        console.log(`[seed] admin ${email} created`);
        if (!provided) {
          console.log(`[seed] generated password (shown once): ${password}`);
        }
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("[seed] failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
