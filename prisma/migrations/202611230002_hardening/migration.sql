-- Makkah Food Forum — hardening migration
-- Applied after the Prisma-generated schema. Safe to run on Supabase Postgres
-- and on the embedded PostgreSQL used for local development.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Registration number sequence
--    Human-readable, sequential numbers are issued inside the same transaction
--    that inserts the registration. The unique index is the final authority.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS "registration_number_seq" START WITH 1001 INCREMENT BY 1;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Integrity constraints Prisma cannot express
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "auth_sessions"
  ADD CONSTRAINT "auth_sessions_one_principal"
  CHECK (
    ("admin_user_id" IS NOT NULL AND "staff_user_id" IS NULL) OR
    ("admin_user_id" IS NULL AND "staff_user_id" IS NOT NULL)
  );

ALTER TABLE "audit_logs"
  ADD CONSTRAINT "audit_logs_actor_type_consistent"
  CHECK (
    "actor_type" = 'SYSTEM' OR "actor_id" IS NOT NULL
  );

ALTER TABLE "registrations"
  ADD CONSTRAINT "registrations_consent_at_not_future"
  CHECK ("consent_at" <= now() + interval '1 minute');

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Row Level Security
--
--    The application never talks to Postgres from the browser. All access is
--    server-side through the database owner (Prisma). These policies make that
--    explicit: Supabase's public PostgREST surface (anon / authenticated roles)
--    gets no access at all to attendee, ticket, staff or audit data.
--
--    RLS is ENABLED but not FORCED, because the trusted server connects as the
--    schema owner. If you later add a restricted application role, use FORCE
--    RLS and add policies for that role.
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "registrations"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tickets"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "check_ins"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_users"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "staff_users"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "auth_sessions"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "event_settings"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "email_logs"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "whatsapp_logs"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rate_limits"      ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
    REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
    REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;
  END IF;
END
$$;

-- No permissive policies are created on purpose. With RLS enabled, anon and
-- authenticated receive zero rows even if a future migration forgets a grant.

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Operational indexes
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "registrations_created_at_desc_idx"
  ON "registrations" ("created_at" DESC);
CREATE INDEX IF NOT EXISTS "registrations_org_type_created_idx"
  ON "registrations" ("organization_type", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "check_ins_checked_in_at_desc_idx"
  ON "check_ins" ("checked_in_at" DESC);
CREATE INDEX IF NOT EXISTS "audit_logs_created_at_desc_idx"
  ON "audit_logs" ("created_at" DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Retention helper
--    Removes expired sessions and old rate-limit buckets. The app calls this
--    opportunistically; it can also be scheduled with pg_cron on Supabase.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION "prune_ephemeral_rows"() RETURNS void
LANGUAGE sql SECURITY DEFINER AS $$
  DELETE FROM "auth_sessions" WHERE "expires_at" < now() - interval '7 days';
  DELETE FROM "rate_limits"   WHERE "window_start" < now() - interval '2 days';
$$;

REVOKE ALL ON FUNCTION "prune_ephemeral_rows"() FROM PUBLIC;
