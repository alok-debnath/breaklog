import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function connect() {
  try {
    await prisma.$connect();
    console.log('Prisma connected successfully to the database');
  } catch (error: any) {
    return new Error(error.message);
    // process.exit(1);
  }
  // finally {
  //     await prisma.$disconnect();
  // }
}
