import { PrismaClient } from '@/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!
})

const isDevelopment = process.env.NODE_ENV === 'development'

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDevelopment ? ['query'] : undefined,
    adapter
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
