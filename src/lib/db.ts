import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function isDatabaseUnavailable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { code?: string; name?: string };
  return (
    candidate.name === "PrismaClientInitializationError" ||
    candidate.code === "P1000" ||
    candidate.code === "P1001" ||
    candidate.code === "P1002" ||
    candidate.code === "P2021" ||
    candidate.code === "P2022"
  );
}
