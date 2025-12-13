import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Get the database URL from environment or use default
const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

// Extract the file path from the DATABASE_URL (remove "file:" prefix)
const dbPath = databaseUrl.replace(/^file:/, "");

// Create the adapter factory with the database path
const adapter = new PrismaBetterSqlite3({
  url: dbPath,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

