import { PrismaClient } from '@prisma/client'; //<< Prisma client must generated into node_modules/@prisma/client, the build process can't find it

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
