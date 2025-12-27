import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Cache Prisma client globally in both development and production
// This prevents multiple PrismaClient instances and connection pool exhaustion
globalForPrisma.prisma = prisma;
