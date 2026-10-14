import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function withPrisma<T>(operation: (client: PrismaClient) => Promise<T>) {
  try {
    return await operation(prisma)
  } catch (error) {
    console.error('[v0] Prisma operation failed', error)
    throw error
  }
}
