import {
  LOCAL_DATABASE_URL,
  LOCAL_DB_DIR,
  applyLocalMigrations,
  openLocalDatabase,
} from "./local-db";

/**
 * `npm run db:setup:local`
 *
 * Creates the embedded PostgreSQL data directory and applies every Prisma
 * migration. Safe to re-run: applied migrations are recorded.
 */
async function main(): Promise<void> {
  console.log(`[db] data directory: ${LOCAL_DB_DIR}`);
  const db = await openLocalDatabase();
  try {
    const applied = await applyLocalMigrations(db);
    const tables = await db.query<{ count: number }>(
      `SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema = 'public'`,
    );
    console.log(
      applied.length > 0
        ? `[db] applied ${applied.length} migration(s): ${applied.join(", ")}`
        : "[db] schema already up to date",
    );
    console.log(`[db] public tables: ${tables.rows[0]?.count ?? 0}`);
    console.log(`[db] DATABASE_URL: ${LOCAL_DATABASE_URL}`);
  } finally {
    await db.close();
  }
}

main().catch((error: unknown) => {
  console.error("[db] setup failed:", error);
  process.exit(1);
});
