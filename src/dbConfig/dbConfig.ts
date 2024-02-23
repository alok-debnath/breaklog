import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default prisma;

export async function connect() {
  try {
    await prisma.$connect();
    console.log('Prisma connected successfully to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
