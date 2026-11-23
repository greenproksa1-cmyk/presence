import type { AuthUser } from "@/lib/session";

export type Permission =
  | "dashboard:view"
  | "registrations:view"
  | "registrations:manage"
  | "reports:view"
  | "audit:view"
  | "settings:manage"
  | "staff:manage"
  | "checkin:use";

const ADMIN_PERMISSIONS: readonly Permission[] = [
  "dashboard:view",
  "registrations:view",
  "registrations:manage",
  "reports:view",
  "audit:view",
  "settings:manage",
  "staff:manage",
  "checkin:use",
];

const STAFF_PERMISSIONS: readonly Permission[] = ["checkin:use"];

export function can(
  user: Pick<AuthUser, "role"> | null | undefined,
  permission: Permission,
): boolean {
  if (!user) return false;
  if (user.role === "ADMIN") return ADMIN_PERMISSIONS.includes(permission);
  if (user.role === "STAFF") return STAFF_PERMISSIONS.includes(permission);
  return false;
}

export function permissionsForRole(role: AuthUser["role"]): readonly Permission[] {
  return role === "ADMIN" ? ADMIN_PERMISSIONS : STAFF_PERMISSIONS;
}
