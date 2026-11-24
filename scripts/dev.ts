import { randomBytes, randomUUID } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { hash } from "bcryptjs";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import {
  LOCAL_DATABASE_URL,
  LOCAL_DB_DIR,
  LOCAL_DB_PORT,
  applyLocalMigrations,
  openLocalDatabase,
} from "./local-db";

/**
 * `npm run dev`
 *
 * 1. Creates `.env.local` with strong local secrets on first run.
 * 2. Boots an embedded PostgreSQL (PGlite) on 127.0.0.1:55432.
 * 3. Applies the Prisma migrations.
 * 4. Seeds the settings row and one admin account with a random password.
 * 5. Starts `next dev` against that database.
 */

const ROOT = process.cwd();
const ENV_PATH = path.join(ROOT, ".env.local");

function ensureEnvFile(): void {
  const existing = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
  const lines = existing.split(/\r?\n/);
  const has = (key: string) =>
    lines.some((line) => line.trimStart().startsWith(`${key}=`) && line.includes("=") && line.split("=")[1]?.replaceAll('"', "").trim().length > 0);

  const additions: string[] = [];
  if (!has("DATABASE_URL")) additions.push(`DATABASE_URL="${LOCAL_DATABASE_URL}"`);
  if (!has("NEXT_PUBLIC_SITE_URL")) additions.push(`NEXT_PUBLIC_SITE_URL="http://localhost:3000"`);
  if (!has("SESSION_SECRET")) {
    additions.push(`SESSION_SECRET="${randomBytes(48).toString("base64url")}"`);
  }
  if (!has("TOKEN_ENCRYPTION_KEY")) {
    additions.push(`TOKEN_ENCRYPTION_KEY="${randomBytes(32).toString("base64")}"`);
  }

  if (additions.length > 0) {
    mkdirSync(ROOT, { recursive: true });
    const prefix = existing.length > 0 && !existing.endsWith("\n") ? "\n" : "";
    writeFileSync(ENV_PATH, `${existing}${prefix}${additions.join("\n")}\n`, "utf8");
    console.log(`[dev] wrote ${additions.length} local secret(s) to .env.local`);
  }
}

async function bootstrapAdmin(db: Awaited<ReturnType<typeof openLocalDatabase>>): Promise<void> {
  const existing = await db.query<{ count: number }>(
    `SELECT count(*)::int AS count FROM "admin_users"`,
  );
  if ((existing.rows[0]?.count ?? 0) > 0) return;

  const email = process.env.ADMIN_EMAIL?.trim() || "admin@makkahfoodforum.local";
  const name = process.env.ADMIN_NAME?.trim() || "Forum Administrator";
  const password = process.env.ADMIN_PASSWORD?.trim() || randomBytes(12).toString("base64url");
  const passwordHash = await hash(password, 12);

  await db.query(
    `INSERT INTO "admin_users" ("id", "name", "email", "password_hash", "role", "is_active", "created_at", "updated_at")
     VALUES ($1, $2, $3, $4, 'SUPER_ADMIN', true, now(), now())`,
    [randomUUID(), name, email, passwordHash],
  );

  console.log("");
  console.log("  ┌──────────────────────────────────────────────────────────────┐");
  console.log("  │  Local admin account created (shown once)                    │");
  console.log("  └──────────────────────────────────────────────────────────────┘");
  console.log(`     URL:      http://localhost:3000/admin/login`);
  console.log(`     Email:    ${email}`);
  console.log(`     Password: ${password}`);
  console.log("     Change it after signing in. Nothing is stored in the repo.");
  console.log("");
}

async function main(): Promise<void> {
  ensureEnvFile();
  mkdirSync(LOCAL_DB_DIR, { recursive: true });

  console.log("[dev] starting embedded PostgreSQL (PGlite)…");
  const db = await openLocalDatabase();
  const applied = await applyLocalMigrations(db);
  if (applied.length > 0) {
    console.log(`[dev] applied migrations: ${applied.join(", ")}`);
  } else {
    console.log("[dev] database schema is up to date");
  }

  await bootstrapAdmin(db);

  const server = new PGLiteSocketServer({
    db,
    port: LOCAL_DB_PORT,
    host: "127.0.0.1",
  });
  await server.start();
  console.log(`[dev] PostgreSQL listening on 127.0.0.1:${LOCAL_DB_PORT}`);

  const child: ChildProcess = spawn("npx", ["next", "dev"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, DATABASE_URL: LOCAL_DATABASE_URL },
  });

  let shuttingDown = false;
  async function shutdown(code = 0): Promise<void> {
    if (shuttingDown) return;
    shuttingDown = true;
    child.kill();
    await server.stop().catch(() => undefined);
    await db.close().catch(() => undefined);
    process.exit(code);
  }

  child.on("exit", (code) => {
    void shutdown(code ?? 0);
  });

  process.on("SIGINT", () => void shutdown(0));
  process.on("SIGTERM", () => void shutdown(0));
}

main().catch((error: unknown) => {
  console.error("[dev] failed to start:", error);
  process.exit(1);
});
