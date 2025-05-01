import { PrismaClient } from '@prisma/client'

declare global {
  // allow global var across hot-reloads in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NEXT_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['error'],
  })

if (process.env.NEXT_ENV !== 'production') {
  global.prisma = prisma
}
