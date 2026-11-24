import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

/**
 * `npm run admin:bootstrap`
 *
 * Creates the first administrator with a strong, randomly generated password
 * unless ADMIN_PASSWORD is supplied. There are no default credentials and the
 * password is printed once, never stored in the repository.
 *
 * Requires DATABASE_URL. For local development, `npm run dev` already creates
 * one admin automatically on first run.
 */

function loadEnv(): void {
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(file);
    } catch {
      // File may not exist; environment variables can come from the shell.
    }
  }
}

async function main(): Promise<void> {
  loadEnv();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local first.");
  }

  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Set ADMIN_EMAIL to a valid email address before running this script.");
  }

  const providedPassword = process.env.ADMIN_PASSWORD?.trim();
  if (providedPassword && providedPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }
  const password = providedPassword || randomBytes(18).toString("base64url");
  const passwordHash = await hash(password, 12);

  const prisma = new PrismaClient();
  try {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      console.log(`[admin] an account already exists for ${email}; nothing changed.`);
      return;
    }

    const created = await prisma.adminUser.create({
      data: {
        name: (process.env.ADMIN_NAME ?? "Forum Administrator").trim(),
        email,
        passwordHash,
        role: "SUPER_ADMIN",
        isActive: true,
      },
      select: { id: true, email: true, role: true },
    });

    console.log(`[admin] created ${created.role} account: ${created.email}`);
    if (!providedPassword) {
      console.log("");
      console.log("  Password (shown once, store it in a password manager):");
      console.log(`  ${password}`);
      console.log("");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("[admin] bootstrap failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
