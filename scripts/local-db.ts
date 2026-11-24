import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

/**
 * Local development database helpers.
 *
 * The project targets a real PostgreSQL database in production (Supabase).
 * For local development we run an embedded PostgreSQL (PGlite) and expose it
 * over a TCP socket so Prisma can connect to it exactly like a normal server.
 */

export const LOCAL_DB_DIR = path.join(process.cwd(), ".data", "pglite");
export const LOCAL_DB_PORT = 55432;
export const LOCAL_DATABASE_URL = `postgresql://postgres:postgres@127.0.0.1:${LOCAL_DB_PORT}/postgres?schema=public&connection_limit=5`;

export async function openLocalDatabase(): Promise<PGlite> {
  const db = await PGlite.create({ dataDir: LOCAL_DB_DIR });
  return db;
}

/**
 * Applies every migration file in `prisma/migrations` in order, tracking what
 * has already run in `_local_migrations`. Prisma Migrate owns the production
 * history; this tracker exists only so `npm run dev` is idempotent locally.
 */
export async function applyLocalMigrations(db: PGlite): Promise<string[]> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS "_local_migrations" (
      "name" TEXT PRIMARY KEY,
      "applied_at" TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
  const names = readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const applied: string[] = [];
  for (const name of names) {
    const existing = await db.query<{ name: string }>(
      `SELECT "name" FROM "_local_migrations" WHERE "name" = $1`,
      [name],
    );
    if (existing.rows.length > 0) continue;

    const sqlPath = path.join(migrationsDir, name, "migration.sql");
    const sql = readFileSync(sqlPath, "utf8");
    await db.exec("BEGIN");
    try {
      await db.exec(sql);
      await db.query(`INSERT INTO "_local_migrations" ("name") VALUES ($1)`, [name]);
      await db.exec("COMMIT");
      applied.push(name);
    } catch (error) {
      await db.exec("ROLLBACK");
      throw new Error(
        `Migration ${name} failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  return applied;
}
