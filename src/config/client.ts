import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { env } from "./env";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaBetterSqlite3({
	url: env.DATABASE_URL,
});

export const PRISMA_CLIENT = new PrismaClient({
	adapter,
});
