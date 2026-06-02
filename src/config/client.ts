import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";
// export const PRISMA_CLIENT = new PrismaClient();


const adapter = new PrismaPg({
	connectionString: env.DATABASE_URL,
});

export const PRISMA_CLIENT = new PrismaClient({
	adapter,
});